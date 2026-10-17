-- ==============================================================================
-- TMK DOCUMENT — RLS VALIDATION & SECURITY TESTS
-- Kiểm tra các chính sách Row Level Security (RLS)
-- ==============================================================================

-- Test 1: Khách vãng lai (Anon) có thể xem danh mục nhóm môn học
SELECT count(*) AS public_groups_count 
FROM public.subject_groups 
WHERE is_active = true;

-- Test 2: Khách vãng lai có thể xem danh mục môn học
SELECT count(*) AS public_subjects_count 
FROM public.subjects;

-- Test 3: Khách vãng lai có thể xem danh sách tài liệu công khai
SELECT count(*) AS public_docs_count 
FROM public.documents;

-- Test 4: Khách vãng lai KHÔNG thể truy vấn dữ liệu tài liệu đã lưu của người dùng khác
-- Kết quả trả về 0 dòng vì auth.uid() là NULL
SELECT count(*) AS anon_saved_docs_count 
FROM public.saved_documents;

-- Test 5: Khách vãng lai KHÔNG thể xem lịch sử hoạt động cá nhân
-- Kết quả trả về 0 dòng vì auth.uid() là NULL
SELECT count(*) AS anon_activity_count 
FROM public.user_activity;

-- Test 6: Kiểm tra trigger chặn người dùng tự nâng quyền admin
-- (Được thực thi tự động bởi trg_check_profile_role_update)

