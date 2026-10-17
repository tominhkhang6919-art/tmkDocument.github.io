// ==============================================================================
// TMK DOCUMENT — MAIN CLIENT APPLICATION LOGIC
// Nền tảng Quản lý & Tra cứu Tài liệu Học tập Sinh viên TMK document
// Tác giả: Tô Minh Khang | 2026
// ==============================================================================

import { authService } from './services/authService.js';
import { profileService } from './services/profileService.js';
import { subjectService, removeVietnameseTones } from './services/subjectService.js';
import { documentService } from './services/documentService.js';
import { activityService } from './services/activityService.js';
import { STUDENT_AVATARS, getAvatarById, renderAvatarSvg } from './assets/avatars.js';
import { BRAND_LOGO_SVG, STUDENT_HERO_SVG } from './assets/branding.js';
import { initIntroScreen } from './components/introScreen.js';

// --- APPLICATION STATE ---
const state = {
  currentUser: null,
  currentProfile: null,
  subjectGroups: [],
  subjects: [],
  filteredSubjects: [],
  activeGroupId: '',
  activeSubject: null,
  activeSubjectDocs: [],
  savedDocIds: new Set(),
  searchKeyword: '',
  currentView: 'home', // 'home' | 'subject-detail' | 'personal'
  personalTab: 'saved', // 'saved' | 'downloaded' | 'history'
  personalSort: 'desc', // 'desc' | 'asc'
  theme: localStorage.getItem('tmk_theme') || 'midnight',
  isAuthModalSignup: false,
  selectedAuthAvatar: 'student-1',
  selectedProfileAvatar: 'student-1',
  pendingDeleteDoc: null,
  pendingViewerDoc: null,
  selectedUploadFile: null
};

// --- DOM ELEMENTS ---
const elements = {
  brandLogoContainer: document.getElementById('brand-logo-container'),
  brandLogoBtn: document.getElementById('brand-logo-btn'),
  studentHeroContainer: document.getElementById('student-hero-container'),
  btnTriangleMenu: document.getElementById('btn-triangle-menu'),
  navigationDrawer: document.getElementById('navigation-drawer'),
  drawerBackdrop: document.getElementById('drawer-backdrop'),
  btnCloseDrawer: document.getElementById('btn-close-drawer'),
  drawerGroupsList: document.getElementById('drawer-groups-list'),
  drawerSavedCount: document.getElementById('drawer-saved-count'),
  themeBtnMidnight: document.getElementById('theme-btn-midnight'),
  themeBtnSakura: document.getElementById('theme-btn-sakura'),
  headerUserArea: document.getElementById('header-user-area'),
  
  // Views
  viewHome: document.getElementById('view-home'),
  viewSubjectDetail: document.getElementById('view-subject-detail'),
  viewPersonal: document.getElementById('view-personal'),
  
  // Search & Filter
  searchSubjectsInput: document.getElementById('search-subjects-input'),
  btnClearSearch: document.getElementById('btn-clear-search'),
  groupFilterChips: document.getElementById('group-filter-chips'),
  groupsGridContainer: document.getElementById('groups-grid-container'),
  subjectsGridContainer: document.getElementById('subjects-grid-container'),
  subjectsListHeading: document.getElementById('subjects-list-heading'),
  subjectsCountInfo: document.getElementById('subjects-count-info'),
  btnHeroExplore: document.getElementById('btn-hero-explore'),
  btnHeroPersonal: document.getElementById('btn-hero-personal'),
  
  // Subject Detail
  btnBackToSubjects: document.getElementById('btn-back-to-subjects'),
  btnOpenUploadModal: document.getElementById('btn-open-upload-modal'),
  subjectDetailBanner: document.getElementById('subject-detail-banner'),
  documentsGridContainer: document.getElementById('documents-grid-container'),
  detailDocsCount: document.getElementById('detail-docs-count'),
  
  // Personal Area
  btnBackToHomeFromPersonal: document.getElementById('btn-back-to-home-from-personal'),
  personalSortSelect: document.getElementById('personal-sort-select'),
  savedDocsGrid: document.getElementById('saved-docs-grid'),
  downloadedDocsGrid: document.getElementById('downloaded-docs-grid'),
  historyTimelineContainer: document.getElementById('history-timeline-container'),
  tabContentSaved: document.getElementById('tab-content-saved'),
  tabContentDownloaded: document.getElementById('tab-content-downloaded'),
  tabContentHistory: document.getElementById('tab-content-history'),
  
  // Modals
  modalAuth: document.getElementById('modal-auth'),
  authForm: document.getElementById('auth-form'),
  authModalTitle: document.getElementById('auth-modal-title'),
  authGroupName: document.getElementById('auth-group-name'),
  authGroupAvatar: document.getElementById('auth-group-avatar'),
  authInputName: document.getElementById('auth-input-name'),
  authInputEmail: document.getElementById('auth-input-email'),
  authInputPassword: document.getElementById('auth-input-password'),
  authAvatarGrid: document.getElementById('auth-avatar-grid'),
  btnToggleAuthMode: document.getElementById('btn-toggle-auth-mode'),
  btnSubmitAuth: document.getElementById('btn-submit-auth'),
  btnCancelAuth: document.getElementById('btn-cancel-auth'),
  btnCloseAuthModal: document.getElementById('btn-close-auth-modal'),
  
  modalProfile: document.getElementById('modal-profile'),
  profileForm: document.getElementById('profile-form'),
  profileInputName: document.getElementById('profile-input-name'),
  profileInputEmail: document.getElementById('profile-input-email'),
  profileAvatarGrid: document.getElementById('profile-avatar-grid'),
  btnSaveProfile: document.getElementById('btn-save-profile'),
  btnCloseProfile: document.getElementById('btn-close-profile'),
  btnCloseProfileModal: document.getElementById('btn-close-profile-modal'),
  btnSignout: document.getElementById('btn-signout'),
  
  modalUpload: document.getElementById('modal-upload'),
  uploadDocForm: document.getElementById('upload-doc-form'),
  uploadDocTitle: document.getElementById('upload-doc-title'),
  uploadDocDesc: document.getElementById('upload-doc-desc'),
  uploadFileInput: document.getElementById('upload-file-input'),
  fileDropzone: document.getElementById('file-dropzone'),
  dropzoneText: document.getElementById('dropzone-text'),
  btnSubmitUpload: document.getElementById('btn-submit-upload'),
  btnCancelUpload: document.getElementById('btn-cancel-upload'),
  btnCloseUploadModal: document.getElementById('btn-close-upload-modal'),
  
  modalViewer: document.getElementById('modal-viewer'),
  viewerTitle: document.getElementById('viewer-title'),
  viewerFilename: document.getElementById('viewer-filename'),
  viewerFileTypeIcon: document.getElementById('viewer-file-type-icon'),
  viewerRenderArea: document.getElementById('viewer-render-area'),
  btnViewerDownload: document.getElementById('btn-viewer-download'),
  btnCloseViewerModal: document.getElementById('btn-close-viewer-modal'),
  
  modalConfirmDelete: document.getElementById('modal-confirm-delete'),
  deleteDocNamePreview: document.getElementById('delete-doc-name-preview'),
  btnConfirmDeleteAction: document.getElementById('btn-confirm-delete-action'),
  btnCancelDelete: document.getElementById('btn-cancel-delete'),
  btnCloseDeleteModal: document.getElementById('btn-close-delete-modal'),
  
  toastContainer: document.getElementById('toast-container')
};

