// Analytics with Graphs
class Analytics {
  constructor() {
    this.currentUser = auth.getCurrentUser();
    this.init();
  }

  init() {
    // Ensure auth is properly loaded
    if (!auth.isLoggedIn() || !this.currentUser) {
      window.location.href = 'login.html';
      return;
    }

    this.loadAnalytics();
    this.setupLogout();
  }

  loadAnalytics() {
    this.displayTaskStats();
    this.displayProgressChart();
    this.displayTimeSpentChart();
    this.displaySubjectBreakdown();
  }

  displayTaskStats() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    const tasks = this.currentUser.tasks || [];
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;
    const totalHours = tasks.reduce((sum, t) => sum + (t.duration || 0), 0);
    const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    statsContainer.innerHTML = `
      <div class="stat-card">
        <h4>Total Tasks</h4>
        <p class="stat-number">${tasks.length}</p>
      </div>
      <div class="stat-card">
        <h4>Completed</h4>
        <p class="stat-number">${completedTasks}</p>
      </div>
      <div class="stat-card">
        <h4>Pending</h4>
        <p class="stat-number">${pendingTasks}</p>
      </div>
      <div class="stat-card">
        <h4>Total Study Hours</h4>
        <p class="stat-number">${totalHours.toFixed(1)}</p>
      </div>
      <div class="stat-card">
        <h4>Completion Rate</h4>
        <p class="stat-number">${completionRate}%</p>
      </div>
    `;
  }

  displayProgressChart() {
    const canvas = document.getElementById('progress-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const tasks = this.currentUser.tasks || [];
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;

    // Draw pie chart
    const total = tasks.length || 1;
    const completedPercent = completed / total;
    const pendingPercent = pending / total;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw completed portion (green)
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, completedPercent * 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // Draw pending portion (orange)
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, completedPercent * 2 * Math.PI, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // Add text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(completed + '/' + tasks.length, centerX, centerY);

    // Legend
    const legend = document.getElementById('progress-legend');
    if (legend) {
      legend.innerHTML = `
        <div class="legend-item"><span class="legend-color" style="background: #4CAF50;"></span>Completed: ${completed}</div>
        <div class="legend-item"><span class="legend-color" style="background: #FF9800;"></span>Pending: ${pending}</div>
      `;
    }
  }

  displayTimeSpentChart() {
    const canvas = document.getElementById('time-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const tasks = this.currentUser.tasks || [];

    // Group tasks by subject
    const subjectTime = {};
    tasks.forEach(task => {
      subjectTime[task.subject] = (subjectTime[task.subject] || 0) + task.duration;
    });

    const subjects = Object.keys(subjectTime);
    const times = Object.values(subjectTime);

    const maxTime = Math.max(...times, 1);
    const barWidth = canvas.width / (subjects.length || 1);
    const padding = 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width, canvas.height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, 0);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    // Draw bars
    ctx.fillStyle = '#667eea';
    subjects.forEach((subject, index) => {
      const x = padding + index * barWidth + barWidth / 4;
      const barHeight = (times[index] / maxTime) * (canvas.height - padding - 30);
      const y = canvas.height - padding - barHeight;

      ctx.fillRect(x, y, barWidth / 2, barHeight);

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(subject, x + barWidth / 4, canvas.height - padding + 20);
    });
  }

  displaySubjectBreakdown() {
    const container = document.getElementById('subject-breakdown');
    if (!container) return;

    const tasks = this.currentUser.tasks || [];
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

    container.innerHTML = '';
    Object.entries(subjectStats).forEach(([subject, stats]) => {
      const percentage = Math.round((stats.completed / stats.total) * 100);
      const row = document.createElement('div');
      row.className = 'breakdown-row';
      row.innerHTML = `
        <span>${subject}</span>
        <div class="breakdown-bar">
          <div class="breakdown-progress" style="width: ${percentage}%"></div>
        </div>
        <span>${percentage}%</span>
      `;
      container.appendChild(row);
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

let analytics;
document.addEventListener('DOMContentLoaded', () => {
  if (!auth.users || Object.keys(auth.users).length === 0) {
    auth.users = auth.loadFromStorage('users') || {};
  }
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (storedUser && !auth.currentUser) {
    auth.currentUser = storedUser;
  }
  analytics = new Analytics();
});

if (document.readyState !== 'loading') {
  if (!auth.users || Object.keys(auth.users).length === 0) {
    auth.users = auth.loadFromStorage('users') || {};
  }
  const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
  if (storedUser && !auth.currentUser) {
    auth.currentUser = storedUser;
  }
  analytics = new Analytics();
}