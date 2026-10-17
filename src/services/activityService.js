import { supabase } from '../config/supabase.js';

export const activityService = {
  // Ghi nhật ký hoạt động có ý nghĩa của người dùng
  async logActivity({ userId, actionType, subjectId = null, documentId = null, metadata = {} }) {
    if (!userId) return; // Chỉ ghi nhật ký khi người dùng đã đăng nhập

    try {
      await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          action_type: actionType,
          subject_id: subjectId,
          document_id: documentId,
          metadata
        });
    } catch (err) {
      // Không để lỗi ghi log làm gián đoạn trải nghiệm của người dùng
      console.warn('Ghi log hoạt động không thành công:', err.message);
    }
  },

  // Lấy lịch sử hoạt động có phân trang và sắp xếp
  async getActivityHistory(userId, sortOrder = 'desc', limit = 50) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_activity')
      .select(`
        id,
        action_type,
        created_at,
        metadata,
        subjects (
          id,
          name,
          code
        ),
        documents (
          id,
          title,
          subject_id,
          storage_path,
          mime_type
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: sortOrder === 'asc' })
      .limit(limit);

    if (error) {
      console.warn('Lỗi lấy lịch sử hoạt động:', error.message);
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      action_type: item.action_type,
      created_at: item.created_at,
      subject: item.subjects,
      document: item.documents,
      target_title: item.documents?.title || item.subjects?.name || item.metadata?.title || 'Nội dung',
      subject_id: item.subjects?.id || item.documents?.subject_id || item.metadata?.subject_id
    }));
  },

  // Lấy danh sách tài liệu đã tải: mỗi tài liệu 1 dòng kèm thời điểm tải gần nhất
  async getDownloadedDocuments(userId, sortOrder = 'desc') {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_activity')
      .select(`
        id,
        created_at,
        metadata,
        documents (
          id,
          title,
          description,
          original_filename,
          storage_path,
          mime_type,
          size_bytes,
          subjects (
            id,
            name,
            code
          )
        )
      `)
      .eq('user_id', userId)
      .eq('action_type', 'download_document')
      .order('created_at', { ascending: false }); // Luôn lấy mới nhất trước để gộp

    if (error) {
      console.warn('Lỗi lấy danh sách tài liệu đã tải:', error.message);
      throw error;
    }

    // Gộp deduplicate: mỗi tài liệu lấy bản ghi tải gần nhất
    const uniqueDocsMap = new Map();
    for (const item of (data || [])) {
      const doc = item.documents;
      if (!doc) continue; // Tài liệu có thể đã bị xóa
      if (!uniqueDocsMap.has(doc.id)) {
        uniqueDocsMap.set(doc.id, {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          original_filename: doc.original_filename,
          storage_path: doc.storage_path,
          mime_type: doc.mime_type,
          size_bytes: doc.size_bytes,
          subject_id: doc.subjects?.id,
          subject_name: doc.subjects?.name || 'Môn học',
          subject_code: doc.subjects?.code || '',
          downloaded_at: item.created_at
        });
      }
    }

    const result = Array.from(uniqueDocsMap.values());
    if (sortOrder === 'asc') {
      result.sort((a, b) => new Date(a.downloaded_at) - new Date(b.downloaded_at));
    } else {
      result.sort((a, b) => new Date(b.downloaded_at) - new Date(a.downloaded_at));
    }
    return result;
  }
};