// --- TOAST SYSTEM ---
function showToast(message, type = 'info', duration = 3500) {
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#79E0C3" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7568F5" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${escapeHtml(message)}</span>`;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return isoString;
  }
}

// --- THEME MANAGEMENT (Mục 3.3) ---
function applyTheme(themeName, persistToProfile = true) {
  state.theme = themeName;
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('tmk_theme', themeName);

  if (elements.themeBtnMidnight && elements.themeBtnSakura) {
    elements.themeBtnMidnight.classList.toggle('active', themeName === 'midnight');
    elements.themeBtnSakura.classList.toggle('active', themeName === 'sakura');
  }

  if (persistToProfile && state.currentUser) {
    profileService.updateTheme(state.currentUser.id, themeName);
  }
}

// --- DRAWER TOGGLE (Mục 4 Nút Tam Giác) ---
function toggleDrawer(forceOpen = null) {
  const isOpen = forceOpen !== null ? forceOpen : !elements.navigationDrawer.classList.contains('open');
  elements.navigationDrawer.classList.toggle('open', isOpen);
  elements.drawerBackdrop.classList.toggle('open', isOpen);
  elements.btnTriangleMenu.classList.toggle('active', isOpen);
}

// --- VIEW NAVIGATION ---
function switchView(viewName) {
  state.currentView = viewName;
  elements.viewHome.style.display = viewName === 'home' ? 'block' : 'none';
  elements.viewSubjectDetail.style.display = viewName === 'subject-detail' ? 'block' : 'none';
  elements.viewPersonal.style.display = viewName === 'personal' ? 'block' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- AUTH & PROFILE UI SYNC ---
async function syncAuthState() {
  const session = await authService.getSession();
  state.currentUser = session?.user || null;

  if (state.currentUser) {
    state.currentProfile = await profileService.getProfile(state.currentUser.id);
    
    // Nếu có theme đã lưu trên profile thì khôi phục đồng bộ
    if (state.currentProfile?.theme && state.currentProfile.theme !== state.theme) {
      applyTheme(state.currentProfile.theme, false);
    }

    // Tải danh sách tài liệu đã lưu
    const savedIds = await documentService.getUserSavedDocIds(state.currentUser.id);
    state.savedDocIds = savedIds;
    elements.drawerSavedCount.textContent = savedIds.size;

    renderHeaderUserPill(true);
  } else {
    state.currentProfile = null;
    state.savedDocIds = new Set();
    elements.drawerSavedCount.textContent = '0';
    renderHeaderUserPill(false);
  }
}

function renderHeaderUserPill(isLoggedIn) {
  if (isLoggedIn && state.currentUser) {
    const avatarId = state.currentProfile?.avatar_id || 'student-1';
    const displayName = state.currentProfile?.display_name || state.currentUser.email.split('@')[0];

    elements.headerUserArea.innerHTML = `
      <div class="user-profile-pill" id="btn-open-profile-modal" title="Xem hồ sơ & Đổi ảnh đại diện">
        ${renderAvatarSvg(avatarId, 28)}
        <span class="pill-name">${escapeHtml(displayName)}</span>
      </div>
    `;

    document.getElementById('btn-open-profile-modal')?.addEventListener('click', openProfileModal);
  } else {
    elements.headerUserArea.innerHTML = `
      <button class="btn-auth-trigger" id="btn-open-auth-modal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Đăng nhập</span>
      </button>
    `;
    document.getElementById('btn-open-auth-modal')?.addEventListener('click', () => openAuthModal(false));
  }
}

// --- 10 AVATAR GRID RENDERER (Mục 12) ---
function renderAvatarSelectionGrid(container, selectedId, onSelectCallback) {
  container.innerHTML = STUDENT_AVATARS.map(avatar => `
    <div class="avatar-option-card ${avatar.id === selectedId ? 'selected' : ''}" data-avatar-id="${avatar.id}">
      ${renderAvatarSvg(avatar.id, 52)}
      <span class="avatar-label-name">${escapeHtml(avatar.name)}</span>
      <span class="avatar-label-role">${escapeHtml(avatar.role)}</span>
    </div>
  `).join('');

  container.querySelectorAll('.avatar-option-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.avatar-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const avatarId = card.getAttribute('data-avatar-id');
      onSelectCallback(avatarId);
    });
  });
}

// --- DATA FETCHING ---
async function loadGroupsAndSubjects() {
  try {
    elements.subjectsCountInfo.textContent = 'Đang đồng bộ dữ liệu với Supabase...';
    
    // Tải 3 nhóm môn học
    const groups = await subjectService.getSubjectGroups();
    state.subjectGroups = groups;
    renderGroupsUI(groups);
    renderDrawerGroupsList(groups);
    renderGroupFilterChips(groups);

    // Tải danh sách môn học
    const subjects = await subjectService.getSubjects();
    state.subjects = subjects;
    state.filteredSubjects = subjects;
    renderSubjectsGrid(subjects);

    elements.subjectsCountInfo.textContent = `Tổng cộng ${subjects.length} môn học trong hệ thống`;
  } catch (err) {
    console.error('Lỗi tải dữ liệu Supabase:', err);
    elements.subjectsGridContainer.innerHTML = `
      <div class="state-box" style="grid-column: 1/-1;">
        <div class="state-icon-circle" style="color: var(--color-danger); background: var(--color-danger-light);">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 class="state-title">Chưa kết nối được với bảng dữ liệu Supabase</h3>
        <p class="state-desc">Vui lòng đảm bảo bạn đã chạy file migration SQL <code>supabase/supabase_document.sql</code> trong Supabase SQL Editor.</p>
        <button class="btn-primary" id="btn-retry-load-subjects" style="margin-top: 10px;">Thử lại</button>
      </div>
    `;
    document.getElementById('btn-retry-load-subjects')?.addEventListener('click', loadGroupsAndSubjects);
  }
}

