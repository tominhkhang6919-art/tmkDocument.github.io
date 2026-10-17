-- ==============================================================================
-- TMK DOCUMENT — PRODUCTION SUPABASE DATABASE SCHEMA & MIGRATIONS
-- Nền tảng Quản lý & Tra cứu Tài liệu Học tập Sinh viên TMK document
-- Tác giả: Tô Minh Khang | 2026
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Sinh viên TMK',
  avatar_id TEXT NOT NULL DEFAULT 'student-1',
  theme TEXT NOT NULL DEFAULT 'midnight' CHECK (theme IN ('midnight', 'sakura')),
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to prevent regular users from self-elevating role
CREATE OR REPLACE FUNCTION public.check_profile_role_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Only allow role change if performed by service_role or admin
    IF auth.role() <> 'service_role' AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      NEW.role := OLD.role; -- Revert unauthorized role change
    END IF;
  END IF;
  NEW.updated_at := timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_check_profile_role_update ON public.profiles;
CREATE TRIGGER trg_check_profile_role_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_role_update();

-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_id, theme, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'Sinh viên TMK'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_id', 'student-1'),
    COALESCE(NEW.raw_user_meta_data->>'theme', 'midnight'),
    'student'
  )
  ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    avatar_id = EXCLUDED.avatar_id,
    theme = EXCLUDED.theme,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. TABLE: subject_groups (3 nhóm môn học chính)
CREATE TABLE IF NOT EXISTS public.subject_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'book-open',
  sort_order INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLE: subjects
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.subject_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  cover_color TEXT DEFAULT '#7568F5',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABLE: documents (Tài liệu học tập)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  size_bytes BIGINT NOT NULL DEFAULT 0,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABLE: saved_documents (Tài liệu đã lưu của người dùng)
CREATE TABLE IF NOT EXISTS public.saved_documents (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (user_id, document_id)
);

