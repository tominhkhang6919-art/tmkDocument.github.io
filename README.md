# TMK Document — Nền Tảng Quản Lý & Tra Cứu Tài Liệu Học Tập Dành Cho Sinh Viên

> **Thương hiệu:** TMK Document (TMK — chữ chính nổi bật, DOCUMENT — chữ phụ)  
> **Nhân vật minh họa thương hiệu:** Student (Hình tượng sinh viên đại học năng động, đeo balo, mang tài liệu học tập)  
> **Tác giả:** Tô Minh Khang — 2026  
> **Thông điệp:** “Cảm ơn bạn đã trải nghiệm, chúc bạn gặt hái được nhiều thành công”

---

## 1. Giới thiệu dự án

**TMK Document** là nền tảng web production-ready toàn diện hỗ trợ sinh viên các trường đại học, cao đẳng quản lý, tra cứu, lưu trữ và chia sẻ tài liệu học tập (đề thi, giáo trình, bài giảng, bài tập lớn, đồ án).

Hệ thống được thiết kế theo phong cách **Modern Student Workspace** chuẩn mực, hỗ trợ đa nền tảng (laptop, máy tính bảng, điện thoại di động) và được tích hợp trực tiếp với cơ sở dữ liệu đám mây **Supabase** (PostgreSQL, Supabase Storage, Supabase Auth và Row Level Security).

---

## 2. Các tính năng đã hoàn thành

### 2.1. Trải nghiệm Intro Screen & Nhận diện thương hiệu
- **Màn hình chào đón (Intro Screen)**:
  - Xuất hiện tự động khi người dùng mở website lần đầu trong một phiên duyệt (`sessionStorage`).
  - Hiển thị logo **TMK Document** trung tâm sắc nét, tagline *“Không gian tài liệu học tập của bạn”* và thông điệp *“Khám phá · Học tập · Phát triển”*.
  - Các trang tài liệu học tập và quầng sáng mềm mại chuyển động xung quanh tạo chiều sâu thị giác.
  - Tự động đồng bộ chuẩn xác với bộ màu Theme đang sử dụng (Theme A: Navy + Indigo + Mint; Theme B: Ivory + Teal + Coral).
  - Nút **“Vào trang chủ” / “Bỏ qua”** nhỏ gọn, dễ bấm, cùng cơ chế thoát an toàn (fallback timer tối đa 3.5s) đảm bảo người dùng không bao giờ bị kẹt.
  - Hỗ trợ đầy đủ `prefers-reduced-motion` đối với người dùng hạn chế chuyển động.
- **Logo độc quyền TMK Document**: Thiết kế vector SVG sắc nét kết hợp chữ TMK nổi bật, chữ DOCUMENT căn chỉnh chuyên nghiệp, biểu tượng tập hồ sơ số hóa và mũ cử nhân.
- **Nhân vật minh họa Student**: Thay thế hoàn toàn nhân vật que / nhãn Actor cũ bằng hình minh họa cậu sinh viên đại học đeo balo, tay cầm tập tài liệu học tập thân thiện.
- **Nút Menu Tam Giác (Triangle Menu Button)**: Nút tam giác biểu tượng mở/đóng hệ thống Navigation Drawer linh hoạt trên mọi kích thước màn hình.
- **Hệ thống 2 Bộ màu (Theme Switcher)**:
  - **Theme A — Midnight Study**: Midnight Navy (`#172033`), Electric Indigo (`#7568F5`), Soft Mint (`#79E0C3`) — phong cách tập trung, hiện đại và công nghệ.
  - **Theme B — Sakura Paper**: Warm Ivory (`#FFF8F0`), Forest Teal (`#286B62`), Soft Coral (`#F28C78`) — phong cách ấm áp, sáng tạo và nhẹ nhàng.
  - Lưu và đồng bộ lựa chọn Theme vào cơ sở dữ liệu `profiles` trên Supabase, đồng thời cache `localStorage` để chống giật nhấp nháy giao diện khi tải trang.
- **Bộ 10 hình đại diện sinh viên (Student Avatars)**: 10 nhân vật sinh viên dạng vector SVG tích hợp sẵn trong ứng dụng, có tên và cá tính riêng biệt (Minh Triết, Lan Anh, Tuấn Kiệt, Bảo Châu, Hoàng Nam, Phương Thảo, Đức Anh, Mai Linh, Hải Đăng, Kim Ngân).