// --- RENDER 3 NHÓM MÔN HỌC (Mục 5) ---
function renderGroupsUI(groups) {
  if (!groups || groups.length === 0) {
    elements.groupsGridContainer.innerHTML = `
      <div class="state-box" style="grid-column: 1/-1;">
        <p class="state-desc">Chưa có nhóm môn học. Vui lòng chạy file SQL seed data.</p>
      </div>
    `;
    return;
  }

  // Phối màu nhận diện đặc trưng cho từng nhóm
  const groupThemes = {
    'dai-cuong': { color: '#7568F5', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>' },
    'co-so-nganh': { color: '#10B981', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' },
    'chuyen-nganh': { color: '#F28C78', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>' }
  };

  elements.groupsGridContainer.innerHTML = groups.map(group => {
    const theme = groupThemes[group.slug] || { color: '#7568F5', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>' };
    const count = state.subjects.filter(s => s.group_id === group.id).length;
    const isActive = state.activeGroupId === group.id;

    return `
      <div class="group-card ${isActive ? 'active' : ''}" data-group-id="${group.id}" style="--group-accent: ${theme.color};">
        <div class="group-card-top">
          <div class="group-icon-wrap">${theme.icon}</div>
          <span class="group-count-badge">${count} môn học</span>
        </div>
        <div>
          <h3 class="group-name">${escapeHtml(group.name)}</h3>
          <p class="group-desc">${escapeHtml(group.description || '')}</p>
        </div>
        <div class="group-card-footer">
          <span>Xem các môn thuộc nhóm</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    `;
  }).join('');

  elements.groupsGridContainer.querySelectorAll('.group-card').forEach(card => {
    card.addEventListener('click', () => {
      const gId = card.getAttribute('data-group-id');
      handleSelectGroup(gId);
    });
  });
}

function renderDrawerGroupsList(groups) {
  elements.drawerGroupsList.innerHTML = groups.map(group => `
    <button class="drawer-nav-item ${state.activeGroupId === group.id ? 'active' : ''}" data-group-id="${group.id}">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      <span>${escapeHtml(group.name)}</span>
    </button>
  `).join('');

  elements.drawerGroupsList.querySelectorAll('.drawer-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const gId = btn.getAttribute('data-group-id');
      toggleDrawer(false);
      handleSelectGroup(gId);
      document.getElementById('subjects-list-anchor')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderGroupFilterChips(groups) {
  elements.groupFilterChips.innerHTML = `
    <button class="filter-chip ${state.activeGroupId === '' ? 'active' : ''}" data-group-id="">Tất cả môn</button>
    ${groups.map(g => `
      <button class="filter-chip ${state.activeGroupId === g.id ? 'active' : ''}" data-group-id="${g.id}">
        ${escapeHtml(g.name)}
      </button>
    `).join('')}
  `;

  elements.groupFilterChips.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const gId = chip.getAttribute('data-group-id');
      handleSelectGroup(gId);
    });
  });
}

function handleSelectGroup(groupId) {
  if (state.activeGroupId === groupId) {
    state.activeGroupId = ''; // Nhấn lần 2 để bỏ lọc
  } else {
    state.activeGroupId = groupId;
  }

  // Đồng bộ lại UI chips & cards
  renderGroupsUI(state.subjectGroups);
  renderGroupFilterChips(state.subjectGroups);
  renderDrawerGroupsList(state.subjectGroups);

  // Lọc danh sách môn
  filterSubjects();
}

// --- FILTER & SEARCH (Mục 7) ---
function filterSubjects() {
  const keyword = state.searchKeyword.trim();
  const normalizedKeyword = removeVietnameseTones(keyword);

  let filtered = state.subjects;

  if (state.activeGroupId) {
    filtered = filtered.filter(s => s.group_id === state.activeGroupId);
  }

  if (normalizedKeyword) {
    filtered = filtered.filter(sub => {
      const nameMatch = removeVietnameseTones(sub.name).includes(normalizedKeyword);
      const codeMatch = sub.code && removeVietnameseTones(sub.code).includes(normalizedKeyword);
      const descMatch = sub.description && removeVietnameseTones(sub.description).includes(normalizedKeyword);
      return nameMatch || codeMatch || descMatch;
    });
  }

  state.filteredSubjects = filtered;
  renderSubjectsGrid(filtered);

  const groupObj = state.subjectGroups.find(g => g.id === state.activeGroupId);
  elements.subjectsListHeading.innerHTML = groupObj 
    ? `<span>Nhóm: ${escapeHtml(groupObj.name)}</span>`
    : `<span>Danh Mục Môn Học</span>`;

  elements.subjectsCountInfo.textContent = `Hiển thị ${filtered.length} / ${state.subjects.length} môn học`;
}

// Debounce helper
let searchDebounceTimeout = null;
function handleSearchInput(e) {
  const val = e.target.value;
  state.searchKeyword = val;
  elements.btnClearSearch.style.display = val ? 'flex' : 'none';

  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    filterSubjects();
  }, 200);
}

