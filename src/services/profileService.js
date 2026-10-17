import { supabase } from '../config/supabase.js';

export const profileService = {
  // Lấy hồ sơ người dùng
  async getProfile(userId) {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_id, theme, role, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Lỗi lấy profile:', error.message);
      return null;
    }
    return data;
  },

  // Cập nhật hồ sơ (chỉ cho phép cập nhật tên, avatar và theme)
  async updateProfile(userId, { display_name, avatar_id, theme }) {
    if (!userId) throw new Error('Yêu cầu đăng nhập để cập nhật hồ sơ');

    const updatePayload = {
      updated_at: new Date().toISOString()
    };
    if (display_name !== undefined) updatePayload.display_name = display_name.trim();
    if (avatar_id !== undefined) updatePayload.avatar_id = avatar_id;
    if (theme !== undefined) updatePayload.theme = theme;

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Cập nhật riêng theme
  async updateTheme(userId, theme) {
    if (!userId) return;
    try {
      await supabase
        .from('profiles')
        .update({ theme, updated_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (e) {
      console.warn('Không thể lưu theme lên Supabase:', e.message);
    }
  }
};

