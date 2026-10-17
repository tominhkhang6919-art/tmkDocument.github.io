import { supabase } from '../config/supabase.js';

export function removeVietnameseTones(str) {
  if (!str) return '';
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str.trim();
}

export const subjectService = {
  // Lấy 3 nhóm môn học từ Supabase
  async getSubjectGroups() {
    const { data, error } = await supabase
      .from('subject_groups')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('Lỗi lấy nhóm môn từ Supabase:', error.message);
      throw error;
    }
    return data || [];
  },

  // Lấy danh sách môn học kèm số lượng tài liệu
  async getSubjects(groupId = null) {
    let query = supabase
      .from('subjects')
      .select(`
        id,
        group_id,
        name,
        code,
        description,
        cover_color,
        created_at,
        subject_groups (
          id,
          name,
          slug
        ),
        documents (
          id
        )
      `)
      .order('name', { ascending: true });

    if (groupId) {
      query = query.eq('group_id', groupId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Lỗi lấy môn học từ Supabase:', error.message);
      throw error;
    }

    return (data || []).map(subject => ({
      ...subject,
      group_name: subject.subject_groups?.name || 'Chung',
      document_count: Array.isArray(subject.documents) ? subject.documents.length : 0
    }));
  },

  // Lấy thông tin chi tiết một môn học theo ID
  async getSubjectById(subjectId) {
    if (!subjectId) return null;

    const { data, error } = await supabase
      .from('subjects')
      .select(`
        id,
        group_id,
        name,
        code,
        description,
        cover_color,
        created_at,
        subject_groups (
          id,
          name,
          slug,
          description
        ),
        documents (
          id
        )
      `)
      .eq('id', subjectId)
      .maybeSingle();

    if (error) {
      console.warn('Lỗi lấy chi tiết môn:', error.message);
      throw error;
    }

    if (!data) return null;

    return {
      ...data,
      group_name: data.subject_groups?.name || 'Chung',
      document_count: Array.isArray(data.documents) ? data.documents.length : 0
    };
  },

  // Tìm kiếm môn học hỗ trợ tiếng Việt có dấu và không dấu
  async searchSubjects(keyword = '', groupId = null) {
    const allSubjects = await this.getSubjects(groupId);
    if (!keyword || !keyword.trim()) return allSubjects;

    const normalizedKeyword = removeVietnameseTones(keyword);

    return allSubjects.filter(sub => {
      const nameMatch = removeVietnameseTones(sub.name).includes(normalizedKeyword);
      const codeMatch = sub.code && removeVietnameseTones(sub.code).includes(normalizedKeyword);
      const descMatch = sub.description && removeVietnameseTones(sub.description).includes(normalizedKeyword);
      return nameMatch || codeMatch || descMatch;
    });
  }
};