-- 7. TABLE: user_activity (Lịch sử hoạt động người dùng)
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('view_subject', 'view_document', 'download_document')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. INDEXES CHO TỐI ƯU HIỆU NĂNG TRUY VẤN
CREATE INDEX IF NOT EXISTS idx_subjects_group_id ON public.subjects(group_id);
CREATE INDEX IF NOT EXISTS idx_subjects_name_code ON public.subjects(name, code);
CREATE INDEX IF NOT EXISTS idx_documents_subject_id ON public.documents(subject_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON public.documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_saved_documents_user ON public.saved_documents(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON public.user_activity(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_action ON public.user_activity(user_id, action_type);

-- 9. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Helper function: check if caller is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- POLICIES: profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- POLICIES: subject_groups (Public view, Admin manage)
DROP POLICY IF EXISTS "Active subject groups are viewable by everyone" ON public.subject_groups;
CREATE POLICY "Active subject groups are viewable by everyone"
  ON public.subject_groups FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage subject groups" ON public.subject_groups;
CREATE POLICY "Admin can manage subject groups"
  ON public.subject_groups FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- POLICIES: subjects (Public view, Authenticated insert, Owner/Admin update/delete)
DROP POLICY IF EXISTS "Subjects are viewable by everyone" ON public.subjects;
CREATE POLICY "Subjects are viewable by everyone"
  ON public.subjects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create subjects" ON public.subjects;
CREATE POLICY "Authenticated users can create subjects"
  ON public.subjects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Subject creator or admin can update subject" ON public.subjects;
CREATE POLICY "Subject creator or admin can update subject"
  ON public.subjects FOR UPDATE
  USING (auth.uid() = created_by OR public.is_admin())
  WITH CHECK (auth.uid() = created_by OR public.is_admin());

DROP POLICY IF EXISTS "Subject creator or admin can delete subject" ON public.subjects;
CREATE POLICY "Subject creator or admin can delete subject"
  ON public.subjects FOR DELETE
  USING (auth.uid() = created_by OR public.is_admin());

-- POLICIES: documents (Public view, Authenticated upload, Uploader/Admin update/delete)
DROP POLICY IF EXISTS "Documents metadata is viewable by everyone" ON public.documents;
CREATE POLICY "Documents metadata is viewable by everyone"
  ON public.documents FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can upload documents" ON public.documents;
CREATE POLICY "Authenticated users can upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Uploader or admin can update document" ON public.documents;
CREATE POLICY "Uploader or admin can update document"
  ON public.documents FOR UPDATE
  USING (auth.uid() = uploaded_by OR public.is_admin())
  WITH CHECK (auth.uid() = uploaded_by OR public.is_admin());

DROP POLICY IF EXISTS "Uploader or admin can delete document" ON public.documents;
CREATE POLICY "Uploader or admin can delete document"
  ON public.documents FOR DELETE
  USING (auth.uid() = uploaded_by OR public.is_admin());

-- POLICIES: saved_documents (Strict user privacy)
DROP POLICY IF EXISTS "Users can view their own saved documents" ON public.saved_documents;
CREATE POLICY "Users can view their own saved documents"
  ON public.saved_documents FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save documents for themselves" ON public.saved_documents;
CREATE POLICY "Users can save documents for themselves"
  ON public.saved_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove their own saved documents" ON public.saved_documents;
CREATE POLICY "Users can remove their own saved documents"
  ON public.saved_documents FOR DELETE
  USING (auth.uid() = user_id);

-- POLICIES: user_activity (Strict user privacy)
DROP POLICY IF EXISTS "Users can view their own activity history" ON public.user_activity;
CREATE POLICY "Users can view their own activity history"
  ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activity" ON public.user_activity;
CREATE POLICY "Users can insert their own activity"
  ON public.user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own activity" ON public.user_activity;
CREATE POLICY "Users can delete their own activity"
  ON public.user_activity FOR DELETE
  USING (auth.uid() = user_id);

-- 10. STORAGE BUCKET & STORAGE POLICIES
-- Tạo bucket 'study-documents' nếu chưa tồn tại
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-documents', 'study-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Cho phép mọi người đọc/tải tài liệu học tập
DROP POLICY IF EXISTS "Public can view study documents" ON storage.objects;
CREATE POLICY "Public can view study documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'study-documents');

-- Storage Policy: Cho phép người dùng đăng nhập tải file lên
DROP POLICY IF EXISTS "Authenticated users can upload study documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload study documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'study-documents' 
    AND auth.role() = 'authenticated'
  );

-- Storage Policy: Cho phép người tải lên hoặc Admin xóa file
DROP POLICY IF EXISTS "Owner or admin can delete study documents" ON storage.objects;
CREATE POLICY "Owner or admin can delete study documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'study-documents' 
    AND (
      auth.uid() = owner
      OR (auth.jwt()->>'sub')::uuid = owner
      OR public.is_admin()
    )
  );

-- 11. SEED DATA — 3 NHÓM MÔN HỌC & CÁC MÔN HỌC KHỞI TẠO
DO $$
DECLARE
  v_group_dc UUID;
  v_group_cs UUID;
  v_group_cn UUID;
BEGIN
  -- Insert 3 Nhóm môn học
  INSERT INTO public.subject_groups (name, slug, description, icon, sort_order, is_active)
  VALUES 
    (
      'Đại cương', 
      'dai-cuong', 
      'Các môn học nền tảng khoa học tự nhiên, khoa học xã hội và tư duy cơ bản cho tân sinh viên.', 
      'graduation-cap', 
      1, 
      true
    )
  ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order
  RETURNING id INTO v_group_dc;

  IF v_group_dc IS NULL THEN
    SELECT id INTO v_group_dc FROM public.subject_groups WHERE slug = 'dai-cuong';
  END IF;

  INSERT INTO public.subject_groups (name, slug, description, icon, sort_order, is_active)
  VALUES 
    (
      'Cơ sở ngành', 
      'co-so-nganh', 
      'Trang bị kiến thức cốt lõi, nguyên lý kỹ thuật và nền móng chuyên môn cho các học kỳ tiếp theo.', 
      'layers', 
      2, 
      true
    )
  ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order
  RETURNING id INTO v_group_cs;

  IF v_group_cs IS NULL THEN
    SELECT id INTO v_group_cs FROM public.subject_groups WHERE slug = 'co-so-nganh';
  END IF;

  INSERT INTO public.subject_groups (name, slug, description, icon, sort_order, is_active)
  VALUES 
    (
      'Chuyên ngành', 
      'chuyen-nganh', 
      'Các môn chuyên sâu, công nghệ ứng dụng, đồ án và nghiên cứu thực tiễn phục vụ định hướng nghề nghiệp.', 
      'cpu', 
      3, 
      true
    )
  ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order
  RETURNING id INTO v_group_cn;

  IF v_group_cn IS NULL THEN
    SELECT id INTO v_group_cn FROM public.subject_groups WHERE slug = 'chuyen-nganh';
  END IF;

  -- Insert Môn học mẫu cho Nhóm 1: Đại cương
  INSERT INTO public.subjects (group_id, name, code, description, cover_color)
  VALUES
    (v_group_dc, 'Giải tích 1', 'MAT101', 'Hàm một biến, giới hạn, đạo hàm, tích phân và các ứng dụng toán học.', '#7568F5'),
    (v_group_dc, 'Đại số tuyến tính', 'MAT102', 'Ma trận, định thức, hệ phương trình tuyến tính, không gian vector và phép biến đổi.', '#4F46E5'),
    (v_group_dc, 'Vật lý đại cương', 'PHY101', 'Cơ học, nhiệt học, điện từ học căn bản dành cho khối ngành kỹ thuật.', '#3B82F6'),
    (v_group_dc, 'Triết học Mác - Lênin', 'PHI101', 'Thế giới quan và phương pháp luận triết học duy vật biện chứng, duy vật lịch sử.', '#EC4899')
  ON CONFLICT DO NOTHING;

  -- Insert Môn học mẫu cho Nhóm 2: Cơ sở ngành
  INSERT INTO public.subjects (group_id, name, code, description, cover_color)
  VALUES
    (v_group_cs, 'Nhập môn Lập trình', 'CS101', 'Tư duy lập trình, kiểu dữ liệu, cấu trúc điều khiển và giải thuật cơ bản với C/C++ hoặc Python.', '#10B981'),
    (v_group_cs, 'Cấu trúc dữ liệu & Giải thuật', 'CS102', 'Danh sách liên kết, cây nhị phân, đồ thị, thuật toán sắp xếp và tìm kiếm tối ưu.', '#059669'),
    (v_group_cs, 'Cơ sở dữ liệu', 'DB101', 'Mô hình quan hệ, đại số quan hệ, thiết kế chuẩn hóa và truy vấn SQL nâng cao.', '#D97706'),
    (v_group_cs, 'Mạng máy tính', 'NET101', 'Mô hình OSI, TCP/IP, định tuyến, giao thức truyền thông mạng và bảo mật cơ bản.', '#0284C7')
  ON CONFLICT DO NOTHING;

  -- Insert Môn học mẫu cho Nhóm 3: Chuyên ngành
  INSERT INTO public.subjects (group_id, name, code, description, cover_color)
  VALUES
    (v_group_cn, 'Phát triển Ứng dụng Web', 'WEB301', 'Kiến trúc Fullstack, RESTful API, Frontend hiện đại, tối ưu hiệu năng và triển khai Cloud.', '#79E0C3'),
    (v_group_cn, 'Trí tuệ Nhân tạo & Machine Learning', 'AI301', 'Mô hình học máy có giám sát, không giám sát, Deep Learning và xử lý dữ liệu lớn.', '#8B5CF6'),
    (v_group_cn, 'Kỹ thuật Phần mềm', 'SE301', 'Quy trình Agile/Scrum, phân tích thiết kế hệ thống UML, kiểm thử và quản lý chất lượng phần mềm.', '#F59E0B'),
    (v_group_cn, 'An toàn & Bảo mật Thông tin', 'SEC301', 'Mã hóa dữ liệu, an toàn ứng dụng web, tấn công mạng và kỹ thuật phòng thủ.', '#EF4444')
  ON CONFLICT DO NOTHING;

END $$;
