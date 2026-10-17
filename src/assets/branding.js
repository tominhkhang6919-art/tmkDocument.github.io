// ==============================================================================
// TMK DOCUMENT — BRAND LOGO, FAVICON & STUDENT HERO ILLUSTRATION
// Brand: TMK Document
// Tác giả: Tô Minh Khang | 2026
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

// 3. STUDENT HERO ILLUSTRATION (In Welcome banner)
export const STUDENT_HERO_SVG = `
<svg class="student-hero-illustration" viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="studentBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--color-primary, #7568F5)" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="var(--color-secondary, #79E0C3)" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="studentCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--color-primary, #7568F5)"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    <linearGradient id="backpackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>

  <!-- Background Decorative Circle & Sparkles -->
  <circle cx="160" cy="140" r="115" fill="url(#studentBgGrad)"/>
  <circle cx="270" cy="70" r="6" fill="var(--color-secondary, #79E0C3)" opacity="0.8"/>
  <circle cx="60" cy="190" r="8" fill="var(--color-primary, #7568F5)" opacity="0.4"/>
  <path d="M260 180 L265 190 L275 195 L265 200 L260 210 L255 200 L245 195 L255 190 Z" fill="var(--color-secondary, #79E0C3)" opacity="0.7"/>

  <!-- Backpack (visible behind back & shoulder straps) -->
  <rect x="75" y="110" width="38" height="75" rx="16" fill="url(#backpackGrad)"/>
  <rect x="70" y="125" width="10" height="40" rx="5" fill="#B45309"/>
  <!-- Top handle of backpack -->
  <path d="M85 110 C85 98 100 98 100 110" stroke="#92400E" stroke-width="4" fill="none"/>

  <!-- Student Body / Jacket -->
  <path d="M100 240 C100 185 115 145 155 145 C195 145 210 185 210 240 Z" fill="url(#studentCoatGrad)"/>
  <!-- Backpack straps over shoulder -->
  <path d="M118 148 C118 170 120 200 122 225" stroke="#F59E0B" stroke-width="7" stroke-linecap="round"/>
  
  <!-- Inner T-shirt with V-neck -->
  <path d="M142 145 L155 175 L168 145 Z" fill="#FFFFFF"/>
  <path d="M148 152 L155 168 L162 152 Z" fill="var(--color-secondary, #79E0C3)"/>

  <!-- Neck -->
  <rect x="145" y="120" width="20" height="28" rx="6" fill="#FED7AA"/>

  <!-- Head / Face -->
  <ellipse cx="155" cy="95" rx="28" ry="32" fill="#FED7AA"/>
  <!-- Ears -->
  <circle cx="127" cy="96" r="6" fill="#FED7AA"/>
  <circle cx="183" cy="96" r="6" fill="#FED7AA"/>

  <!-- Modern Hair Style -->
  <path d="M125 90 C123 60 145 50 162 50 C180 50 190 62 187 80 C183 72 175 68 160 68 C145 68 135 76 130 90 Z" fill="#1E293B"/>
  <path d="M130 75 Q155 58 178 72" stroke="#334155" stroke-width="3" fill="none" stroke-linecap="round"/>

  <!-- Friendly Face details: Eyebrows, Eyes with shine, Warm Smile -->
  <path d="M138 85 Q145 82 150 85" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M160 85 Q165 82 172 85" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Eyes -->
  <ellipse cx="144" cy="93" rx="3.5" ry="4" fill="#0F172A"/>
  <circle cx="145.5" cy="91.5" r="1.5" fill="#FFFFFF"/>
  <ellipse cx="166" cy="93" rx="3.5" ry="4" fill="#0F172A"/>
  <circle cx="167.5" cy="91.5" r="1.5" fill="#FFFFFF"/>
  <!-- Cheeks blush -->
  <ellipse cx="138" cy="101" rx="4" ry="2.5" fill="#F472B6" opacity="0.6"/>
  <ellipse cx="172" cy="101" rx="4" ry="2.5" fill="#F472B6" opacity="0.6"/>
  <!-- Big Friendly Smile -->
  <path d="M147 106 Q155 116 163 106" stroke="#0F172A" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M149 107 Q155 114 161 107" fill="#EF4444" opacity="0.8"/>

  <!-- Right Arm holding College Document Folder / Tablet -->
  <path d="M195 170 C205 185 210 205 200 225" stroke="url(#studentCoatGrad)" stroke-width="18" stroke-linecap="round" fill="none"/>
  <!-- Hand -->
  <circle cx="198" cy="225" r="10" fill="#FED7AA"/>

  <!-- Study Document Folder / Tablet in hand -->
  <g transform="translate(190, 185) rotate(-10)">
    <rect x="0" y="0" width="55" height="42" rx="6" fill="#1E293B" stroke="var(--color-secondary, #79E0C3)" stroke-width="2"/>
    <rect x="6" y="8" width="28" height="4" rx="2" fill="var(--color-secondary, #79E0C3)"/>
    <rect x="6" y="16" width="40" height="3" rx="1.5" fill="#94A3B8"/>
    <rect x="6" y="23" width="34" height="3" rx="1.5" fill="#94A3B8"/>
    <rect x="6" y="30" width="20" height="3" rx="1.5" fill="#94A3B8"/>
    <!-- Checkmark badge on document -->
    <circle cx="45" cy="30" r="5" fill="var(--color-primary, #7568F5)"/>
    <path d="M43 30 L45 32 L48 29" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Left Arm with Friendly Thumbs-up / Wave -->
  <path d="M115 170 C100 185 92 195 105 215" stroke="url(#studentCoatGrad)" stroke-width="18" stroke-linecap="round" fill="none"/>
  <circle cx="106" cy="216" r="10" fill="#FED7AA"/>
  <!-- Pen or notebook bookmark in hand -->
  <rect x="100" y="210" width="6" height="18" rx="2" fill="var(--color-accent, #F28C78)" transform="rotate(25 100 210)"/>

  <!-- Badge on chest: "STUDENT" -->
  <rect x="135" y="185" width="40" height="15" rx="7.5" fill="#FFFFFF" opacity="0.95"/>
  <text x="155" y="196" text-anchor="middle" font-family="system-ui, sans-serif" font-size="8.5" font-weight="800" fill="var(--color-primary, #7568F5)">STUDENT</text>
</svg>
`;
