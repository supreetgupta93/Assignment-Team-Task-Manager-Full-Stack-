# Team Task Manager

A full-stack web application for managing team tasks and projects with role-based access control (RBAC). Built with the MERN stack (MongoDB, Express.js, React, Node.js) and deployed on Railway.

## 🎯 Features

### Authentication & Security
- User signup with email validation and password hashing (bcrypt)
- Secure login with JWT tokens (7-day expiration)
- Password strength validation (minimum 8 characters)
- Rate limiting on auth endpoints (5 attempts per 15 minutes)
- Input validation using Joi schema
- Helmet.js for HTTP security headers

### Role-Based Access Control (RBAC)
- **Admin Role:** Create projects, create/update/delete tasks, assign tasks to members
- **Member Role:** View assigned tasks, update task status only
- Role enforcement on both backend and frontend

### Project Management
- Create projects (admin only)
- View user-specific projects
- Delete projects (creator only)
- Project descriptions and management

### Task Management
- Create tasks with title, description, due date (admin only)
- Assign tasks to team members (admin only)
- Update task status (Assigned member only): To Do → In Progress → Completed
- Delete tasks (admin only)
- View user-specific or all tasks (based on role)
- Due date tracking and overdue alerts

### Dashboard
- Total tasks count
- Completed tasks count
- In Progress tasks count
- Overdue tasks with alerts
- User-specific task filtering

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Axios |
| Backend | Node.js, Express.js, MongoDB Atlas |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Tokens), bcryptjs |
| Security | Helmet.js, express-rate-limit |
| Validation | Joi schema validation |
| Deployment | Railway |

## 📋 Prerequisites

- Node.js v16+ and npm
- MongoDB Atlas account (free tier available)
- Railway account (for deployment)

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd Assignment
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file in `server` directory:
```env
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your_secure_random_secret_here
```

**To get MongoDB connection string:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string: Connect → Drivers → Copy connection string
5. Replace `<username>`, `<password>`, and database name

### 3. Frontend Setup
```bash
cd ../client
npm install
```

The frontend is configured to proxy API calls to `http://localhost:5001` (see `vite.config.js`).

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
# Server runs on http://localhost:5001
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Client runs on http://localhost:5176 (or next available port)
```

## 📚 API Documentation

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: { token, user }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: { token, user }
```

#### Get Current User
```http
GET /api/auth/me
Authorization: <jwt-token>

Response: { _id, name, email, role }
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects
Authorization: <jwt-token>

Response: [{ _id, name, description, createdBy, members }]
```

#### Create Project (Admin Only)
```http
POST /api/projects
Authorization: <jwt-token>
Content-Type: application/json

{
  "name": "Project Name",
  "description": "Project description"
}

Response: { _id, name, description, createdBy, members }
```

#### Delete Project (Creator Only)
```http
DELETE /api/projects/:projectId
Authorization: <jwt-token>

Response: { msg: "Project deleted" }
```

### Task Endpoints

#### Get Tasks
```http
GET /api/tasks
Authorization: <jwt-token>

- Admins: Get all tasks
- Members: Get only assigned tasks

Response: [{ _id, title, description, status, dueDate, projectId, assignedTo, createdBy }]
```

#### Create Task (Admin Only)
```http
POST /api/tasks
Authorization: <jwt-token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task description",
  "dueDate": "2024-12-31",
  "projectId": "<project_id>",
  "assignedTo": "<user_id>"
}

Response: { _id, ... }
```

#### Update Task Status (Assigned Member Only)
```http
PUT /api/tasks/:taskId
Authorization: <jwt-token>
Content-Type: application/json

{
  "status": "In Progress"
}

Response: { _id, ..., status }
```

#### Delete Task (Admin Only)
```http
DELETE /api/tasks/:taskId
Authorization: <jwt-token>

Response: { msg: "Task deleted" }
```

### User Endpoints

#### Get All Users
```http
GET /api/users
Authorization: <jwt-token>

Response: [{ _id, name, email, role }]
```

## 📱 User Interface

### Pages