// --- RENDER DANH SÁCH MÔN HỌC (Mục 6) ---
function renderSubjectsGrid(subjects) {
  if (!subjects || subjects.length === 0) {
    elements.subjectsGridContainer.innerHTML = `
      <div class="state-box" style="grid-column: 1/-1;">
        <div class="state-icon-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h3 class="state-title">Không tìm thấy môn học phù hợp</h3>
        <p class="state-desc">Hãy thử từ khóa khác hoặc bấm nút "Tất cả môn" để mở rộng phạm vi tìm kiếm.</p>
        <button class="btn-secondary" id="btn-reset-search-state" style="margin-top: 8px;">Đặt lại tìm kiếm</button>
      </div>
    `;
    document.getElementById('btn-reset-search-state')?.addEventListener('click', () => {
      state.searchKeyword = '';
      state.activeGroupId = '';
      elements.searchSubjectsInput.value = '';
      elements.btnClearSearch.style.display = 'none';
      filterSubjects();
    });
    return;
  }

  elements.subjectsGridContainer.innerHTML = subjects.map(subject => {
    return `
      <div class="subject-card" data-subject-id="${subject.id}">
        <div class="subject-card-header">
          <div>
            ${subject.code ? `<span class="subject-code-tag">${escapeHtml(subject.code)}</span>` : ''}
            <h3 class="subject-name">${escapeHtml(subject.name)}</h3>
          </div>
          <span class="subject-group-pill">${escapeHtml(subject.group_name)}</span>
        </div>
        <div class="subject-card-body">
          <p class="subject-description">${escapeHtml(subject.description || 'Chưa có mô tả môn học.')}</p>
          <div class="subject-meta-stats">
            <span class="subject-meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>${subject.document_count || 0} tài liệu</span>
            </span>
          </div>
        </div>
        <div class="subject-card-actions">
          <button class="btn-primary btn-view-subject" data-subject-id="${subject.id}" style="flex: 1; justify-content: center;">
            <span>Xem chi tiết</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    `;
  }).join('');

  elements.subjectsGridContainer.querySelectorAll('.btn-view-subject').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const subjectId = btn.getAttribute('data-subject-id');
      openSubjectDetail(subjectId);
    });
  });
}

// --- CHI TIẾT MÔN HỌC & TÀI LIỆU (Mục 8) ---
async function openSubjectDetail(subjectId) {
  try {
    const subject = await subjectService.getSubjectById(subjectId);
    if (!subject) {
      showToast('Không tìm thấy thông tin môn học', 'error');
      return;
    }

    state.activeSubject = subject;
    switchView('subject-detail');

    // Ghi nhật ký xem môn học vào Supabase (Mục 10.3)
    if (state.currentUser) {
      activityService.logActivity({
        userId: state.currentUser.id,
        actionType: 'view_subject',
        subjectId: subject.id,
        metadata: { title: subject.name, code: subject.code }
      });
    }

    // Render banner môn học
    elements.subjectDetailBanner.innerHTML = `
      <div class="detail-banner-info">
        <div style="display: flex; gap: 8px; align-items: center;">
          ${subject.code ? `<span class="subject-code-tag" style="font-size: 0.85rem;">${escapeHtml(subject.code)}</span>` : ''}
          <span class="subject-group-pill">${escapeHtml(subject.group_name)}</span>
        </div>
        <h2 class="detail-subject-title">${escapeHtml(subject.name)}</h2>
        <p class="detail-subject-desc">${escapeHtml(subject.description || 'Môn học chưa có mô tả chi tiết.')}</p>
      </div>
      <div>
        <span class="subject-group-pill" style="font-size: 0.88rem; padding: 6px 14px;">
          Đã liên kết đúng nhóm môn
        </span>
      </div>
    `;

    // Tải danh sách tài liệu thuộc môn này
    await reloadSubjectDocuments(subjectId);

  } catch (err) {
    console.error('Lỗi mở chi tiết môn:', err);
    showToast('Không thể tải chi tiết môn học', 'error');
  }
}

async function reloadSubjectDocuments(subjectId) {
  try {
    elements.documentsGridContainer.innerHTML = `
      <div class="state-box" style="grid-column: 1/-1;">
        <div class="spinner"></div>
        <p class="state-desc">Đang tải tài liệu từ Supabase...</p>
      </div>
    `;

    const docs = await documentService.getDocumentsBySubject(subjectId);
    state.activeSubjectDocs = docs;
    elements.detailDocsCount.textContent = `${docs.length} tài liệu`;

    renderDocumentsList(docs, elements.documentsGridContainer);
  } catch (err) {
    console.error('Lỗi tải tài liệu:', err);
    elements.documentsGridContainer.innerHTML = `
      <div class="state-box" style="grid-column: 1/-1;">
        <p class="state-desc" style="color: var(--color-danger);">Không thể tải danh sách tài liệu: ${escapeHtml(err.message)}</p>
        <button class="btn-secondary" id="btn-retry-docs" style="margin-top: 10px;">Thử lại</button>
      </div>
    `;
    document.getElementById('btn-retry-docs')?.addEventListener('click', () => reloadSubjectDocuments(subjectId));
  }
}

function getFileTypeCategory(mimeType, filename = '') {
  const ext = filename.split('.').pop().toLowerCase();
  if (mimeType?.includes('pdf') || ext === 'pdf') return { label: 'PDF', class: 'pdf' };
  if (mimeType?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) return { label: 'IMG', class: 'image' };
  if (mimeType?.includes('text') || ['txt', 'md', 'js', 'py', 'sql'].includes(ext)) return { label: 'TXT', class: 'text' };
  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) return { label: 'DOC', class: 'doc' };
  return { label: 'FILE', class: 'other' };
}

function renderDocumentsList(docs, containerElement, showSubjectName = false) {
  if (!docs || docs.length === 0) {
    containerElement.innerHTML = `
      <div class="state-box" style="grid-column: 1/-1;">
        <div class="state-icon-circle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
        </div>
        <h3 class="state-title">Chưa có tài liệu nào</h3>
        <p class="state-desc">Hãy là người đầu tiên chia sẻ đề thi, bài tập hoặc giáo trình hữu ích cho môn học này!</p>
      </div>
    `;
    return;
  }

  containerElement.innerHTML = docs.map(doc => {
    const fileType = getFileTypeCategory(doc.mime_type, doc.original_filename);
    const isSaved = state.savedDocIds.has(doc.id);
    const isOwner = state.currentUser && (state.currentUser.id === doc.uploaded_by || state.currentProfile?.role === 'admin');

    return `
      <div class="document-item-card" data-doc-id="${doc.id}">
        <div class="document-card-top">
          <div class="file-type-icon ${fileType.class}">${fileType.label}</div>
          <div class="doc-info-block">
            <h4 class="doc-title" title="${escapeHtml(doc.title)}">${escapeHtml(doc.title)}</h4>
            <p class="doc-filename">${escapeHtml(doc.original_filename)}</p>
            ${showSubjectName && doc.subject_name ? `<span class="subject-group-pill" style="margin-top: 4px; display: inline-block;">${escapeHtml(doc.subject_name)}</span>` : ''}
          </div>
        </div>

        ${doc.description ? `<p class="doc-desc">${escapeHtml(doc.description)}</p>` : ''}

        <div class="doc-meta-footer">
          <span>${formatBytes(doc.size_bytes)}</span>
          <span>${formatDate(doc.created_at)}</span>
        </div>

        <div class="doc-actions-toolbar">
          <div class="doc-btn-group-left">
            <button class="btn-icon-label btn-doc-view" data-doc-id="${doc.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>Xem</span>
            </button>
            <button class="btn-icon-label btn-doc-download" data-doc-id="${doc.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Tải</span>
            </button>
            <button class="btn-icon-label btn-bookmark ${isSaved ? 'saved' : ''}" data-doc-id="${doc.id}" title="${isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              <span>${isSaved ? 'Đã lưu' : 'Lưu'}</span>
            </button>
          </div>

          ${isOwner ? `
            <button class="btn-delete-doc" data-doc-id="${doc.id}" title="Xóa tài liệu">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Gắn sự kiện cho các nút hành động
  containerElement.querySelectorAll('.btn-doc-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-doc-id');
      const doc = docs.find(d => d.id === docId);
      if (doc) openDocumentViewer(doc);
    });
  });

  containerElement.querySelectorAll('.btn-doc-download').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-doc-id');
      const doc = docs.find(d => d.id === docId);
      if (doc) handleDownloadDocument(doc);
    });
  });

  containerElement.querySelectorAll('.btn-bookmark').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-doc-id');
      handleToggleSaveDocument(docId);
    });
  });

  containerElement.querySelectorAll('.btn-delete-doc').forEach(btn => {
    btn.addEventListener('click', () => {
      const docId = btn.getAttribute('data-doc-id');
      const doc = docs.find(d => d.id === docId);
      if (doc) openConfirmDeleteModal(doc);
    });
  });
}

