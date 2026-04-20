// Schedule/Task Management
class TaskManager {
  constructor() {
    this.currentUser = auth.getCurrentUser();
    this.tasks = this.currentUser?.tasks || [];
    this.init();
  }

  init() {
    // Ensure auth is properly loaded
    if (!auth.isLoggedIn() || !this.currentUser) {
      window.location.href = 'login.html';
      return;
    }

    this.loadTasks();
    this.setupForm();
    this.setupLogout();
  }

  loadTasks() {
    const taskGrid = document.getElementById('task-grid');
    if (!taskGrid) return;

    if (this.tasks.length === 0) {
      taskGrid.innerHTML = '<p class="no-tasks">No tasks yet. Create one to get started!</p>';
      return;
    }

    taskGrid.innerHTML = '';
    this.tasks.forEach((task, index) => {
      const taskCard = this.createTaskCard(task, index);
      taskGrid.appendChild(taskCard);
    });
  }

  createTaskCard(task, index) {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="task-card-header">
        <h3>${task.title}</h3>
        <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
      </div>
      <p class="task-subject">Subject: ${task.subject}</p>
      <p class="task-description">${task.description}</p>
      <p class="task-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
      <p class="task-time">Duration: ${task.duration} hours</p>
      <div class="task-actions">
        <button class="btn-small btn-edit" onclick="taskManager.editTask(${index})">Edit</button>
        <button class="btn-small btn-toggle" onclick="taskManager.toggleTask(${index})">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button class="btn-small btn-delete" onclick="taskManager.deleteTask(${index})">Delete</button>
      </div>
    `;
    return card;
  }

  toggleTask(index) {
    this.tasks[index].completed = !this.tasks[index].completed;
    this.saveTasks();
    this.loadTasks();
  }

  deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      this.loadTasks();
    }
  }

  editTask(index) {
    const task = this.tasks[index];
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-subject').value = task.subject;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-duration').value = task.duration;
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-date').value = task.dueDate.split('T')[0];
    
    // Mark form as editing
    document.getElementById('add-task-form').dataset.editIndex = index;
    document.querySelector('.btn-add-task').textContent = 'Update Task';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setupForm() {
    const form = document.getElementById('add-task-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const task = {
        title: document.getElementById('task-title').value,
        subject: document.getElementById('task-subject').value,
        description: document.getElementById('task-description').value,
        duration: parseFloat(document.getElementById('task-duration').value),
        priority: document.getElementById('task-priority').value,
        dueDate: document.getElementById('task-date').value,
        completed: false
      };

      const editIndex = form.dataset.editIndex;
      if (editIndex !== undefined) {
        this.tasks[editIndex] = task;
        delete form.dataset.editIndex;
        document.querySelector('.btn-add-task').textContent = 'Add Task';
      } else {
        this.tasks.push(task);
      }

      this.saveTasks();
      form.reset();
      this.loadTasks();
      alert('Task ' + (editIndex !== undefined ? 'updated' : 'added') + ' successfully!');
    });
  }

  saveTasks() {
    this.currentUser.tasks = this.tasks;
    auth.updateUserData({ tasks: this.tasks });
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

let taskManager;
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.users || Object.keys(auth.users).length === 0) {
    auth.users = auth.loadFromStorage('users') || {};
  }
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (storedUser && !auth.currentUser) {
    auth.currentUser = storedUser;
  }
  taskManager = new TaskManager();
});

if (document.readyState !== 'loading') {
  if (!auth.users || Object.keys(auth.users).length === 0) {
    auth.users = auth.loadFromStorage('users') || {};
  }
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (storedUser && !auth.currentUser) {
    auth.currentUser = storedUser;
  }
  taskManager = new TaskManager();
}