### 2.2. Phân loại 3 Nhóm môn học & Quản lý môn học
- **3 Nhóm môn học cốt lõi**:
  1. **Đại cương**: Toán giải tích, đại số tuyến tính, vật lý, triết học,...
  2. **Cơ sở ngành**: Nhập môn lập trình, cấu trúc dữ liệu, cơ sở dữ liệu, mạng máy tính,...
  3. **Chuyên ngành**: Lập trình Web Fullstack, Trí tuệ nhân tạo, Kỹ thuật phần mềm, An toàn thông tin,...
- Dữ liệu nhóm môn được quản lý động từ bảng `subject_groups` trên Supabase (không viết cứng trong frontend).
- **Thẻ môn học chi tiết**: Mã môn (`CS101`, `MAT101`), tên môn, nhóm môn, mô tả tóm tắt, số lượng tài liệu thời gian thực.

### 2.3. Tìm kiếm thông minh (Smart Search)
- Tìm kiếm theo tên môn học, mã môn học và mô tả môn học.
- Không phân biệt chữ hoa/thường.
- Hỗ trợ tiếng Việt có dấu và không dấu (nhập `"dai so"` vẫn tìm thấy `"Đại số tuyến tính"`).
- Kỹ thuật Debounce 200ms giúp giảm tải số lượng truy vấn, kèm nút xóa nhanh từ khóa (X).
- Hỗ trợ lọc theo từng nhóm môn học hoặc toàn bộ danh mục.

### 2.4. Quản lý & Tương tác tài liệu (Document Management)
- **Tải lên tài liệu thực tế (Upload)**:
  - Tải file nhị phân trực tiếp lên **Supabase Storage** bucket `study-documents`.
  - Lưu metadata (`title`, `description`, `original_filename`, `storage_path`, `mime_type`, `size_bytes`, `uploaded_by`) vào bảng `documents` trong PostgreSQL.
  - Cơ chế tự động dọn dẹp Storage nếu quá trình ghi database gặp sự cố (rollback).
  - Kiểm tra định dạng file (PDF, hình ảnh, TXT, tài liệu văn phòng, file nén) và giới hạn kích thước tối đa 25MB.
- **Xem trước tài liệu (Preview Viewer)**:
  - **PDF**: Trình xem nhúng tương tác trực tiếp trên giao diện.
  - **Hình ảnh** (PNG, JPG, WEBP): Trình xem ảnh sắc nét.
  - **Văn bản** (TXT, MD): Khung hiển thị code/text có thanh cuộn mượt mà.
  - **Các định dạng khác**: Hộp thoại thông tin và nút tải về trực tiếp.
- **Tải xuống thực tế (Download)**: Tải blob file gốc từ Supabase Storage về máy tính/điện thoại người dùng, ghi nhận vào lịch sử tải.
- **Xóa tài liệu (Delete)**: Modal xác nhận hiển thị rõ tên tài liệu, xóa đồng thời file trong Storage và bản ghi trong PostgreSQL (chỉ người tải lên hoặc Admin mới có quyền).

### 2.5. Không gian sinh viên cá nhân (Personal Workspace)
- **Tài liệu đã lưu (Saved Documents)**:
  - Đánh dấu yêu thích lưu vào bảng `saved_documents` (khóa chính tổng hợp `[user_id, document_id]` ngăn trùng lặp).
  - Bỏ lưu và đồng bộ tức thì trên giao diện và backend.
- **Tài liệu đã tải (Downloaded Documents)**:
  - Quản lý các file mà người dùng đã bấm tải về.
  - Tự động gộp mỗi tài liệu hiển thị một lần kèm thời điểm tải gần nhất để giao diện gọn gàng.
- **Lịch sử hoạt động (Activity History)**:
  - Ghi nhận: xem chi tiết môn học (`view_subject`), mở xem tài liệu (`view_document`), khởi tạo tải xuống (`download_document`).
  - Cho phép bấm nút "Mở lại" để quay về đúng môn học hoặc tài liệu.
- **Bộ sắp xếp thời gian**: Tùy chọn sắp xếp **"Mới nhất trước"** (mặc định) và **"Cũ nhất trước"** dựa trên trường thời gian UTC chuẩn của Supabase, tự động chuyển đổi sang múi giờ địa phương.

### 2.6. Xác thực & Hồ sơ sinh viên (Supabase Auth)
- Đăng ký tài khoản sinh viên bằng Email + Mật khẩu + Tên hiển thị + Chọn Avatar ban đầu.
- Đăng nhập, đăng xuất, tự động duy trì và khôi phục phiên làm việc (Session Persistence) khi tải lại trang hoặc mở tab mới.
- Hộp thoại cập nhật hồ sơ: Đổi tên hiển thị, đổi ảnh đại diện trong bộ 10 nhân vật Student.

