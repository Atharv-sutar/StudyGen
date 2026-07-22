// Study Material Management
class StudyMaterialManager {
  constructor() {
    this.currentUser = auth.getCurrentUser();
    this.materials = this.currentUser?.studyMaterials || [];
    // expose for inline handlers and debugging
    window.studyMaterialManager = this;
    this.init();
  }

  init() {
    // Ensure auth is properly loaded
    if (!auth.isLoggedIn() || !this.currentUser) {
      window.location.href = 'login.html';
      return;
    }

    this.createProgressModal();
    this.loadMaterials();
    this.setupForm();
    this.setupLogout();
  }

  loadMaterials() {
    const materialGrid = document.getElementById('materials-grid');
    if (!materialGrid) return;

    if (this.materials.length === 0) {
      materialGrid.innerHTML = '<p class="no-materials">Add your Google Drive or study links here!</p>';
      return;
    }

    materialGrid.innerHTML = '';
    this.materials.forEach((material, index) => {
      const card = this.createMaterialCard(material, index);
      materialGrid.appendChild(card);
    });
  }

  createMaterialCard(material, index) {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.setAttribute('data-index', index);
    card.innerHTML = `
      <div class="material-header">
        <h3>${material.title}</h3>
        <span class="material-progress">${material.progress}%</span>
      </div>
      ${material.link ? `<a href="${material.link}" target="_blank" class="material-link">📁 Open</a>` : ''}
      ${material.videos && material.videos.length ? `<div class="material-videos"><strong>Videos:</strong><ul>${material.videos.map(v=>`<li>${v.title?escapeHtml(v.title):'YouTube Video'}</li>`).join('')}</ul></div>` : ''}
      <div class="material-actions">
        <button class="btn-small" onclick="studyMaterialManager.openProgressModal(${index})">Update Progress</button>
        <button class="btn-small btn-edit" onclick="studyMaterialManager.editMaterial(${index})">Edit</button>
        <button class="btn-small btn-delete" onclick="studyMaterialManager.deleteMaterial(${index})">Delete</button>
      </div>
    `;
    // open detail modal when card clicked (but not when clicking action buttons)
    card.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('.material-actions')) return; // ignore action button clicks
      this.openDetailModal(index);
    });
    return card;
  }

  openDetailModal(index) {
    const modal = document.getElementById('material-detail-modal');
    if (!modal) return;
    const material = this.materials[index];
    modal.style.display = 'flex';
    modal.querySelector('#detail-title').textContent = material.title || '';
    modal.querySelector('#detail-desc').textContent = material.description || '';

    // videos
    const videosDiv = modal.querySelector('#detail-videos');
    videosDiv.innerHTML = '';
    if (material.videos && material.videos.length) {
      material.videos.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'btn-small';
        btn.style.display = 'block';
        btn.style.marginTop = '8px';
        btn.textContent = v.title || 'Open Video';
        btn.addEventListener('click', () => window.open(v.url, '_blank'));
        videosDiv.appendChild(btn);
      });
    }

    // links (website / drive)
    const linksDiv = modal.querySelector('#detail-links');
    linksDiv.innerHTML = '';
    if (material.link) {
      const a = document.createElement('a');
      a.href = material.link;
      a.target = '_blank';
      a.textContent = 'Open Resource/Website';
      a.className = 'btn-link';
      linksDiv.appendChild(a);
    }

    // close handlers
    modal.querySelector('#material-detail-close').addEventListener('click', () => { modal.style.display = 'none'; });
    modal.querySelector('#detail-close-btn').addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
  }

  // Utility: escape HTML to prevent injection when rendering titles
  
  // eslint-disable-next-line class-methods-use-this
  
  
  // small helper outside template literal to avoid eslint warnings
  
  // We'll attach a helper function on the class prototype below

  // -- Progress modal helpers --
  createProgressModal() {
    if (document.getElementById('progress-modal')) return; // already created

    const modal = document.createElement('div');
    modal.id = 'progress-modal';
    modal.className = 'modal progress-modal';
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" id="progress-modal-close">&times;</span>
        <h3>Update Progress</h3>
        <div class="form-group">
          <label for="progress-input">Progress (0-100)</label>
          <input id="progress-input" type="number" min="0" max="100" />
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">
          <button class="btn-small" id="progress-cancel">Cancel</button>
          <button class="btn-small btn-edit" id="progress-save">Save</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // events
    modal.querySelector('#progress-modal-close').addEventListener('click', () => this.closeProgressModal());
    modal.querySelector('#progress-cancel').addEventListener('click', () => this.closeProgressModal());
    modal.querySelector('#progress-save').addEventListener('click', () => this.saveProgressFromModal());
    modal.addEventListener('click', (e) => { if (e.target === modal) this.closeProgressModal(); });
  }

  openProgressModal(index) {
    const modal = document.getElementById('progress-modal');
    if (!modal) return;
    modal.dataset.index = index;
    const input = modal.querySelector('#progress-input');
    input.value = this.materials[index]?.progress ?? 0;
    modal.style.display = 'flex';
    input.focus();
  }

  closeProgressModal() {
    const modal = document.getElementById('progress-modal');
    if (!modal) return;
    modal.style.display = 'none';
    delete modal.dataset.index;
  }

  saveProgressFromModal() {
    const modal = document.getElementById('progress-modal');
    if (!modal) return;
    const idx = modal.dataset.index;
    if (idx === undefined) return this.closeProgressModal();
    const input = modal.querySelector('#progress-input');
    let val = parseInt(input.value);
    if (isNaN(val)) val = 0;
    val = Math.min(100, Math.max(0, val));
    this.materials[idx].progress = val;
    this.saveMaterials();
    this.loadMaterials();
    this.closeProgressModal();
  }

  editMaterial(index) {
    const material = this.materials[index];
    document.getElementById('material-title').value = material.title;
    document.getElementById('material-link').value = material.link || '';
    document.getElementById('material-description').value = material.description || '';
    // populate video inputs
    this.clearVideoFields();
    if (material.videos && material.videos.length) {
      material.videos.forEach(v => this.addVideoField(v.url || '', v.title || ''));
    }
    document.getElementById('add-material-form').dataset.editIndex = index;
    document.querySelector('.btn-add-material').textContent = 'Update Material';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteMaterial(index) {
    if (confirm('Are you sure you want to delete this material?')) {
      this.materials.splice(index, 1);
      this.saveMaterials();
      this.loadMaterials();
    }
  }

  setupForm() {
    const form = document.getElementById('add-material-form');
    if (!form) return;

    // prepare video add button
    const addVideoBtn = document.getElementById('add-video-btn');
    if (addVideoBtn) {
      addVideoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.addVideoField();
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const material = {
        id: Date.now(),
        title: document.getElementById('material-title').value,
        link: document.getElementById('material-link').value,
        progress: 0,
        videos: this.collectVideosFromForm(),
        description: document.getElementById('material-description')?.value || ''
      };

      if (!material.title) {
        alert('Please enter a title');
        return;
      }

      const editIndex = form.dataset.editIndex;
      if (editIndex !== undefined) {
        this.materials[editIndex] = { ...this.materials[editIndex], ...material };
        delete form.dataset.editIndex;
        document.querySelector('.btn-add-material').textContent = 'Add Material';
      } else {
        this.materials.push(material);
      }

      this.saveMaterials();
      form.reset();
      this.clearVideoFields();
      this.loadMaterials();
      alert('Material ' + (editIndex !== undefined ? 'updated' : 'added') + ' successfully!');
    });
  }

  // -- Video field helpers --
  addVideoField(url = '', title = '') {
    const list = document.getElementById('video-list');
    if (!list) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'video-field';
    wrapper.innerHTML = `
      <input type="url" class="video-url" placeholder="YouTube URL" value="${url}">
      <input type="text" class="video-title" placeholder="Optional title (shown on card)" value="${title}">
      <button type="button" class="btn-small btn-delete-video">Remove</button>
    `;
    list.appendChild(wrapper);
    wrapper.querySelector('.btn-delete-video').addEventListener('click', () => wrapper.remove());
  }

  clearVideoFields() {
    const list = document.getElementById('video-list');
    if (!list) return;
    list.innerHTML = '';
  }

  collectVideosFromForm() {
    const list = document.getElementById('video-list');
    if (!list) return [];
    const rows = Array.from(list.querySelectorAll('.video-field'));
    const videos = rows.map(r => {
      const url = (r.querySelector('.video-url')?.value || '').trim();
      const title = (r.querySelector('.video-title')?.value || '').trim();
      return url ? { url, title } : null;
    }).filter(Boolean);
    return videos;
  }

  saveMaterials() {
    this.currentUser.studyMaterials = this.materials;
    auth.updateUserData({ studyMaterials: this.materials });
  }

  setupLogout() {
    const logoutLink = document.querySelector('a[href="#logout"]');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
        window.location.href = 'login.html';
      });
    }
  }
}

// Utility to escape HTML when rendering user-provided titles
function escapeHtml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe).replace(/[&<>\",'`=\/]/g, function (s) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return map[s] || s;
  });
}

let studyMaterialManager;
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.users || Object.keys(auth.users).length === 0) {
    auth.users = auth.loadFromStorage('users') || {};
  }
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (storedUser && !auth.currentUser) {
    auth.currentUser = storedUser;
  }
  studyMaterialManager = new StudyMaterialManager();
});

if (document.readyState !== 'loading') {
  if (!auth.users || Object.keys(auth.users).length === 0) {
    auth.users = auth.loadFromStorage('users') || {};
  }
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (storedUser && !auth.currentUser) {
    auth.currentUser = storedUser;
  }
  studyMaterialManager = new StudyMaterialManager();
}
