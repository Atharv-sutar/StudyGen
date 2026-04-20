# StudyGen - Smart Study Schedule Generator

A complete web application for managing your study schedules, tracking progress, and optimizing your learning process.

## ✨ Features

### 1. **Login/Register System** ✅
- Create a new account with username, email, and password
- Secure login with "Remember Me" functionality
- Password validation (minimum 6 characters)
- Session management with localStorage

### 2. **Dashboard** ✅
- Welcome message with personalized greeting
- View your recent tasks at a glance
- Calendar integration (Google Calendar)
- Track today's progress with visual progress bar
- Quick access to all features

### 3. **Schedule/Task Management** ✅
- Create new tasks with:
  - Title
  - Subject (Physics, Math, Chemistry, Biology, etc.)
  - Description
  - Due date
  - Priority level (Low, Medium, High)
  - Estimated duration (hours)
- Edit existing tasks
- Mark tasks as complete/pending
- Delete tasks
- Visual task cards with color-coded priorities

### 4. **Study Material Management** ✅
- Add study material links (Google Drive, YouTube, etc.)
- Track progress for each material (0-100%)
- Quick access buttons to open study materials
- Edit and delete materials
- Organized grid view of all materials

### 5. **Analytics Dashboard** ✅
- Task statistics (total, completed, pending)
- Total study hours calculation
- Completion rate calculation
- Visual pie chart showing task completion
- Bar chart for time spent per subject
- Subject-wise breakdown with progress bars

### 6. **Logout** ✅
- Secure logout functionality
- Clear session data
- Redirect to login page

## 📁 File Structure

```
Hackathon/
├── index.html                      # Entry point
├── CSS/
│   ├── login.css                  # Login/Register styling
│   ├── style.css                  # Dashboard styling
│   ├── schedule.css               # Schedule page styling
│   ├── studymaterial.css          # Study materials styling
│   └── analytics.css              # Analytics page styling
├── HTML/
│   ├── login.html                 # Login & Register page
│   ├── dashboard.html             # Main dashboard
│   ├── schedule.html              # Task scheduling page
│   ├── study-material.html        # Study materials page
│   └── analytics.html             # Analytics page
└── Javascript/
    ├── auth.js                    # Authentication system
    ├── dashboard.js               # Dashboard functionality
    ├── schedule.js                # Task management
    ├── study-material.js          # Study material management
    └── analytics.js               # Analytics and charts
```

## 🚀 Getting Started

### 1. Open the Application
   - Open `index.html` in a web browser
   - You'll be automatically redirected to login if not authenticated

### 2. Create an Account
   - Click "Register here" on the login page
   - Fill in username, email, password
   - Confirm your password matches
   - Click "Register"
   - Log in with your credentials

### 3. Navigate to Dashboard
   - After logging in, you'll see the main dashboard
   - View calendar and recent tasks
   - Check today's progress

### 4. Add Tasks
   - Click "Schedule Task" in the sidebar
   - Fill in task details:
     - Task Title (required)
     - Subject (required)
     - Description (optional)
     - Due Date (required)
     - Priority Level (High/Medium/Low)
     - Duration in hours (required)
   - Click "Add Task"
   - Your task appears in the task grid

### 5. Manage Study Materials
   - Click "Study Material" in the sidebar
   - Enter material title and Google Drive/study link
   - Click "Add Material"
   - Click material link to open in new tab
   - Update progress or delete as needed

### 6. View Analytics
   - Click "Analytics" in the sidebar
   - See stats: Total Tasks, Completed, Pending, Hours, Rate
   - View pie chart of task completion
   - See bar chart of time spent per subject
   - Track subject-wise progress

### 7. Logout
   - Click "Logout" in the sidebar
   - You'll be redirected to login page

## 💾 Data Storage

- All data is stored in **browser's localStorage**
- Data persists across browser sessions
- Clear browser data/cache to clear all stored information
- Each user account is isolated and unique

## 🎨 Color Scheme

- **Primary**: #ff79c6 (Pink)
- **Success**: #50fa7b (Green)
- **Warning**: #f1fa8c (Yellow)
- **Error**: #ff5555 (Red)
- **Info**: #8be9fd (Cyan)
- **Background**: #1e1e2e (Dark)
- **Accent**: #282a36 (Darker)

## 📱 Responsive Design

- Works on desktop, tablet, and mobile
- Mobile menu toggle button appears on screens < 768px
- Touch-friendly buttons and inputs
- Optimized layout for all screen sizes

## 🔐 Security Notes

**Current Implementation**:
- Passwords stored in localStorage (for demo only)
- Simple client-side authentication

**For Production**:
⚠️ This demo stores passwords in plain text. For production:
1. Use a backend server (Node.js, Python, etc.)
2. Hash passwords with bcrypt or similar
3. Use sessions or JWT tokens
4. Implement proper database
5. Use HTTPS only

## 🐛 Known Features

✅ Full authentication system with registration and login
✅ Complete task management with CRUD operations
✅ Study material linking with progress tracking
✅ Visual analytics with charts and statistics
✅ Responsive mobile-friendly design
✅ Automatic session management
✅ Data persistence across sessions

## 🔧 Customization

### Add New Subjects
Edit `schedule.html` and `HTML` files - Update the subject dropdown:
```html
<option value="Your Subject">Your Subject</option>
```

### Change Color Scheme
Edit CSS files and update color variables:
- Primary: `#ff79c6`
- Success: `#50fa7b`
- etc.

### Extend Features
1. Add new pages in `HTML/` folder
2. Create corresponding JS file in `Javascript/`
3. Create CSS file in `CSS/`
4. Add menu link in sidebar
5. Connect to auth.js for user session management

## 📋 User Guide

### Best Practices

1. **Task Management**
   - Set realistic due dates
   - Break large tasks into smaller subtasks
   - Prioritize high-impact tasks

2. **Study Materials**
   - Organize materials by subject
   - Keep track of progress
   - Links should be accessible (shared Google Drive, public videos)

3. **Analytics**
   - Review weekly to track progress
   - Adjust task duration estimates based on actuals
   - Focus on subjects with lower completion rates

## 🌟 Tips for Success

- Set daily task goals
- Update task progress regularly
- Review analytics weekly
- Organize study materials by difficulty level
- Use different priority levels strategically
- Estimate task durations realistically

## 📞 Support

For issues or feature requests:
1. Check the browser console (F12) for errors
2. Ensure JavaScript is enabled
3. Clear cache if experiencing issues
4. Try a different browser if problems persist

## 📄 License

This project is provided as-is for educational purposes.

---

**Happy Studying! 📚**
