// Authentication System
class AuthSystem {
  constructor() {
    // Check localStorage first, then sessionStorage as fallback
    const localStorageValue = localStorage.getItem('currentUser');
    const sessionStorageValue = sessionStorage.getItem('currentUser');
    
    let fromStorage = localStorageValue || sessionStorageValue;
    
    this.users = this.loadFromStorage('users') || {};
    
    // Data integrity check - ensure users object has valid username keys
    const cleanedUsers = {};
    for (const key in this.users) {
      const user = this.users[key];
      // Only keep entries that have a username property and the key matches the username
      if (user && user.username && typeof user.username === 'string') {
        cleanedUsers[user.username] = user;
      }
    }
    
    // If we had to clean data, save the cleaned version
    if (Object.keys(cleanedUsers).length !== Object.keys(this.users).length) {
      this.users = cleanedUsers;
      this.saveToStorage('users', this.users);
    } else {
      this.users = cleanedUsers;
    }
    
    this.currentUser = fromStorage || null;
    
    // Verify the stored user still exists in users database
    if (this.currentUser && !this.users[this.currentUser]) {
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      this.currentUser = null;
    }
  }

  loadFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  register(username, email, password, confirmPassword) {
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return { success: false, message: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (this.users[username]) {
      return { success: false, message: 'Username already exists' };
    }

    // Create user
    this.users[username] = {
      username,
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      tasks: [],
      studyMaterials: [
        { id: 1, title: 'Default Study Material', link: '', progress: 0 }
      ],
      analytics: {
        totalHours: 0,
        sessionsCompleted: 0,
        progressData: []
      }
    };

    this.saveToStorage('users', this.users);
    return { success: true, message: 'Registration successful! Please login.' };
  }

  login(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Username and password are required' };
    }

    // Ensure users are loaded from storage
    if (!this.users || Object.keys(this.users).length === 0) {
      this.users = this.loadFromStorage('users') || {};
    }

    const user = this.users[username];
    if (!user || user.password !== password) {
      return { success: false, message: 'Invalid username or password' };
    }

    this.currentUser = username;
    // Use both localStorage and sessionStorage for reliability
    localStorage.setItem('currentUser', username);
    sessionStorage.setItem('currentUser', username);
    return { success: true, message: 'Login successful!' };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    if (!this.currentUser) return null;
    // Ensure users are loaded from storage
    if (!this.users || Object.keys(this.users).length === 0) {
      this.users = this.loadFromStorage('users') || {};
    }
    return this.users[this.currentUser] || null;
  }

  isLoggedIn() {
    // Check both the instance variable and storage as backup
    if (this.currentUser) return true;
    
    // Check both localStorage and sessionStorage
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = storedUser;
      return true;
    }
    return false;
  }

  updateUserData(data) {
    if (this.currentUser) {
      this.users[this.currentUser] = { ...this.users[this.currentUser], ...data };
      this.saveToStorage('users', this.users);
    }
  }
}

// Global auth instance
const auth = new AuthSystem();

// Login Page Handler
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    const result = auth.login(username, password);
    const errorDiv = document.getElementById('error-message');

    if (result.success) {
      if (remember) {
        localStorage.setItem('rememberMe', 'true');
      }
      window.location.href = 'dashboard.html';
    } else {
      errorDiv.textContent = result.message;
      errorDiv.style.display = 'block';
    }
  });

  // Register Modal
  const modal = document.getElementById('register-modal');
  const closeBtn = document.querySelector('.close');
  const registerLink = document.getElementById('register-link');

  registerLink.addEventListener('click', function(e) {
    e.preventDefault();
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    const result = auth.register(username, email, password, confirmPassword);
    const errorDiv = document.getElementById('register-error-message');

    if (result.success) {
      alert(result.message);
      modal.style.display = 'none';
      document.getElementById('register-form').reset();
    } else {
      errorDiv.textContent = result.message;
      errorDiv.style.display = 'block';
    }
  });
}
