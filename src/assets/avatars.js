// Bộ 10 hình đại diện sinh viên (Student Avatars) chuẩn Vector SVG sắc nét
export const STUDENT_AVATARS = [
  {
    id: 'student-1',
    name: 'Minh Triết',
    role: 'Mọt sách thông thái',
    bg: '#4F46E5',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#4F46E5"/>
      <circle cx="50" cy="40" r="20" fill="#FCD34D"/>
      <path d="M30 35 Q50 15 70 35 C65 22 35 22 30 35 Z" fill="#1E293B"/>
      <!-- Glasses -->
      <rect x="36" y="36" width="11" height="8" rx="2" fill="none" stroke="#1E293B" stroke-width="2.5"/>
      <rect x="53" y="36" width="11" height="8" rx="2" fill="none" stroke="#1E293B" stroke-width="2.5"/>
      <line x1="47" y1="40" x2="53" y2="40" stroke="#1E293B" stroke-width="2.5"/>
      <!-- Smile -->
      <path d="M44 48 Q50 54 56 48" stroke="#1E293B" stroke-width="2" stroke-linecap="round"/>
      <!-- Body & Shirt -->
      <path d="M22 88 C25 65 38 60 50 60 C62 60 75 65 78 88" fill="#3B82F6"/>
      <path d="M45 60 L50 72 L55 60" fill="#FFFFFF"/>
    </svg>`
  },
  {
    id: 'student-2',
    name: 'Lan Anh',
    role: 'Sáng tạo & Năng động',
    bg: '#EC4899',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#EC4899"/>
      <circle cx="50" cy="42" r="20" fill="#FDE68A"/>
      <!-- Long Hair -->
      <path d="M26 40 C24 60 30 75 32 80 C36 55 35 30 50 22 C65 30 64 55 68 80 C70 75 76 60 74 40 C72 24 62 18 50 18 C38 18 28 24 26 40 Z" fill="#451A03"/>
      <!-- Face features -->
      <circle cx="43" cy="42" r="2.5" fill="#1E293B"/>
      <circle cx="57" cy="42" r="2.5" fill="#1E293B"/>
      <path d="M45 50 Q50 55 55 50" stroke="#BE185D" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Headband -->
      <path d="M32 30 Q50 20 68 30" stroke="#79E0C3" stroke-width="4" stroke-linecap="round"/>
      <!-- Body -->
      <path d="M25 90 C28 68 38 62 50 62 C62 62 72 68 75 90" fill="#F43F5E"/>
    </svg>`
  },
  {
    id: 'student-3',
    name: 'Tuấn Kiệt',
    role: 'Kỹ sư IT Đam mê',
    bg: '#0EA5E9',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#0EA5E9"/>
      <circle cx="50" cy="41" r="20" fill="#FED7AA"/>
      <!-- Hair & Headphones -->
      <path d="M30 38 Q50 16 70 38 C68 25 32 25 30 38 Z" fill="#0F172A"/>
      <!-- Headphones band -->
      <path d="M26 44 A 26 26 0 0 1 74 44" stroke="#F59E0B" stroke-width="4" fill="none"/>
      <rect x="23" y="38" width="7" height="15" rx="3" fill="#F59E0B"/>
      <rect x="70" y="38" width="7" height="15" rx="3" fill="#F59E0B"/>
      <!-- Eyes & Smirk -->
      <circle cx="43" cy="42" r="2.5" fill="#0F172A"/>
      <circle cx="57" cy="42" r="2.5" fill="#0F172A"/>
      <path d="M46 51 Q52 53 56 49" stroke="#0F172A" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Hoodie -->
      <path d="M22 88 C25 66 38 62 50 62 C62 62 75 66 78 88" fill="#1E293B"/>
      <path d="M43 62 L50 78 L57 62" fill="#0EA5E9"/>
    </svg>`
  },
  {
    id: 'student-4',
    name: 'Bảo Châu',
    role: 'Thuyết trình Tự tin',
    bg: '#8B5CF6',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#8B5CF6"/>
      <circle cx="50" cy="41" r="20" fill="#FDE68A"/>
      <!-- Short Stylish Bob Hair -->
      <path d="M27 42 C26 24 38 18 50 18 C62 18 74 24 73 42 C74 54 70 60 67 62 C68 45 66 28 50 26 C34 28 32 45 33 62 C30 60 26 54 27 42 Z" fill="#312E81"/>
      <circle cx="43" cy="42" r="2.5" fill="#1E293B"/>
      <circle cx="57" cy="42" r="2.5" fill="#1E293B"/>
      <path d="M45 50 Q50 55 55 50" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Blazer Outfit -->
      <path d="M23 88 C26 66 38 60 50 60 C62 60 74 66 77 88" fill="#6D28D9"/>
      <polygon points="50,60 44,72 56,72" fill="#FFFFFF"/>
    </svg>`
  },
  {
    id: 'student-5',
    name: 'Hoàng Nam',
    role: 'Thể thao Năng động',
    bg: '#10B981',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#10B981"/>
      <circle cx="50" cy="43" r="19" fill="#FDBA74"/>
      <!-- Cap backwards -->
      <path d="M30 38 Q50 20 70 38 L72 34 Q50 16 28 34 Z" fill="#EF4444"/>
      <ellipse cx="50" cy="33" rx="20" ry="10" fill="#EF4444"/>
      <rect x="42" y="22" width="16" height="5" rx="2" fill="#B91C1C"/>
      <circle cx="43" cy="44" r="2.5" fill="#1F2937"/>
      <circle cx="57" cy="44" r="2.5" fill="#1F2937"/>
      <path d="M45 52 Q50 56 55 52" stroke="#1F2937" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Sport Jersey -->
      <path d="M22 88 C25 66 38 62 50 62 C62 62 75 66 78 88" fill="#047857"/>
      <text x="50" y="80" text-anchor="middle" font-size="12" font-weight="900" fill="#FFFFFF">10</text>
    </svg>`
  },
  {
    id: 'student-6',
    name: 'Phương Thảo',
    role: 'Nghiên cứu sinh',
    bg: '#059669',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#059669"/>
      <circle cx="50" cy="41" r="20" fill="#FEE2E2"/>
      <!-- Hair bun -->
      <circle cx="50" cy="18" r="8" fill="#292524"/>
      <path d="M28 36 Q50 20 72 36 C70 25 30 25 28 36 Z" fill="#292524"/>
      <!-- Round Glasses -->
      <circle cx="42" cy="42" r="6" stroke="#D97706" stroke-width="2" fill="none"/>
      <circle cx="58" cy="42" r="6" stroke="#D97706" stroke-width="2" fill="none"/>
      <line x1="48" y1="42" x2="52" y2="42" stroke="#D97706" stroke-width="2"/>
      <path d="M46 51 Q50 54 54 51" stroke="#292524" stroke-width="2" stroke-linecap="round"/>
      <!-- Lab Coat / Collar -->
      <path d="M22 88 C25 66 38 60 50 60 C62 60 75 66 78 88" fill="#F8FAFC"/>
      <path d="M38 60 L50 78 L62 60" fill="#059669"/>
    </svg>`
  },
  {
    id: 'student-7',
    name: 'Đức Anh',
    role: 'Nghệ thuật & Design',
    bg: '#F59E0B',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#F59E0B"/>
      <circle cx="50" cy="42" r="20" fill="#FED7AA"/>
      <!-- Beret hat -->
      <path d="M25 32 Q50 14 75 30 C76 36 68 40 50 38 C32 40 24 36 25 32 Z" fill="#7C2D12"/>
      <circle cx="50" cy="20" r="2.5" fill="#7C2D12"/>
      <circle cx="43" cy="43" r="2.5" fill="#1F2937"/>
      <circle cx="57" cy="43" r="2.5" fill="#1F2937"/>
      <path d="M45 52 Q50 56 55 52" stroke="#7C2D12" stroke-width="2" stroke-linecap="round"/>
      <!-- Scarf & Sweater -->
      <path d="M22 88 C25 66 38 62 50 62 C62 62 75 66 78 88" fill="#B45309"/>
      <path d="M38 64 Q50 74 62 64 Q50 68 38 64 Z" fill="#FDE68A"/>
    </svg>`
  },
  {
    id: 'student-8',
    name: 'Mai Linh',
    role: 'Cần mẫn Học bổng',
    bg: '#14B8A6',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#14B8A6"/>
      <circle cx="50" cy="41" r="19" fill="#FEF3C7"/>
      <!-- Braided pigtails -->
      <path d="M29 36 Q50 20 71 36 C70 25 30 25 29 36 Z" fill="#374151"/>
      <path d="M25 45 C22 55 24 68 22 75" stroke="#374151" stroke-width="6" stroke-linecap="round"/>
      <path d="M75 45 C78 55 76 68 78 75" stroke="#374151" stroke-width="6" stroke-linecap="round"/>
      <!-- Face -->
      <circle cx="43" cy="41" r="2.5" fill="#111827"/>
      <circle cx="57" cy="41" r="2.5" fill="#111827"/>
      <circle cx="39" cy="46" r="3" fill="#FDA4AF" opacity="0.7"/>
      <circle cx="61" cy="46" r="3" fill="#FDA4AF" opacity="0.7"/>
      <path d="M45 49 Q50 53 55 49" stroke="#E11D48" stroke-width="2" stroke-linecap="round"/>
      <!-- Cardigan -->
      <path d="M22 88 C25 66 38 60 50 60 C62 60 75 66 78 88" fill="#0D9488"/>
      <path d="M47 60 L50 88 L53 60" stroke="#CCFBF1" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'student-9',
    name: 'Hải Đăng',
    role: 'Trưởng nhóm Nhiệt huyết',
    bg: '#6366F1',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#6366F1"/>
      <circle cx="50" cy="41" r="20" fill="#FDE68A"/>
      <!-- Modern Undercut Hair -->
      <path d="M30 36 C30 24 40 18 52 18 C64 18 70 24 70 34 C64 28 54 26 40 28 C34 30 31 34 30 36 Z" fill="#18181B"/>
      <!-- Eyes & Determined smile -->
      <circle cx="43" cy="42" r="2.5" fill="#18181B"/>
      <circle cx="57" cy="42" r="2.5" fill="#18181B"/>
      <path d="M44 50 Q50 56 56 50" stroke="#18181B" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Denim Jacket -->
      <path d="M22 88 C25 65 38 60 50 60 C62 60 75 65 78 88" fill="#4338CA"/>
      <polygon points="50,60 45,70 55,70" fill="#E0E7FF"/>
    </svg>`
  },
  {
    id: 'student-10',
    name: 'Kim Ngân',
    role: 'Thủ khoa Thanh lịch',
    bg: '#D97706',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#D97706"/>
      <circle cx="50" cy="41" r="20" fill="#FEF3C7"/>
      <!-- Elegant ponytail hair -->
      <circle cx="70" cy="36" r="6" fill="#1C1917"/>
      <path d="M27 38 C28 22 40 18 52 18 C65 18 72 26 71 40 C65 28 50 26 34 30 C30 34 28 36 27 38 Z" fill="#1C1917"/>
      <circle cx="43" cy="42" r="2.5" fill="#1C1917"/>
      <circle cx="57" cy="42" r="2.5" fill="#1C1917"/>
      <path d="M45 50 Q50 55 55 50" stroke="#B45309" stroke-width="2.2" stroke-linecap="round"/>
      <!-- Ribbon bow & Blouse -->
      <polygon points="50,62 45,66 55,66" fill="#F59E0B"/>
      <path d="M23 88 C26 66 38 60 50 60 C62 60 74 66 77 88" fill="#B45309"/>
      <circle cx="50" cy="64" r="2.5" fill="#FEF3C7"/>
    </svg>`
  }
];

export function getAvatarById(id) {
  return STUDENT_AVATARS.find(a => a.id === id) || STUDENT_AVATARS[0];
}

export function renderAvatarSvg(id, size = 40) {
  const avatar = getAvatarById(id);
  return `<div class="avatar-icon-wrap" style="width:${size}px; height:${size}px; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; overflow:hidden; flex-shrink:0;">${avatar.svg}</div>`;
}

