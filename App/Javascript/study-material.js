// Study Material Management
class StudyMaterialManager {
  constructor() {
    this.currentUser = auth.getCurrentUser();
    this.materials = this.currentUser?.studyMaterials || [];
    this.init();
  }

  init() {
    // Ensure auth is properly loaded
    if (!auth.isLoggedIn() || !this.currentUser) {
      window.location.href = 'login.html';
      return;
    }

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
    card.innerHTML = `
      <div class="material-header">
        <h3>${material.title}</h3>
        <span class="material-progress">${material.progress}%</span>
      </div>
      ${material.link ? `<a href="${material.link}" target="_blank" class="material-link">📁 Open</a>` : ''}
      <div class="material-actions">
        <button class="btn-small" onclick="studyMaterialManager.updateProgress(${index})">Update Progress</button>
        <button class="btn-small btn-edit" onclick="studyMaterialManager.editMaterial(${index})">Edit</button>
        <button class="btn-small btn-delete" onclick="studyMaterialManager.deleteMaterial(${index})">Delete</button>
      </div>
    `;
    return card;
  }

  updateProgress(index) {
    const newProgress = prompt('Enter progress percentage (0-100):', this.materials[index].progress);
    if (newProgress !== null) {
      const progress = Math.min(100, Math.max(0, parseInt(newProgress)));
      this.materials[index].progress = progress;
      this.saveMaterials();
      this.loadMaterials();
    }
  }

  editMaterial(index) {
    const material = this.materials[index];
    document.getElementById('material-title').value = material.title;
    document.getElementById('material-link').value = material.link;
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

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const material = {
        id: Date.now(),
        title: document.getElementById('material-title').value,
        link: document.getElementById('material-link').value,
        progress: 0
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
      this.loadMaterials();
      alert('Material ' + (editIndex !== undefined ? 'updated' : 'added') + ' successfully!');
    });
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
