// Dashboard Functionality
class Dashboard {
  constructor() {
    this.currentUser = auth.getCurrentUser();
    this.sortBy = 'date'; // default sort
    // expose for inline access and event handlers
    window.dashboard = this;
    this.init();
  }

  init() {
    if (!this.currentUser) {
      window.location.href = 'login.html';
      return;
    }
    this.displayWelcome();
    this.setupSortControls();
    this.loadTasks();
    this.loadProgress();
    this.loadSubjectProgress();
    this.setupLogout();
  }

  displayWelcome() {
    const header = document.querySelector('.dashboard-header h2');
    if (header) {
      header.textContent = `Welcome, ${this.currentUser.username}!`;
    }
  }

  setupSortControls() {
    const sortSelect = document.getElementById('task-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.loadTasks();
      });
    }
  }

  sortTasks(tasks) {
    const tasksCopy = [...tasks];
    
    if (this.sortBy === 'priority') {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      tasksCopy.sort((a, b) => {
        // Pending tasks first, completed last
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then by priority
        return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
      });
    } else if (this.sortBy === 'status') {
      tasksCopy.sort((a, b) => {
        // Pending first, completed last
        return a.completed - b.completed;
      });
    } else { // date (default)
      tasksCopy.sort((a, b) => {
        // Pending tasks first
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // Then by date
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }
    
    return tasksCopy;
  }

  loadTasks() {
    const taskList = document.getElementById('dashboard-tasks');
    if (!taskList) return;

    const tasks = this.currentUser.tasks || [];

    if (tasks.length === 0) {
      taskList.innerHTML = '<li class="no-tasks">No tasks yet. <a href="schedule.html">Create one</a></li>';
      return;
    }

    const sortedTasks = this.sortTasks(tasks);
    taskList.innerHTML = '';
    
    sortedTasks.slice(0, 5).forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      const header = document.createElement('div');
      header.className = 'task-header';
      header.innerHTML = `<strong>${task.title}</strong>`;

      const status = document.createElement('span');
      status.className = 'task-status';
      status.textContent = task.completed ? '✓ Completed' : 'Pending';
      header.appendChild(status);

      li.appendChild(header);

      const subj = document.createElement('p');
      subj.className = 'task-subject';
      subj.textContent = `Subject: ${task.subject}`;
      li.appendChild(subj);

      const pr = document.createElement('p');
      pr.className = 'task-priority';
      pr.innerHTML = `Priority: <span class="priority-${task.priority.toLowerCase()}">${task.priority}</span>`;
      li.appendChild(pr);

      const dt = document.createElement('p');
      dt.className = 'task-date';
      dt.textContent = `Due: ${new Date(task.dueDate).toLocaleDateString()}`;
      li.appendChild(dt);

      const actions = document.createElement('div');
      actions.className = 'task-actions';
      const btn = document.createElement('button');
      btn.className = 'btn-small btn-toggle';
      btn.textContent = task.completed ? 'Undo' : 'Complete';
      btn.addEventListener('click', () => this.toggleTaskCompleteById(task.id));
      actions.appendChild(btn);
      li.appendChild(actions);

      taskList.appendChild(li);
    });
  }

  toggleTaskCompleteById(id) {
    // sync currentUser
    const current = auth.getCurrentUser();
    if (!current) return;
    const tasks = current.tasks || [];
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    tasks[idx].completed = !tasks[idx].completed;
    // persist
    auth.updateUserData({ tasks });
    // refresh local view
    this.currentUser = auth.getCurrentUser();
    this.loadTasks();
    this.loadProgress();
    this.loadSubjectProgress();
  }

  loadProgress() {
    const progressBar = document.getElementById('today-progress');
    const progressText = document.getElementById('progress-text');

    if (progressBar && progressText) {
      const tasks = this.currentUser.tasks || [];
      const completedTasks = tasks.filter(t => t.completed).length;
      const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

      progressBar.style.width = progress + '%';
      progressBar.textContent = progress + '%';
      progressText.textContent = `You've completed ${completedTasks} out of ${tasks.length} tasks. Great job!`;
    }
  }

  loadSubjectProgress() {
    const subjectBreakdownContainer = document.getElementById('subject-breakdown');
    if (!subjectBreakdownContainer) return;

    const tasks = this.currentUser.tasks || [];
    if (tasks.length === 0) {
      subjectBreakdownContainer.innerHTML = '<p class="no-tasks">Add tasks to see subject progress.</p>';
      return;
    }

    // Calculate progress by subject
    const subjectStats = {};
    tasks.forEach(task => {
      if (!subjectStats[task.subject]) {
        subjectStats[task.subject] = { total: 0, completed: 0 };
      }
      subjectStats[task.subject].total++;
      if (task.completed) {
        subjectStats[task.subject].completed++;
      }
    });

    subjectBreakdownContainer.innerHTML = '';
    
    Object.keys(subjectStats).forEach(subject => {
      const stats = subjectStats[subject];
      const percentage = Math.round((stats.completed / stats.total) * 100);
      
      const subjectDiv = document.createElement('div');
      subjectDiv.className = 'subject-progress-item';
      subjectDiv.innerHTML = `
        <div class="subject-header">
          <strong>${subject}</strong>
          <span class="subject-stat">${stats.completed}/${stats.total}</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${percentage}%;">${percentage}%</div>
        </div>
      `;
      subjectBreakdownContainer.appendChild(subjectDiv);
    });
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

// Initialize dashboard when page loads
let dashboardInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  if (dashboardInitialized) return;
  dashboardInitialized = true;
  
  // Ensure auth system has loaded users data
  if (!auth.users || Object.keys(auth.users).length === 0) {
    auth.users = auth.loadFromStorage('users') || {};
  }
  
  // Verify currentUser is in sync - check both localStorage and sessionStorage
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (storedUser && !auth.currentUser) {
    auth.currentUser = storedUser;
  }
  
  new Dashboard();
});

// Also handle if page is already loaded
if (document.readyState !== 'loading' && !dashboardInitialized) {
  dashboardInitialized = true;
  
  if (!auth.users || Object.keys(auth.users).length === 0) {
    auth.users = auth.loadFromStorage('users') || {};
  }
  
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (storedUser && !auth.currentUser) {
    auth.currentUser = storedUser;
  }
  
  new Dashboard();
}