1. **Login Page** (`/login`)
   - Email and password fields with validation
   - Link to signup page
   - Error messages displayed as toast notifications

2. **Signup Page** (`/signup`)
   - Name, email, password fields with validation
   - All users registered as Members (contact admin for admin role)
   - Redirect to login after signup

3. **Dashboard** (`/dashboard`)
   - Task statistics cards (Total, Completed, In Progress, Overdue)
   - Overdue tasks list with highlighting
   - Task filtering by user role

4. **Projects** (`/projects`)
   - Admin: Create, view, and delete projects
   - Members: View available projects
   - Project cards with description and creator info

5. **Tasks** (`/tasks`)
   - Admin: Create, view, and delete tasks
   - Members: View assigned tasks and update status
   - Task cards with status dropdowns
   - Validation for all form inputs

## 🔐 Security Features

- **Password Hashing:** bcryptjs with 10 salt rounds
- **JWT Tokens:** 7-day expiration
- **Rate Limiting:** 5 login attempts per 15 minutes
- **HTTPS Headers:** Helmet.js for security headers
- **Input Validation:** Joi schema validation on all endpoints
- **CORS:** Configured for development
- **Environment Variables:** Sensitive data in `.env` (not in git)

## 🚢 Deployment on Railway

### Step 1: Prepare Code
```bash
# Remove any sensitive data
rm .env
git add .gitignore
git commit -m "Add .gitignore"
```

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <github-repo-url>
git push -u origin main
```

### Step 3: Deploy Backend on Railway

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. New Project → GitHub Repo
4. Select your repository
5. Create `server` service:
   - Add Environment Variables:
     - `PORT`: 5001
     - `MONGO_URI`: (your MongoDB Atlas connection string)
     - `JWT_SECRET`: (generate a secure random string)
   - Start Command: `npm start`
6. Deploy

### Step 4: Deploy Frontend on Railway or Vercel

**Option A: Railway**
1. Add another service for `client`
2. Build Command: `npm run build`
3. Start Command: `npm run preview`
4. Update vite.config.js proxy to use Railway backend URL

**Option B: Vercel (Recommended for React)**
1. Go to [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Framework: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_URL`: (your Railway backend URL)
7. Deploy

### Step 5: Update API URL
Update `client/src/axios.config.js` or API calls with production backend URL.

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  role: String (Admin | Member, default: Member)
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String (required),
  createdBy: ObjectId (User, required),
  members: [ObjectId] (User refs)
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String (required),
  status: String (To Do | In Progress | Completed, default: To Do),
  dueDate: Date (required),
  projectId: ObjectId (Project, required),
  assignedTo: ObjectId (User, required),
  createdBy: ObjectId (User, required)
}
```

## 🧪 Testing the App

### Test Admin Features
1. Signup as Admin (requires manual role update in MongoDB)
2. Create a project
3. Create a task and assign to a member
4. Update task status (should be disabled)

### Test Member Features
1. Signup as Member
2. View dashboard
3. View assigned tasks
4. Update assigned task status
5. Try creating a project (should be blocked)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5001 already in use | Change PORT in `.env` or kill process using that port |
| MongoDB connection fails | Check connection string in `.env`, whitelist IP in MongoDB Atlas |
| CORS errors | Ensure backend and frontend URLs match in config |
| Tasks not displaying | Check browser console (F12) for API errors |
| Form validation errors | Ensure input meets requirements (min length, email format, etc.) |

## 📝 Project Structure

```
Assignment/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Tasks.jsx
│   │   ├── components/
│   │   │   ├── Nav.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack MERN development
- RESTful API design
- JWT authentication and RBAC
- Input validation and security best practices
- Error handling and user feedback
- Responsive UI with Tailwind CSS
- Production deployment on Railway

## 📄 License

MIT License - feel free to use for learning and projects

## ✨ Author

Built as an assignment project demonstrating full-stack web development skills.

---

**Live Demo:** [Your Railway URL]

**GitHub Repository:** [Your GitHub URL]

For questions or issues, please open a GitHub issue.