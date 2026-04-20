# StudyGen - Testing Guide

## ✅ How to Test the Application

### Initial Setup
Open `index.html` in your browser. You should see:
- Purple gradient background
- "StudyGen" title
- "Loading..." message
- Auto-redirect to login page (since no user is logged in)

---

## 1. Testing Registration

### Step 1: Create Account
- See login page with login form
- Click "Register here" link
- Registration modal appears
- Enter:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `password123`
  - Confirm Password: `password123`
- Click "Register" button
- See success message: "Registration successful! Please login."
- Modal closes, you're back at login page

### Expected Results ✓
- Account created successfully
- Modal closes after registration
- Can proceed to login

### Test Validation
**Test missing fields:**
- Try registering with empty username → Error: "All fields are required"
- Try with mismatched passwords → Error: "Passwords do not match"
- Try with password < 6 chars → Error: "Password must be at least 6 characters"
- Try existing username → Error: "Username already exists"

---

## 2. Testing Login

### Step 1: Login
- On login page, enter:
  - Username: `testuser`
  - Password: `password123`
- Click "Login" button
- You should be redirected to dashboard.html

### Expected Results ✓
- Successfully logged in
- Redirected to dashboard
- See "Welcome, testuser!" in dashboard header
- Can see sidebar with navigation

### Test Validation
**Test invalid credentials:**
- Try wrong password → Error: "Invalid username or password"
- Try non-existent username → Error: "Invalid username or password"
- Try empty fields → Error shown on form

### Test "Remember Me"
- Check "Remember me" checkbox
- Login
- Check localStorage in DevTools → `rememberMe` is stored

---

## 3. Testing Dashboard

### Expected Elements ✓
- Welcome message with username
- Calendar section (embedded Google Calendar)
- "Your Tasks" section showing recent tasks
- "Today's Progress" section with progress bar
- Navigation sidebar with all menu items

### Navigate Through Page
- Scroll through all sections
- Check that layout is responsive
- Mobile: Click hamburger menu to toggle sidebar

---

## 4. Testing Task Management (Schedule Page)

### Create First Task
- Click "Schedule Task" from sidebar
- Fill form:
  - Title: `Study Physics Chapter 5`
  - Subject: `Physics`
  - Description: `Read pages 150-200 and solve problems`
  - Due Date: Pick tomorrow's date
  - Priority: `High`
  - Duration: `2.5`
- Click "Add Task"
- See "Task added successfully!" message
- Task appears as a card in task grid below

### Task Card Should Show ✓
- Title: "Study Physics Chapter 5"
- Subject: "Physics"
- Description: "Read pages 150-200 and solve problems"
- Due Date: Tomorrow's date
- Duration: "2.5 hours"
- Priority badge (red for High)
- Edit, Complete, Delete buttons

### Create Multiple Tasks
Add 3-4 more tasks with different:
- Priorities (Low, Medium, High)
- Subjects
- Due dates

### Expected Layout ✓
- Tasks displayed in responsive grid
- Multiple columns on desktop, single column on mobile
- All task cards visible and well-styled

### Test Task Actions

**Edit Task:**
- Click "Edit" on a task
- Form fills with task details
- Change some values (e.g., title, priority)
- Button changes to "Update Task"
- Click "Update Task"
- Form resets, button returns to "Add Task"
- Task in grid is updated ✓

**Complete Task:**
- Click "Complete" button on a task
- Task card becomes slightly faded (opacity 0.7)
- Button changes to "Undo"
- Border color changes to green ✓

**Undo Completion:**
- Click "Undo" on completed task
- Card goes back to normal opacity
- Button returns to "Complete" ✓

**Delete Task:**
- Click "Delete" on a task
- Confirmation dialog appears: "Are you sure you want to delete this task?"
- Click "OK" to confirm
- Task disappears from grid ✓
- Click "Cancel" to keep task ✓

---

## 5. Testing Dashboard After Tasks

Go back to Dashboard page:

### Expected Updates ✓
- "Your Tasks" section now shows your created tasks (up to 5)
- Each task shows: title, subject, due date, status
- "Today's Progress" bar updates based on completed tasks
- Progress calculation: (completed / total) * 100

**Example:**
- If you have 4 tasks and 1 is completed: 25% progress shown

---

## 6. Testing Study Material Management

### Add Study Material
- Click "Study Material" from sidebar
- Form has:
  - Title input field
  - Link input field (Google Drive URL)
  - "Add Material" button

### Add Some Materials
Add 3 materials:

**Material 1:**
- Title: `Physics Notes - Chapter 5`
- Link: `https://drive.google.com/drive/folders/example1`

**Material 2:**
- Title: `Math Tutorial Videos`
- Link: `https://youtube.com/watch?v=example`

**Material 3:**
- Title: `Chemistry Textbook PDF`
- Link: `https://example.com/chemistry.pdf`

All should appear in material grid below ✓

### Test Material Card ✓
Each card shows:
- Title
- Progress: 0%
- Open button (📁 Open)
- Edit, Update Progress, Delete buttons

### Test Material Actions

**Open Material:**
- Click "Open" button
- Should open link in new tab ✓

**Update Progress:**
- Click "Update Progress" on a material
- Prompt dialog asks for percentage (0-100)
- Enter: `50`
- Progress on card updates to 50% ✓
- Try again with: `100` - updates to 100% ✓

**Edit Material:**
- Click "Edit" on a material
- Form fills with material details
- Change title to: `Physics Chapter 5 - Notes & Videos`
- Click "Add Material"
- Card updates with new title ✓

**Delete Material:**
- Click "Delete" on a material
- Confirmation: "Are you sure you want to delete this material?"
- Click "OK" to confirm - material disappears ✓

---

## 7. Testing Analytics Page