// --- XEM TÀI LIỆU TRỰC TIẾP (Mục 8.2) ---
async function openDocumentViewer(doc) {
  state.pendingViewerDoc = doc;
  elements.viewerTitle.textContent = doc.title;
  elements.viewerFilename.textContent = `${doc.original_filename} (${formatBytes(doc.size_bytes)})`;

  const fileType = getFileTypeCategory(doc.mime_type, doc.original_filename);
  elements.viewerFileTypeIcon.innerHTML = `<div class="file-type-icon ${fileType.class}">${fileType.label}</div>`;

  const fileUrl = documentService.getDocumentUrl(doc.storage_path);
  elements.viewerRenderArea.innerHTML = `<div class="spinner"></div><p style="margin-top:10px; color:var(--text-muted);">Đang chuẩn bị hiển thị nội dung...</p>`;

  elements.modalViewer.classList.add('open');

  // Ghi nhận nhật ký xem tài liệu vào Supabase
  if (state.currentUser) {
    activityService.logActivity({
      userId: state.currentUser.id,
      actionType: 'view_document',
      documentId: doc.id,
      subjectId: doc.subject_id,
      metadata: { title: doc.title, filename: doc.original_filename }
    });
  }

  // Render theo định dạng file tương thích
  try {
    if (fileType.class === 'pdf') {
      elements.viewerRenderArea.innerHTML = `
        <iframe class="doc-viewer-iframe" src="${fileUrl}#toolbar=1" title="${escapeHtml(doc.title)}"></iframe>
      `;
    } else if (fileType.class === 'image') {
      elements.viewerRenderArea.innerHTML = `
        <img class="doc-viewer-img" src="${fileUrl}" alt="${escapeHtml(doc.title)}" loading="lazy">
      `;
    } else if (fileType.class === 'text') {
      // Đọc nội dung file text
      const res = await fetch(fileUrl);
      if (res.ok) {
        const textContent = await res.text();
        elements.viewerRenderArea.innerHTML = `
          <pre class="doc-viewer-text">${escapeHtml(textContent)}</pre>
        `;
      } else {
        throw new Error('Không thể đọc file văn bản');
      }
    } else {
      // Các định dạng khác (Word, PPT, ZIP)
      elements.viewerRenderArea.innerHTML = `
        <div class="state-box">
          <div class="state-icon-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 class="state-title">${escapeHtml(doc.original_filename)}</h3>
          <p class="state-desc">Định dạng file này (${fileType.label}) cần được tải về máy để xem tốt nhất bằng phần mềm chuyên dụng của bạn.</p>
          <button class="btn-primary" id="btn-viewer-fallback-download" style="margin-top: 12px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Tải file về máy ngay</span>
          </button>
        </div>
      `;
      document.getElementById('btn-viewer-fallback-download')?.addEventListener('click', () => handleDownloadDocument(doc));
    }
  } catch (err) {
    elements.viewerRenderArea.innerHTML = `
      <div class="state-box">
        <p class="state-desc" style="color:var(--color-danger);">Không thể mở bản xem trước. Bạn có thể sử dụng nút Tải về để xem file trực tiếp.</p>
      </div>
    `;
  }
}

// --- TẢI TÀI LIỆU XUỐNG THỰC TẾ (Mục 8.3) ---
async function handleDownloadDocument(doc) {
  showToast(`Đang chuẩn bị tải "${doc.original_filename}"...`, 'info', 2000);

  try {
    // Ghi lại sự kiện tải xuống vào Supabase
    if (state.currentUser) {
      activityService.logActivity({
        userId: state.currentUser.id,
        actionType: 'download_document',
        documentId: doc.id,
        subjectId: doc.subject_id,
        metadata: { title: doc.title, filename: doc.original_filename }
      });
    }

    await documentService.downloadDocumentFile(doc);
    showToast(`Đã khởi tạo tải xuống file thành công!`, 'success');
  } catch (err) {
    console.error('Lỗi tải file:', err);
    showToast(`Lỗi tải file: ${err.message}`, 'error');
  }
}

