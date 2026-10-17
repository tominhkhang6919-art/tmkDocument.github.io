import { supabase } from '../config/supabase.js';

export const authService = {
  // Lấy session hiện tại
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (err) {
      console.warn('getSession error:', err.message);
      return null;
    }
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user;
    } catch (err) {
      console.warn('getCurrentUser error:', err.message);
      return null;
    }
  },

  // Đăng ký tài khoản mới bằng Email + Mật khẩu
  async signUp(email, password, displayName = 'Sinh viên TMK', avatarId = 'student-1') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          avatar_id: avatarId,
          theme: 'midnight'
        }
      }
    });

    if (error) throw error;

    // Đảm bảo bảng profiles có bản ghi ngay cả khi trigger bị trễ
    if (data.user) {
      try {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          display_name: displayName,
          avatar_id: avatarId,
          theme: 'midnight',
          role: 'student'
        }, { onConflict: 'id' });
      } catch (profileErr) {
        console.warn('Profile upsert fallback warning:', profileErr.message);
      }
    }

    return data;
  },

  // Đăng nhập bằng Email + Mật khẩu
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  // Đăng xuất
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },

  // Lắng nghe thay đổi trạng thái xác thực
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

