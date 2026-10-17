import { supabase, STORAGE_BUCKET } from '../config/supabase.js';

export const documentService = {
  // Lấy danh sách tài liệu theo môn học
  async getDocumentsBySubject(subjectId) {
    if (!subjectId) return [];

    const { data, error } = await supabase
      .from('documents')
      .select(`
        id,
        subject_id,
        title,
        description,
        original_filename,
        storage_path,
        mime_type,
        size_bytes,
        uploaded_by,
        created_at,
        profiles:uploaded_by (
          id,
          display_name,
          avatar_id
        )
      `)
      .eq('subject_id', subjectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Lỗi lấy tài liệu:', error.message);
      throw error;
    }
    return data || [];
  },

  // Upload tài liệu lên Supabase Storage và lưu metadata vào PostgreSQL
  async uploadDocument({ file, subjectId, title, description, userId }) {
    if (!file) throw new Error('Vui lòng chọn file tải lên');
    if (!subjectId) throw new Error('Môn học không hợp lệ');
    if (!userId) throw new Error('Bạn cần đăng nhập để tải tài liệu lên');
    if (!title || !title.trim()) throw new Error('Vui lòng nhập tên tài liệu');

    // Giới hạn dung lượng file: tối đa 25MB
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('Dung lượng file vượt quá giới hạn cho phép (tối đa 25MB)');
    }

    // Chuẩn hóa tên file an toàn
    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_');
    const storagePath = `subjects/${subjectId}/${Date.now()}_${cleanFileName}`;

    // 1. Tải file vật lý lên Supabase Storage bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream'
      });

    if (storageError) {
      console.error('Lỗi upload Supabase Storage:', storageError);
      throw new Error(`Tải file lên Storage thất bại: ${storageError.message}`);
    }

    // 2. Ghi metadata vào cơ sở dữ liệu
    try {
      const { data: docData, error: dbError } = await supabase
        .from('documents')
        .insert({
          subject_id: subjectId,
          title: title.trim(),
          description: (description || '').trim(),
          original_filename: file.name,
          storage_path: storagePath,
          mime_type: file.type || 'application/octet-stream',
          size_bytes: file.size,
          uploaded_by: userId
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      return docData;
    } catch (insertError) {
      // Dọn dẹp file trong storage nếu insert metadata thất bại
      console.warn('DB insert failed, rolling back uploaded storage file:', storagePath);
      await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
      throw new Error(`Lưu thông tin tài liệu thất bại: ${insertError.message}`);
    }
  },

  // Lấy URL xem trực tiếp hoặc tải file
  getDocumentUrl(storagePath) {
    if (!storagePath) return '';
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
    return data?.publicUrl || '';
  },

  // Tải file thực tế về máy tính / điện thoại
  async downloadDocumentFile(doc) {
    if (!doc || !doc.storage_path) throw new Error('Thông tin tài liệu không hợp lệ');

    // Tải blob từ Supabase Storage
    const { data: blob, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(doc.storage_path);

    if (error) {
      // Fallback lấy public URL nếu download blob gặp chính sách riêng
      const publicUrl = this.getDocumentUrl(doc.storage_path);
      if (publicUrl) {
        const a = document.createElement('a');
        a.href = publicUrl;
        a.target = '_blank';
        a.download = doc.original_filename || 'tai_lieu_tmk';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
      }
      throw new Error(`Không thể tải file: ${error.message}`);
    }

    // Tạo link blob tải xuống chuẩn browser
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.original_filename || 'tai_lieu_tmk';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return true;
  },

  // Xóa tài liệu khỏi database và storage
  async deleteDocument(documentId, storagePath) {
    if (!documentId) throw new Error('ID tài liệu không hợp lệ');

    // 1. Xóa trong database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (dbError) throw dbError;

    // 2. Xóa trong Storage
    if (storagePath) {
      try {
        await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
      } catch (storageErr) {
        console.warn('Lỗi dọn dẹp Storage:', storageErr.message);
      }
    }

    return true;
  },

  // Lưu tài liệu cá nhân (Bookmark)
  async saveDocument(documentId, userId) {
    if (!userId) throw new Error('Vui lòng đăng nhập để lưu tài liệu');
    const { data, error } = await supabase
      .from('saved_documents')
      .insert({
        user_id: userId,
        document_id: documentId
      })
      .select();

    if (error) {
      // Nếu đã lưu rồi thì bỏ qua lỗi trùng lặp
      if (error.code === '23505') return true;
      throw error;
    }
    return data;
  },

  // Bỏ lưu tài liệu
  async unsaveDocument(documentId, userId) {
    if (!userId) throw new Error('Vui lòng đăng nhập');
    const { error } = await supabase
      .from('saved_documents')
      .delete()
      .eq('user_id', userId)
      .eq('document_id', documentId);

    if (error) throw error;
    return true;
  },

  // Lấy danh sách ID các tài liệu đã lưu của user
  async getUserSavedDocIds(userId) {
    if (!userId) return new Set();
    const { data, error } = await supabase
      .from('saved_documents')
      .select('document_id')
      .eq('user_id', userId);

    if (error) {
      console.warn('Lỗi lấy saved doc ids:', error.message);
      return new Set();
    }
    return new Set((data || []).map(row => row.document_id));
  },

  // Lấy toàn bộ tài liệu đã lưu với chi tiết môn học kèm sắp xếp
  async getSavedDocuments(userId, sortOrder = 'desc') {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('saved_documents')
      .select(`
        created_at,
        documents (
          id,
          title,
          description,
          original_filename,
          storage_path,
          mime_type,
          size_bytes,
          created_at,
          subjects (
            id,
            name,
            code
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: sortOrder === 'asc' });

    if (error) {
      console.warn('Lỗi lấy tài liệu đã lưu:', error.message);
      throw error;
    }

    // Lọc bỏ các tài liệu đã bị xóa khỏi hệ thống
    return (data || [])
      .filter(item => item.documents !== null)
      .map(item => ({
        saved_at: item.created_at,
        ...item.documents,
        subject_name: item.documents.subjects?.name || 'Môn học',
        subject_code: item.documents.subjects?.code || ''
      }));
  }
};