### Navigate to Analytics
- Click "Analytics" from sidebar

### Expected Elements ✓
- Page title: "Your Analytics"
- Stats section with 5 cards:
  1. Total Tasks (count)
  2. Completed (count)
  3. Pending (count)
  4. Total Study Hours (sum of duration)
  5. Completion Rate (%)

### Example Stats (with your created data)
```
Total Tasks: 5
Completed: 1
Pending: 4
Total Study Hours: 10.5
Completion Rate: 20%
```

### Visual Elements ✓

**Pie Chart Section:**
- Title: "Task Completion"
- Canvas showing pie chart:
  - Green portion: completed tasks
  - Orange portion: pending tasks
- Center text: "1/5" (completed/total)
- Legend below showing:
  - ✓ Completed: 1
  - Pending: 4

**Time Spent Chart:**
- Title: "Time Spent by Subject"
- Canvas showing bar chart:
  - X-axis: Subject names
  - Y-axis: Hours
  - Bars for each subject

**Subject Breakdown:**
- Title: "Subject Breakdown"
- Rows for each subject:
  ```
  Physics    [████░░░░░░] 40%
  Math       [██░░░░░░░░] 20%
  Chemistry  [██████░░░░] 60%
  ```

---

## 8. Testing Logout

### Click Logout
- Click "Logout" from sidebar
- Redirected to login.html ✓
- All user data still in localStorage (persist for next login)

### Login Again
- Use same credentials: `testuser` / `password123`
- All your tasks and materials are still there ✓
- Progress and completion status preserved ✓

---

## 9. Testing Data Persistence

### Close and Reopen Browser
1. Create a task: "Test Persistence"
2. Navigate to Dashboard - verify task shows
3. Close browser completely
4. Reopen, go to index.html
5. Should auto-redirect to Dashboard (session still active)
6. Your task "Test Persistence" is still there ✓

### Clear LocalStorage
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find your domain URL
4. View stored data:
   - `users` object with your account
   - `currentUser` showing logged-in username
5. Try refreshing page - still works ✓

---

## 10. Testing Responsive Design

### Desktop View
- Open on desktop
- Width > 1200px
- Sidebar visible (250px width)
- Main content takes remaining space
- Grid layouts with multiple columns

### Tablet View
- Press F12 (DevTools)
- Toggle Device Toolbar (Ctrl+Shift+M)
- Select iPad or similar
- Screen width: 768px-1024px
- Sidebar still visible
- Task grid: 2-3 columns
- Material grid: 2 columns

### Mobile View
- Select "iPhone X" or similar (375px width)
- Hamburger menu (☰) appears in top-left
- Click hamburger - sidebar slides down
- Task/material grids: 1 column
- Content is full width

### Test Mobile Menu
- Click hamburger (☰)
- Sidebar appears below (slides down)
- Click a link (e.g., "Analytics")
- Navigate to page
- Sidebar should collapse (auto-close on navigation)
- Click hamburger again to reopen ✓

---

## 11. Error Handling Tests

### Test Invalid Inputs in Task Form
- Click Schedule Task
- Try adding task with:
  - Empty title → Form validation error ✓
  - No subject selected → Form validation error ✓
  - No due date → Form validation error ✓

### Test Study Material Form
- Try adding with empty title → Modal error ✓
- URL field can be empty (not required) ✓

---

## 12. User Interface Tests

### Check All Buttons Work
- ✓ Login button
- ✓ Register button
- ✓ Add Task button
- ✓ Edit buttons (all pages)
- ✓ Delete buttons (confirmation dialog)
- ✓ Update Progress button
- ✓ Logout button

### Check Navigation
- ✓ All sidebar menu items work
- ✓ Active page highlighted in sidebar
- ✓ Can navigate between all pages

### Check Visual Feedback
- ✓ Hover effects on buttons
- ✓ Completed tasks appear faded
- ✓ Priority badges are color-coded
- ✓ Form inputs highlight on focus

---

## 13. Performance Check

### Check Page Load
- Opening index.html → should load in < 2 seconds
- All pages should load smoothly without lag
- Animations should be smooth

### Check for Errors
- Open DevTools Console (F12)
- Perform all actions
- Should see NO error messages ✓
- Warnings are OK (deprecation, etc.)

---

## 14. Test Data Scenarios

### Scenario 1: New User with 1 Task
1. Register new account: `user1`
2. Create 1 task
3. Check Dashboard → Task appears
4. Check Analytics → 0% completion
5. Complete task
6. Check Analytics → 100% completion ✓

### Scenario 2: Multiple Subjects
1. Create tasks for different subjects:
   - Physics: 3 hours
   - Math: 2 hours
   - Chemistry: 2.5 hours
2. Check Analytics
3. Subject breakdown should show all three ✓
4. Total hours: 7.5 ✓

### Scenario 3: Priority Distribution
1. Create 5 tasks:
   - 2 High priority (red)
   - 2 Medium priority (yellow)
   - 1 Low priority (green)
2. Check visual icons are correct ✓
3. All tasks visible in grid ✓

---

## ✅ Final Checklist

- [ ] Registration works
- [ ] Login works
- [ ] Dashboard displays correctly
- [ ] Task creation works
- [ ] Task editing works
- [ ] Task completion works
- [ ] Task deletion works
- [ ] Study materials add/edit/delete work
- [ ] Analytics show correct data
- [ ] Logout works
- [ ] Data persists across sessions
- [ ] Responsive design works
- [ ] Mobile menu works
- [ ] No console errors
- [ ] All buttons functional
- [ ] All navigation links work

---

## 🎉 All Tests Passed!

If you've successfully completed all tests above, congratulations! Your StudyGen application is fully functional and ready to use.

**Enjoy your enhanced study scheduling experience!** 📚✨
