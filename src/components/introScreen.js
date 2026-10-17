// ==============================================================================
// TMK DOCUMENT — INTRO SCREEN EXPERIENCE (Màn hình chào đón)
// Tác giả: Tô Minh Khang | 2026
// ==============================================================================

import { INTRO_LOGO_SVG } from '../assets/branding.js';

export function initIntroScreen({ onComplete }) {
  const introEl = document.getElementById('intro-screen');
  if (!introEl) {
    if (onComplete) onComplete();
    return;
  }

  // 1. Kiểm tra session: Không hiển thị lại khi chuyển trang trong cùng một phiên duyệt
  const hasSeenIntro = sessionStorage.getItem('tmk_intro_seen');
  if (hasSeenIntro === 'true') {
    introEl.remove();
    if (onComplete) onComplete();
    return;
  }

  // 2. Render bố cục Intro Screen chuẩn xác
  introEl.innerHTML = `
    <div class="intro-backdrop-ambient">
      <div class="intro-orb intro-orb-1"></div>
      <div class="intro-orb intro-orb-2"></div>
    </div>

    <!-- Nút Bỏ qua / Vào trang chủ nhanh (Mục 2.4) -->
    <button class="intro-skip-btn" id="btn-skip-intro" aria-label="Bỏ qua màn hình giới thiệu">
      <span>Vào trang chủ</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>

    <!-- Các thành phần trang trí tài liệu học tập nổi (Floating Study Assets) -->
    <div class="intro-floating-layer">
      <!-- Trang tài liệu 1 bên trái -->
      <div class="floating-doc doc-left">
        <svg viewBox="0 0 70 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="66" height="86" rx="8" fill="var(--bg-surface)" stroke="var(--border-color)" stroke-width="1.5"/>
          <line x1="12" y1="18" x2="38" y2="18" stroke="var(--color-primary)" stroke-width="3" stroke-linecap="round"/>
          <line x1="12" y1="28" x2="58" y2="28" stroke="var(--text-muted)" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="36" x2="50" y2="36" stroke="var(--text-muted)" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="44" x2="54" y2="44" stroke="var(--text-muted)" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
          <circle cx="48" cy="66" r="8" fill="var(--color-secondary)" fill-opacity="0.2"/>
        </svg>
      </div>

      <!-- Trang tài liệu 2 bên phải -->
      <div class="floating-doc doc-right">
        <svg viewBox="0 0 65 85" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="61" height="81" rx="8" fill="var(--bg-surface)" stroke="var(--border-color)" stroke-width="1.5"/>
          <path d="M42 2 L63 23 L42 23 Z" fill="var(--color-primary-light)"/>
          <line x1="10" y1="20" x2="32" y2="20" stroke="var(--color-secondary)" stroke-width="3" stroke-linecap="round"/>
          <line x1="10" y1="32" x2="52" y2="32" stroke="var(--text-muted)" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>
          <line x1="10" y1="42" x2="44" y2="42" stroke="var(--text-muted)" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>
          <line x1="10" y1="52" x2="48" y2="52" stroke="var(--text-muted)" stroke-opacity="0.4" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- Đốm sáng mint / coral xung quanh -->
      <div class="intro-sparkle sparkle-1"></div>
      <div class="intro-sparkle sparkle-2"></div>
      <div class="intro-sparkle sparkle-3"></div>
    </div>

    <!-- Khối trung tâm chính: Logo, Tên thương hiệu TMK Document và Taglines -->
    <div class="intro-center-stage">
      <!-- Logo biểu tượng lớn -->
      <div class="intro-badge-wrapper">
        ${INTRO_LOGO_SVG}
      </div>

      <!-- Tên thương hiệu: TMK Document -->
      <div class="intro-brand-heading">
        <div class="intro-title-tmk">TMK</div>
        <div class="intro-title-document">DOCUMENT</div>
      </div>

      <!-- Phân cách trang nhã -->
      <div class="intro-divider">
        <span class="divider-line"></span>
        <span class="divider-diamond">◆</span>
        <span class="divider-line"></span>
      </div>

      <!-- Tagline & Lời chào phụ (Mục 2.1) -->
      <p class="intro-tagline">“Không gian tài liệu học tập của bạn”</p>
      <p class="intro-sub-greeting">Khám phá · Học tập · Phát triển</p>
    </div>
  `;

  // Kiểm tra giảm chuyển động của hệ điều hành
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let isDismissed = false;

  function dismissIntro() {
    if (isDismissed) return;
    isDismissed = true;

    // Lưu vào sessionStorage để không phát lại trong cùng phiên
    try {
      sessionStorage.setItem('tmk_intro_seen', 'true');
    } catch {
      // Bỏ qua nếu storage bị chặn
    }

    introEl.classList.add('intro-fade-out');

    const finish = () => {
      introEl.remove();
      if (onComplete) onComplete();
    };

    if (prefersReducedMotion) {
      finish();
    } else {
      setTimeout(finish, 450);
    }
  }

  // Sự kiện nút Bỏ qua
  const skipBtn = document.getElementById('btn-skip-intro');
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissIntro();
    });
  }

  // Cho phép bấm phím Escape hoặc Space để bỏ qua nhanh
  const keyHandler = (e) => {
    if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
      window.removeEventListener('keydown', keyHandler);
      dismissIntro();
    }
  };
  window.addEventListener('keydown', keyHandler);

  // Tự động kết thúc sau khoảng 2.6s (hoặc ngắn hơn nếu prefers-reduced-motion)
  const autoDuration = prefersReducedMotion ? 600 : 2600;
  const timer = setTimeout(() => {
    window.removeEventListener('keydown', keyHandler);
    dismissIntro();
  }, autoDuration);

  // Fallback an toàn tuyệt đối (tối đa 3.5s đảm bảo không bao giờ bị kẹt)
  setTimeout(() => {
    if (!isDismissed) {
      clearTimeout(timer);
      dismissIntro();
    }
  }, 3500);
}

