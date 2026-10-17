// ==============================================================================
// TMK DOCUMENT — BRAND LOGO, FAVICON & ĐẠI HỌC CẦN THƠ (CTU) EMBLEM
// Brand: TMK Document
// Tác giả: Tô Minh Khang — 2026
// ==============================================================================

// 1. HORIZONTAL NAVBAR LOGO
export const BRAND_LOGO_SVG = `
<svg class="brand-logo-svg" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tmkBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--color-primary, #7568F5)"/>
      <stop offset="100%" stop-color="var(--color-secondary, #79E0C3)"/>
    </linearGradient>
    <filter id="tmkBrandShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="var(--color-primary, #7568F5)" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Outer Rounded Shield / Square -->
  <rect x="2" y="2" width="42" height="42" rx="12" fill="url(#tmkBrandGrad)" filter="url(#tmkBrandShadow)"/>

  <!-- Back Sheet (Floating Document layer) -->
  <path d="M12 15 C12 13.5 13.5 12 15 12 L31 12 C32.5 12 34 13.5 34 15 L34 30 C34 31.5 32.5 33 31 33 L15 33 C13.5 33 12 31.5 12 30 Z" fill="#FFFFFF" fill-opacity="0.3" transform="rotate(-5 23 23)"/>

  <!-- Front Open Document / Book Pages -->
  <path d="M13 17 C13 17 18 15 23 17 L23 33 C18 31 13 33 13 33 Z" fill="#FFFFFF" fill-opacity="0.95"/>
  <path d="M33 17 C33 17 28 15 23 17 L23 33 C28 31 33 33 33 33 Z" fill="#FFFFFF" fill-opacity="0.85"/>

  <!-- Center Bookmark Ribbon (Accent) -->
  <path d="M23 15 L23 26 L25.5 24 L28 26 L28 15 Z" fill="var(--color-accent, #F28C78)"/>

  <!-- Stylized Graduation Cap Accent on Top -->
  <path d="M23 9 L30 12 L23 15 L16 12 Z" fill="#FFFFFF"/>
</svg>
`;

// 2. LARGE INTRO CENTERPIECE LOGO (For Intro Screen)
export const INTRO_LOGO_SVG = `
<svg class="intro-logo-svg" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="introBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--color-primary, #7568F5)"/>
      <stop offset="50%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="var(--color-secondary, #79E0C3)"/>
    </linearGradient>
    <linearGradient id="paperGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="paperGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <filter id="introGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="var(--color-primary, #7568F5)" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Ambient Outer Rings -->
  <circle cx="70" cy="70" r="66" stroke="var(--color-primary, #7568F5)" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.4"/>
  <circle cx="70" cy="70" r="60" stroke="var(--color-secondary, #79E0C3)" stroke-width="1" opacity="0.3"/>

  <!-- Main Rounded Hexagon / Shield Badge -->
  <rect x="18" y="18" width="104" height="104" rx="30" fill="url(#introBadgeGrad)" filter="url(#introGlow)"/>

  <!-- Floating Document Sheet in Background -->
  <g transform="rotate(-8 70 70)">
    <rect x="36" y="32" width="68" height="76" rx="8" fill="#FFFFFF" fill-opacity="0.25"/>
    <line x1="44" y1="46" x2="74" y2="46" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="3" stroke-linecap="round"/>
    <line x1="44" y1="56" x2="88" y2="56" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2.5" stroke-linecap="round"/>
  </g>

  <!-- Open Study Document / Book in Center -->
  <g filter="drop-shadow(0 6px 12px rgba(0,0,0,0.15))">
    <!-- Left Page -->
    <path d="M38 48 C38 48 50 43 70 48 L70 92 C50 87 38 92 38 92 Z" fill="url(#paperGradLeft)"/>
    <!-- Right Page -->
    <path d="M102 48 C102 48 90 43 70 48 L70 92 C90 87 102 92 102 92 Z" fill="url(#paperGradRight)"/>
    
    <!-- Page Spine Line -->
    <line x1="70" y1="46" x2="70" y2="92" stroke="var(--color-primary, #7568F5)" stroke-width="2" stroke-linecap="round"/>

    <!-- Document Content Lines -->
    <line x1="46" y1="58" x2="62" y2="56" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
    <line x1="46" y1="67" x2="64" y2="65" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
    <line x1="46" y1="76" x2="58" y2="74" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>

    <line x1="76" y1="56" x2="94" y2="58" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
    <line x1="76" y1="65" x2="94" y2="67" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
    <line x1="76" y1="74" x2="88" y2="76" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>

    <!-- Bookmark Ribbon -->
    <path d="M70 44 L70 70 L75 66 L80 70 L80 44 Z" fill="var(--color-accent, #F28C78)"/>
    
    <!-- Top Graduation Mortarboard Crest -->
    <path d="M70 30 L88 37 L70 44 L52 37 Z" fill="#FFFFFF"/>
    <path d="M88 37 L88 47" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    <circle cx="88" cy="48" r="2" fill="var(--color-secondary, #79E0C3)"/>
  </g>
</svg>
`;