---

## 3. Công nghệ sử dụng

- **Frontend**: HTML5 ngữ nghĩa, CSS3 Variables & Design Tokens (Mobile-First Responsive), JavaScript ES Modules chuẩn hiện đại.
- **Build Tool**: [Vite](https://vitejs.dev/) v8 (tối ưu hóa bundle, build siêu tốc).
- **Backend & Cloud Services**: [Supabase](https://supabase.com/)
  - **PostgreSQL**: Lưu trữ bảng dữ liệu có quan hệ, ràng buộc khóa ngoại, trigger và indexes.
  - **Supabase Storage**: Bucket `study-documents` lưu trữ file tài liệu vật lý.
  - **Supabase Auth**: Quản lý phiên xác thực người dùng an toàn.
  - **Row Level Security (RLS)**: Chính sách bảo mật phân quyền ở tầng cơ sở dữ liệu.

---

## 4. Yêu cầu môi trường

- **Node.js**: Phiên bản 18.x, 20.x hoặc mới nhất (Khuyến nghị Node.js >= 18).
- **npm**: Phiên bản >= 9.x (đi kèm với Node.js).
- Một trình duyệt web hiện đại (Google Chrome, Microsoft Edge, Firefox, Safari).

---

## 5. Cách cài đặt Node.js và Dependencies

1. Mở cửa sổ dòng lệnh (Terminal / PowerShell) tại thư mục dự án `d:\Web_learn\Document_st`.
2. Chạy lệnh cài đặt các gói phụ thuộc:
```bash
npm install
```

---

## 6. Cách cấu hình biến môi trường (`.env.local`)

Hệ thống đã có sẵn template mẫu trong file `.env.example`. Tạo file `.env.local` ở thư mục gốc:

```env
# URL Dự án Supabase (Không dùng đường dẫn /rest/v1/)
VITE_SUPABASE_URL=https://qgthtmsiscbomdkpvytr.supabase.co

# Anon Public Key (Khóa công khai an toàn dùng ở Frontend)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFndGh0bXNpc2Nib21ka3B2eXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMDgyOTIsImV4cCI6MjEwNzc4NDI5Mn0.ZaHeb3XT3S3HEjxuicJJgZCXHzrsnX_AenT5DFRhFK8

# Tên Storage Bucket lưu trữ file tài liệu
VITE_STORAGE_BUCKET=study-documents
```

> **Lưu ý bảo mật quan trọng:** Tuyệt đối **không** đưa `service_role` key hoặc database connection password vào file `.env.local` của Frontend. File `.env.local` đã được cấu hình trong `.gitignore` để không bị commit lên kho mã nguồn.

---

## 7. Cách chạy Supabase Migrations

Toàn bộ cấu trúc cơ sở dữ liệu, các bảng, chỉ mục (indexes), trigger và dữ liệu mẫu 3 nhóm môn học được viết sẵn trong file:
- `supabase/supabase_document.sql` (hoặc `supabase/migrations/01_initial_schema.sql`)

### Các bước thực hiện trên Supabase Dashboard:
1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard/project/qgthtmsiscbomdkpvytr).
2. Vào mục **SQL Editor** ở thanh menu bên trái.
3. Nhấn **New Query**.
4. Sao chép toàn bộ nội dung trong file `supabase/supabase_document.sql` và dán vào cửa sổ truy vấn.
5. Nhấn **Run** (phím tắt `Ctrl + Enter` hoặc `Cmd + Enter`).
6. Kiểm tra bảng `subject_groups` và `subjects` trong mục **Table Editor** đã xuất hiện đầy đủ dữ liệu 3 nhóm môn khởi tạo.

---

## 8. Cách thiết lập Storage Bucket và Policies

File SQL `supabase/supabase_document.sql` đã tự động khai báo bucket và policies. Nếu muốn cấu hình hoặc kiểm tra thủ công qua Dashboard:
1. Vào mục **Storage** trong Supabase Dashboard.
2. Kiểm tra xem bucket có tên `study-documents` đã tồn tại chưa:
   - Nếu chưa, nhấn **New bucket**, đặt tên `study-documents`.
   - Bật tùy chọn **Public bucket** (để người dùng có thể xem trước và tải tài liệu học tập).
3. Vào tab **Policies** của bucket `study-documents`:
   - **SELECT policy**: Cho phép `public` đọc/xem file.
   - **INSERT policy**: Cho phép người dùng đã xác thực (`authenticated`) tải file lên.
   - **DELETE policy**: Cho phép người tải file (`owner = auth.uid()`) hoặc tài khoản có role `admin` xóa file.

---

## 9. Cách tạo tài khoản, đăng nhập và phân quyền Admin

### 9.1. Đăng ký & Đăng nhập người dùng:
1. Mở website, nhấn nút **Đăng nhập** ở góc trên bên phải thanh Header.
2. Nhấn vào dòng **"Chưa có tài khoản? Đăng ký ngay"**.
3. Điền họ tên sinh viên, email, mật khẩu (tối thiểu 6 ký tự) và chọn 1 trong 10 ảnh đại diện.
4. Nhấn **Đăng ký tài khoản**. Hệ thống sẽ tự động đăng nhập và tạo hồ sơ trong bảng `profiles`.

### 9.2. Thiết lập quyền Quản trị viên (Admin):
Để đảm bảo an toàn, quyền `admin` **không** được cho phép nâng trực tiếp từ giao diện người dùng mà chỉ được phân cấp bởi người quản trị qua SQL.
Để chỉ định một tài khoản làm admin:
1. Lấy `id` của người dùng từ bảng `auth.users` hoặc `public.profiles`.
2. Mở **SQL Editor** trong Supabase Dashboard và chạy lệnh:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'UUID_NGUOI_DUNG_O_DAY';
```
Khi có quyền `admin`, tài khoản có thể quản lý, xóa mọi tài liệu trên hệ thống.

---

## 10. Cách chạy môi trường phát triển (Development)

Chạy lệnh:
```bash
npm run dev
```
Trình duyệt sẽ mở tại địa chỉ: `http://localhost:5173` (hoặc cổng hiển thị trong terminal). Mọi thay đổi trong code sẽ tự động cập nhật ngay lập tức (Hot Module Replacement - HMR).

---

## 11. Cách Build Production

Chạy lệnh:
```bash
npm run build
```
Vite sẽ biên dịch và tối ưu toàn bộ mã nguồn vào thư mục `dist/`.

---

## 12. Cách kiểm tra Build thành công

Sau khi chạy `npm run build`, bạn có thể kiểm tra sản phẩm build thực tế bằng lệnh preview:
```bash
npm run preview
```
Terminal sẽ cung cấp đường link cục bộ (ví dụ: `http://localhost:4173`) để bạn trải nghiệm phiên bản production hoàn chỉnh trước khi triển khai.

---

## 13. Cách triển khai website lên Hosting

Thư mục `dist/` có thể được triển khai trực tiếp lên bất kỳ nền tảng tĩnh (Static Web Hosting) nào:

### Triển khai lên Vercel:
1. Cài đặt Vercel CLI: `npm i -g vercel`.
2. Chạy lệnh: `vercel`.
3. Nhập các biến môi trường `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong mục Environment Variables của Vercel Dashboard.

### Triển khai lên Netlify:
1. Đẩy mã nguồn lên GitHub/GitLab.
2. Tạo New site trên Netlify từ Git repository.
3. Thiết lập:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Thêm Environment Variables tương ứng.

---

## 14. Các lỗi thường gặp và cách khắc phục

| Lỗi | Nguyên nhân | Cách khắc phục |
|---|---|---|
| Màn hình hiển thị "Chưa kết nối được với bảng dữ liệu Supabase" | Chưa chạy script SQL migration tạo bảng | Vào Supabase SQL Editor và chạy toàn bộ nội dung file `supabase/supabase_document.sql`. |
| Lỗi `row-level security policy for table violates...` khi tải tài liệu | Chưa cấu hình hoặc chưa bật RLS policy đúng | Chạy lại phần RLS policies trong `supabase/supabase_document.sql`. Đảm bảo người dùng đã đăng nhập khi upload. |
| Không tải được file lên Storage (`Bucket not found`) | Bucket `study-documents` chưa được tạo | Tạo bucket có tên chính xác `study-documents` và đặt quyền Public trong mục Storage của Supabase Dashboard. |
| Dung lượng file vượt quá giới hạn | File tải lên lớn hơn 25MB | Nén file hoặc chọn file tài liệu có kích thước dưới 25MB. |
| Bị chặn đổi Theme hoặc đổi Avatar | Chưa đăng nhập tài khoản | Hệ thống cho phép khách xem tài liệu, nhưng các tính năng lưu hồ sơ cá nhân yêu cầu tài khoản sinh viên. |

---

*Dự án được xây dựng với tâm huyết dành cho cộng đồng sinh viên.*  
**Tô Minh Khang | 2026**