// --- LƯU & BỎ LƯU TÀI LIỆU CÁ NHÂN (Mục 9) ---
async function handleToggleSaveDocument(documentId) {
  if (!state.currentUser) {
    showToast('Vui lòng đăng nhập để lưu tài liệu vào không gian cá nhân', 'info');
    openAuthModal(false);
    return;
  }

  const isSaved = state.savedDocIds.has(documentId);

  try {
    if (isSaved) {
      await documentService.unsaveDocument(documentId, state.currentUser.id);
      state.savedDocIds.delete(documentId);
      showToast('Đã bỏ lưu tài liệu', 'info');
    } else {
      await documentService.saveDocument(documentId, state.currentUser.id);
      state.savedDocIds.add(documentId);
      showToast('Đã lưu tài liệu vào không gian cá nhân!', 'success');
    }

    elements.drawerSavedCount.textContent = state.savedDocIds.size;

    // Cập nhật trạng thái các nút Bookmark trên giao diện hiện tại
    document.querySelectorAll(`.btn-bookmark[data-doc-id="${documentId}"]`).forEach(btn => {
      const nowSaved = state.savedDocIds.has(documentId);
      btn.classList.toggle('saved', nowSaved);
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="${nowSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        <span>${nowSaved ? 'Đã lưu' : 'Lưu'}</span>
      `;
    });

    // Nếu đang ở màn hình cá nhân tab "Tài liệu đã lưu", làm mới danh sách
    if (state.currentView === 'personal' && state.personalTab === 'saved') {
      loadPersonalSavedDocs();
    }

  } catch (err) {
    console.error('Lỗi lưu/bỏ lưu tài liệu:', err);
    showToast(`Thao tác không thành công: ${err.message}`, 'error');
  }
}

// --- XÓA TÀI LIỆU (Mục 8.4) ---
function openConfirmDeleteModal(doc) {
  state.pendingDeleteDoc = doc;
  elements.deleteDocNamePreview.textContent = `"${doc.title}"`;
  elements.modalConfirmDelete.classList.add('open');
}

async function handleConfirmDelete() {
  if (!state.pendingDeleteDoc) return;
  const { id, storage_path, title } = state.pendingDeleteDoc;

  try {
    elements.btnConfirmDeleteAction.disabled = true;
    elements.btnConfirmDeleteAction.textContent = 'Đang xóa...';

    await documentService.deleteDocument(id, storage_path);

    showToast(`Đã xóa tài liệu "${title}" thành công`, 'success');
    elements.modalConfirmDelete.classList.remove('open');
    state.pendingDeleteDoc = null;

    // Cập nhật lại danh sách tài liệu
    if (state.activeSubject) {
      await reloadSubjectDocuments(state.activeSubject.id);
    }
    // Cập nhật lại danh sách môn học để giảm số lượng tài liệu
    loadGroupsAndSubjects();

  } catch (err) {
    console.error('Lỗi xóa tài liệu:', err);
    showToast(`Không thể xóa tài liệu: ${err.message}`, 'error');
  } finally {
    elements.btnConfirmDeleteAction.disabled = false;
    elements.btnConfirmDeleteAction.textContent = 'Xác nhận xóa';
  }
}

// --- UPLOAD TÀI LIỆU (Mục 8.1) ---
function openUploadModal() {
  if (!state.currentUser) {
    showToast('Vui lòng đăng nhập tài khoản sinh viên để tải tài liệu lên', 'info');
    openAuthModal(false);
    return;
  }
  if (!state.activeSubject) {
    showToast('Vui lòng chọn môn học trước khi tải tài liệu', 'info');
    return;
  }

  // Reset form
  elements.uploadDocForm.reset();
  state.selectedUploadFile = null;
  elements.dropzoneText.textContent = 'Nhấn để chọn file hoặc kéo thả file vào đây';
  elements.dropzoneSub.textContent = 'Hỗ trợ PDF, PNG, JPG, WEBP, TXT... (Tối đa 25MB)';
  elements.modalUpload.classList.add('open');
}

async function handleUploadSubmit(e) {
  e.preventDefault();
  if (!state.currentUser || !state.activeSubject) return;

  const title = elements.uploadDocTitle.value.trim();
  const desc = elements.uploadDocDesc.value.trim();
  const file = state.selectedUploadFile;

  if (!title) {
    showToast('Vui lòng nhập tên hiển thị cho tài liệu', 'error');
    return;
  }
  if (!file) {
    showToast('Vui lòng chọn file từ thiết bị của bạn', 'error');
    return;
  }

  try {
    elements.btnSubmitUpload.disabled = true;
    elements.btnSubmitUpload.innerHTML = `<div class="spinner" style="width:18px;height:18px;border-width:2px;"></div><span>Đang tải lên Supabase...</span>`;

    await documentService.uploadDocument({
      file,
      subjectId: state.activeSubject.id,
      title,
      description: desc,
      userId: state.currentUser.id
    });

    showToast('Tải tài liệu lên thành công!', 'success');
    elements.modalUpload.classList.remove('open');

    // Làm mới danh sách tài liệu
    await reloadSubjectDocuments(state.activeSubject.id);
    loadGroupsAndSubjects();

  } catch (err) {
    console.error('Lỗi upload:', err);
    showToast(`Lỗi upload tài liệu: ${err.message}`, 'error');
  } finally {
    elements.btnSubmitUpload.disabled = false;
    elements.btnSubmitUpload.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <span>Tải lên ngay</span>
    `;
  }
}

// --- KHU VỰC CÁ NHÂN (Mục 10 & 11) ---
function openPersonalArea(tab = 'saved') {
  if (!state.currentUser) {
    showToast('Vui lòng đăng nhập để xem không gian cá nhân', 'info');
    openAuthModal(false);
    return;
  }

  state.personalTab = tab;
  switchView('personal');
  switchPersonalTab(tab);
}

function switchPersonalTab(tab) {
  state.personalTab = tab;

  document.querySelectorAll('.personal-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });

  elements.tabContentSaved.style.display = tab === 'saved' ? 'block' : 'none';
  elements.tabContentDownloaded.style.display = tab === 'downloaded' ? 'block' : 'none';
  elements.tabContentHistory.style.display = tab === 'history' ? 'block' : 'none';

  if (tab === 'saved') loadPersonalSavedDocs();
  else if (tab === 'downloaded') loadPersonalDownloadedDocs();
  else if (tab === 'history') loadPersonalActivityHistory();
}

async function loadPersonalSavedDocs() {
  elements.savedDocsGrid.innerHTML = `<div class="state-box" style="grid-column: 1/-1;"><div class="spinner"></div></div>`;
  try {
    const docs = await documentService.getSavedDocuments(state.currentUser.id, state.personalSort);
    renderDocumentsList(docs, elements.savedDocsGrid, true);
  } catch (err) {
    elements.savedDocsGrid.innerHTML = `<div class="state-box" style="grid-column: 1/-1;"><p style="color:var(--color-danger);">${escapeHtml(err.message)}</p></div>`;
  }
}

async function loadPersonalDownloadedDocs() {
  elements.downloadedDocsGrid.innerHTML = `<div class="state-box" style="grid-column: 1/-1;"><div class="spinner"></div></div>`;
  try {
    const docs = await activityService.getDownloadedDocuments(state.currentUser.id, state.personalSort);
    if (docs.length === 0) {
      elements.downloadedDocsGrid.innerHTML = `
        <div class="state-box" style="grid-column: 1/-1;">
          <div class="state-icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <h3 class="state-title">Chưa có tài liệu nào được tải về</h3>
          <p class="state-desc">Khi bạn tải bất kỳ đề thi hay giáo trình nào trên hệ thống, lịch sử sẽ tự động được ghi nhận tại đây.</p>
        </div>
      `;
      return;
    }
    renderDocumentsList(docs, elements.downloadedDocsGrid, true);
  } catch (err) {
    elements.downloadedDocsGrid.innerHTML = `<div class="state-box" style="grid-column: 1/-1;"><p style="color:var(--color-danger);">${escapeHtml(err.message)}</p></div>`;
  }
}

async function loadPersonalActivityHistory() {
  elements.historyTimelineContainer.innerHTML = `<div class="state-box"><div class="spinner"></div></div>`;
  try {
    const activities = await activityService.getActivityHistory(state.currentUser.id, state.personalSort);
    if (activities.length === 0) {
      elements.historyTimelineContainer.innerHTML = `
        <div class="state-box">
          <div class="state-icon-circle">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h3 class="state-title">Chưa có hoạt động nào được ghi nhận</h3>
          <p class="state-desc">Các lượt xem môn học, mở tài liệu và tải xuống sẽ tự động xuất hiện tại đây.</p>
        </div>
      `;
      return;
    }

    elements.historyTimelineContainer.innerHTML = activities.map(act => {
      let badgeLabel = 'Xem';
      let badgeClass = 'action-badge-view';
      if (act.action_type === 'download_document') {
        badgeLabel = 'Tải xuống';
        badgeClass = 'action-badge-download';
      } else if (act.action_type === 'view_subject') {
        badgeLabel = 'Xem môn';
      }

      return `
        <div class="history-item-row">
          <div class="history-item-left">
            <span class="history-action-badge ${badgeClass}">${badgeLabel}</span>
            <div>
              <strong style="color: var(--text-main); font-size: 0.95rem;">${escapeHtml(act.target_title)}</strong>
              ${act.subject?.name ? `<span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 8px;">(${escapeHtml(act.subject.name)})</span>` : ''}
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 14px;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">${formatDate(act.created_at)}</span>
            ${act.subject_id ? `
              <button class="btn-icon-label btn-history-jump" data-subject-id="${act.subject_id}" style="padding: 4px 10px; font-size: 0.78rem;">
                <span>Mở lại</span>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    elements.historyTimelineContainer.querySelectorAll('.btn-history-jump').forEach(btn => {
      btn.addEventListener('click', () => {
        const subId = btn.getAttribute('data-subject-id');
        if (subId) openSubjectDetail(subId);
      });
    });

  } catch (err) {
    elements.historyTimelineContainer.innerHTML = `<div class="state-box"><p style="color:var(--color-danger);">${escapeHtml(err.message)}</p></div>`;
  }
}

// --- AUTH & PROFILE MODALS ---
function openAuthModal(isSignup = false) {
  state.isAuthModalSignup = isSignup;
  elements.authModalTitle.querySelector('span').textContent = isSignup ? 'Đăng Ký Tài Khoản Sinh Viên' : 'Đăng Nhập Tài Khoản';
  elements.authGroupName.style.display = isSignup ? 'block' : 'none';
  elements.authGroupAvatar.style.display = isSignup ? 'block' : 'none';
  elements.btnToggleAuthMode.textContent = isSignup ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký ngay';
  elements.btnSubmitAuth.textContent = isSignup ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập';

  if (isSignup) {
    renderAvatarSelectionGrid(elements.authAvatarGrid, state.selectedAuthAvatar, (avatarId) => {
      state.selectedAuthAvatar = avatarId;
    });
  }

  elements.modalAuth.classList.add('open');
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = elements.authInputEmail.value.trim();
  const password = elements.authInputPassword.value;
  const name = elements.authInputName.value.trim() || 'Sinh viên TMK';

  if (!email || !password) {
    showToast('Vui lòng nhập đầy đủ email và mật khẩu', 'error');
    return;
  }

  try {
    elements.btnSubmitAuth.disabled = true;
    elements.btnSubmitAuth.textContent = 'Đang xử lý...';

    if (state.isAuthModalSignup) {
      await authService.signUp(email, password, name, state.selectedAuthAvatar);
      showToast('Đăng ký tài khoản thành công! Đang kích hoạt phiên làm việc...', 'success');
    } else {
      await authService.signIn(email, password);
      showToast('Đăng nhập thành công!', 'success');
    }

    elements.modalAuth.classList.remove('open');
    await syncAuthState();
    loadGroupsAndSubjects();

  } catch (err) {
    console.error('Lỗi xác thực:', err);
    showToast(`Xác thực không thành công: ${err.message}`, 'error');
  } finally {
    elements.btnSubmitAuth.disabled = false;
    elements.btnSubmitAuth.textContent = state.isAuthModalSignup ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập';
  }
}

function openProfileModal() {
  if (!state.currentUser) return;

  const currentAvatar = state.currentProfile?.avatar_id || 'student-1';
  state.selectedProfileAvatar = currentAvatar;

  elements.profileInputName.value = state.currentProfile?.display_name || '';
  elements.profileInputEmail.value = state.currentUser.email || '';

  renderAvatarSelectionGrid(elements.profileAvatarGrid, currentAvatar, (avatarId) => {
    state.selectedProfileAvatar = avatarId;
  });

  elements.modalProfile.classList.add('open');
}

async function handleSaveProfile() {
  if (!state.currentUser) return;
  const newName = elements.profileInputName.value.trim();

  if (!newName) {
    showToast('Tên hiển thị không được để trống', 'error');
    return;
  }

  try {
    elements.btnSaveProfile.disabled = true;
    elements.btnSaveProfile.textContent = 'Đang lưu...';

    const updated = await profileService.updateProfile(state.currentUser.id, {
      display_name: newName,
      avatar_id: state.selectedProfileAvatar
    });

    state.currentProfile = updated;
    renderHeaderUserPill(true);
    showToast('Cập nhật hồ sơ sinh viên thành công!', 'success');
    elements.modalProfile.classList.remove('open');

  } catch (err) {
    console.error('Lỗi cập nhật profile:', err);
    showToast(`Không thể cập nhật hồ sơ: ${err.message}`, 'error');
  } finally {
    elements.btnSaveProfile.disabled = false;
    elements.btnSaveProfile.textContent = 'Lưu thay đổi';
  }
}

async function handleSignOut() {
  try {
    await authService.signOut();
    elements.modalProfile.classList.remove('open');
    showToast('Đã đăng xuất khỏi tài khoản', 'info');
    await syncAuthState();
    if (state.currentView === 'personal') {
      switchView('home');
    }
    loadGroupsAndSubjects();
  } catch (err) {
    showToast(`Lỗi đăng xuất: ${err.message}`, 'error');
  }
}

// --- FILE DRAG & DROP HANDLING ---
function setupDropzone() {
  const dropzone = elements.fileDropzone;
  const input = elements.uploadFileInput;

  dropzone.addEventListener('click', () => input.click());

  input.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handlePickedFile(e.target.files[0]);
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePickedFile(e.dataTransfer.files[0]);
    }
  });
}

function handlePickedFile(file) {
  state.selectedUploadFile = file;
  elements.dropzoneText.textContent = `Đã chọn: ${file.name}`;
  elements.dropzoneSub.textContent = `Dung lượng: ${formatBytes(file.size)}`;

  // Tự động điền tên hiển thị nếu chưa có
  if (!elements.uploadDocTitle.value.trim()) {
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    elements.uploadDocTitle.value = nameWithoutExt.replace(/[-_]/g, ' ');
  }
}

// --- EVENT LISTENERS INITIALIZATION ---
function initEvents() {
  // Brand Logo Click -> Return Home
  elements.brandLogoBtn.addEventListener('click', () => {
    switchView('home');
  });

  // Triangle Menu (Mục 4)
  elements.btnTriangleMenu.addEventListener('click', () => toggleDrawer());
  elements.btnCloseDrawer.addEventListener('click', () => toggleDrawer(false));
  elements.drawerBackdrop.addEventListener('click', () => toggleDrawer(false));

  // Drawer Theme Switches
  elements.themeBtnMidnight.addEventListener('click', () => applyTheme('midnight'));
  elements.themeBtnSakura.addEventListener('click', () => applyTheme('sakura'));

  // Drawer Personal Links
  document.getElementById('drawer-btn-saved-docs')?.addEventListener('click', () => {
    toggleDrawer(false);
    openPersonalArea('saved');
  });
  document.getElementById('drawer-btn-downloaded-docs')?.addEventListener('click', () => {
    toggleDrawer(false);
    openPersonalArea('downloaded');
  });
  document.getElementById('drawer-btn-activity-history')?.addEventListener('click', () => {
    toggleDrawer(false);
    openPersonalArea('history');
  });

  // Hero Actions
  elements.btnHeroExplore.addEventListener('click', () => {
    document.getElementById('subjects-list-anchor')?.scrollIntoView({ behavior: 'smooth' });
  });
  elements.btnHeroPersonal.addEventListener('click', () => {
    openPersonalArea('saved');
  });

  // Search input
  elements.searchSubjectsInput.addEventListener('input', handleSearchInput);
  elements.btnClearSearch.addEventListener('click', () => {
    elements.searchSubjectsInput.value = '';
    state.searchKeyword = '';
    elements.btnClearSearch.style.display = 'none';
    filterSubjects();
  });

  // Subject Detail Back & Upload Actions
  elements.btnBackToSubjects.addEventListener('click', () => switchView('home'));
  elements.btnOpenUploadModal.addEventListener('click', openUploadModal);

  // Personal Area Navigation & Sorting
  elements.btnBackToHomeFromPersonal.addEventListener('click', () => switchView('home'));
  document.querySelectorAll('.personal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchPersonalTab(tab);
    });
  });

  elements.personalSortSelect.addEventListener('change', (e) => {
    state.personalSort = e.target.value;
    switchPersonalTab(state.personalTab);
  });

  // Auth Modal
  elements.btnToggleAuthMode.addEventListener('click', () => {
    openAuthModal(!state.isAuthModalSignup);
  });
  elements.authForm.addEventListener('submit', handleAuthSubmit);
  elements.btnCancelAuth.addEventListener('click', () => elements.modalAuth.classList.remove('open'));
  elements.btnCloseAuthModal.addEventListener('click', () => elements.modalAuth.classList.remove('open'));

  // Profile Modal
  elements.btnSaveProfile.addEventListener('click', handleSaveProfile);
  elements.btnCloseProfile.addEventListener('click', () => elements.modalProfile.classList.remove('open'));
  elements.btnCloseProfileModal.addEventListener('click', () => elements.modalProfile.classList.remove('open'));
  elements.btnSignout.addEventListener('click', handleSignOut);

  // Upload Modal
  elements.uploadDocForm.addEventListener('submit', handleUploadSubmit);
  elements.btnCancelUpload.addEventListener('click', () => elements.modalUpload.classList.remove('open'));
  elements.btnCloseUploadModal.addEventListener('click', () => elements.modalUpload.classList.remove('open'));

  // Viewer Modal
  elements.btnCloseViewerModal.addEventListener('click', () => elements.modalViewer.classList.remove('open'));
  elements.btnViewerDownload.addEventListener('click', () => {
    if (state.pendingViewerDoc) handleDownloadDocument(state.pendingViewerDoc);
  });

  // Delete Modal
  elements.btnConfirmDeleteAction.addEventListener('click', handleConfirmDelete);
  elements.btnCancelDelete.addEventListener('click', () => elements.modalConfirmDelete.classList.remove('open'));
  elements.btnCloseDeleteModal.addEventListener('click', () => elements.modalConfirmDelete.classList.remove('open'));

  // Dropzone setup
  setupDropzone();

  // Escape key closes modals and drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDrawer(false);
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
      });
    }
  });

  // Supabase Auth Listener
  authService.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      syncAuthState();
    }
  });
}

// --- INITIALIZE APPLICATION ---
async function initApp() {
  // Apply Initial Theme immediately to avoid any flash
  applyTheme(state.theme, false);

  // Initialize Intro Screen (Mục 2)
  initIntroScreen({
    onComplete: () => {
      // Intro completed, focus ready
    }
  });

  // Render Brand Assets
  elements.brandLogoContainer.innerHTML = BRAND_LOGO_SVG;
  elements.studentHeroContainer.innerHTML = STUDENT_HERO_SVG;

  // Initialize Event Handlers
  initEvents();

  // Synchronize Auth Session
  await syncAuthState();

  // Load Initial Data from Supabase
  await loadGroupsAndSubjects();
}

// Start Application when DOM is Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