// 3. LOGO CHÍNH THỨC TRƯỜNG ĐẠI HỌC CẦN THƠ (CAN THO UNIVERSITY - CTU)
// Thay thế hoàn toàn nhân vật cũ theo yêu cầu người dùng
export const CTU_LOGO_SVG = `
<svg class="ctu-hero-logo" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- CTU Brand Colors -->
    <linearGradient id="ctuBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0066B3"/>
      <stop offset="50%" stop-color="#004C8C"/>
      <stop offset="100%" stop-color="#002D59"/>
    </linearGradient>
    <linearGradient id="ctuGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#EAB308"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
    <linearGradient id="ctuOuterAura" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--color-primary, #7568F5)" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="var(--color-secondary, #79E0C3)" stop-opacity="0.04"/>
    </linearGradient>
    <filter id="ctuDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#002D59" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Outer Ambient Aura Rings -->
  <circle cx="160" cy="160" r="150" fill="url(#ctuOuterAura)"/>
  <circle cx="160" cy="160" r="144" stroke="#0066B3" stroke-width="2" stroke-dasharray="6 6" opacity="0.4"/>
  <circle cx="160" cy="160" r="138" stroke="url(#ctuGoldGrad)" stroke-width="1.5" opacity="0.6"/>

  <!-- Main Circular Emblem Badge -->
  <circle cx="160" cy="160" r="130" fill="url(#ctuBlueGrad)" filter="url(#ctuDropShadow)"/>

  <!-- Double Golden Ring -->
  <circle cx="160" cy="160" r="126" stroke="url(#ctuGoldGrad)" stroke-width="3" fill="none"/>
  <circle cx="160" cy="160" r="94" stroke="url(#ctuGoldGrad)" stroke-width="2" fill="none"/>

  <!-- Circular Text Path: Upper Arc (TRƯỜNG ĐẠI HỌC CẦN THƠ) -->
  <path id="ctuTopArc" d="M 45,160 A 115,115 0 0,1 275,160" fill="none"/>
  <text font-family="'Be Vietnam Pro', 'Montserrat', sans-serif" font-size="14.5" font-weight="800" fill="#FFFFFF" letter-spacing="2.2">
    <textPath href="#ctuTopArc" startOffset="50%" text-anchor="middle">
      TRƯỜNG ĐẠI HỌC CẦN THƠ
    </textPath>
  </text>

  <!-- Circular Text Path: Lower Arc (CAN THO UNIVERSITY • 1966) -->
  <path id="ctuBottomArc" d="M 275,160 A 115,115 0 0,1 45,160" fill="none"/>
  <text font-family="'Be Vietnam Pro', 'Montserrat', sans-serif" font-size="12" font-weight="700" fill="url(#ctuGoldGrad)" letter-spacing="2">
    <textPath href="#ctuBottomArc" startOffset="50%" text-anchor="middle">
      CAN THO UNIVERSITY • 1966
    </textPath>
  </text>

  <!-- Left & Right Stars on the Rim -->
  <polygon points="40,160 43,153 50,153 44,158 46,165 40,161 34,165 36,158 30,153 37,153" fill="url(#ctuGoldGrad)"/>
  <polygon points="280,160 283,153 290,153 284,158 286,165 280,161 274,165 276,158 270,153 277,153" fill="url(#ctuGoldGrad)"/>

  <!-- Inner Center Circle -->
  <circle cx="160" cy="160" r="92" fill="#FFFFFF"/>

  <!-- CTU Inner Logo Elements: -->
  <!-- 1. Sóng nước Cửu Long (Mekong Delta River Waves) -->
  <path d="M88 190 Q124 178 160 190 Q196 202 232 190 L232 208 Q196 220 160 208 Q124 196 88 208 Z" fill="#0066B3" opacity="0.9"/>
  <path d="M96 202 Q128 192 160 202 Q192 212 224 202 L224 214 Q192 224 160 214 Q128 204 96 214 Z" fill="#0284C7" opacity="0.6"/>

  <!-- 2. Quyển sách mở tượng trưng cho tri thức (Open Book) -->
  <path d="M102 168 C120 156 145 158 160 166 C175 158 200 156 218 168 L218 184 C200 172 175 174 160 182 C145 174 120 172 102 184 Z" fill="#004C8C"/>
  <path d="M106 170 C122 160 144 161 158 167 L158 179 C144 173 122 172 106 181 Z" fill="#FFFFFF"/>
  <path d="M214 170 C198 160 176 161 162 167 L162 179 C176 173 198 172 214 181 Z" fill="#F1F5F9"/>

  <!-- 3. Ngọn đuốc / Cánh chim / Chữ V - CTU vươn lên -->
  <!-- Left Wing / Lotus petal -->
  <path d="M160 158 C148 142 128 126 122 104 C138 112 152 128 158 144 Z" fill="url(#ctuGoldGrad)"/>
  <!-- Right Wing / Lotus petal -->
  <path d="M160 158 C172 142 192 126 198 104 C182 112 168 128 162 144 Z" fill="url(#ctuGoldGrad)"/>
  
  <!-- Central Torch Flame / Spire of Knowledge -->
  <path d="M160 92 C164 106 170 120 160 148 C150 120 156 106 160 92 Z" fill="#EF4444"/>
  <path d="M160 102 C162 112 166 122 160 142 C154 122 158 112 160 102 Z" fill="url(#ctuGoldGrad)"/>

  <!-- Chữ CTU nổi bật ở giữa đế sách -->
  <text x="160" y="234" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="18" font-weight="900" fill="#004C8C" letter-spacing="4">
    CTU
  </text>
</svg>
`;

// Export alias để tương thích ngược nếu có file gọi STUDENT_HERO_SVG
export const STUDENT_HERO_SVG = CTU_LOGO_SVG;
export const CAN_THO_UNIVERSITY_LOGO_SVG = CTU_LOGO_SVG;
