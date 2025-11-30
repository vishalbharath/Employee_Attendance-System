Employee Attendance System

A full-stack Employee Attendance Tracking System with role-based access for Employees and Managers, built using:

React + Redux Toolkit

Node.js + Express

MongoDB Atlas

JWT Authentication

Render (Backend deploy)

Netlify (Frontend deploy)

🌐 Live Demo
🔹 Frontend (Netlify)

➡️ https://employee-attendance-system-project.netlify.app/

🔹 Backend API (Render)

➡️ https://employee-attendance-system-rz8p.onrender.com/api

(Replace with your actual Netlify site link)

🚀 Features
🧑‍💼 Employee Features

Register / Login

Mark Attendance (Check In / Check Out)

View Monthly Summary (Present / Absent / Late / Half-day)

Full Calendar View with color coding

Daily status (checked-in or not)

View attendance history

Dashboard with stats & charts

👨‍💼 Manager Features

Login

View All Employees' Attendance

Filter by employee, date range, status

Team summary analytics

Team calendar (heatmap)

Export attendance reports as CSV

Dashboard with charts (Recharts)

Weekly trend

Department-wise attendance

List of absent / late employees for today

🗂️ Folder Structure
Employee_Attendance_System/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── _redirects
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
│
└── README.md

🛠️ Tech Stack
Frontend

React

Redux Toolkit

Axios

Recharts

React Calendar

Vite

Backend

Node.js

Express

MongoDB Atlas

JWT Authentication

Bcrypt Password Hashing

Deployment

Backend → Render

Frontend → Netlify

🔐 Environment Variables
Backend (backend/.env)
MONGO_URI=your_mongo_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=10000

Frontend (frontend/.env)
VITE_API_URL=https://employee-attendance-system-rz8p.onrender.com/api

📡 API Endpoints
🔹 Auth
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get user info
🔹 Employee Attendance
Method	Endpoint	Description
POST	/api/attendance/checkin	Check-in
POST	/api/attendance/checkout	Check-out
GET	/api/attendance/my-history	Attendance history
GET	/api/attendance/my-summary	Monthly summary
GET	/api/attendance/today	Today’s attendance status
🔹 Manager Attendance
Method	Endpoint	Description
GET	/api/attendance/all	All employees
GET	/api/attendance/employee/:id	Single employee
GET	/api/attendance/summary	Team stats
GET	/api/attendance/export	Export CSV
GET	/api/attendance/today-status	Today’s presence
🔹 Dashboards
Method	Endpoint	Description
GET	/api/dashboard/employee	Employee dashboard
GET	/api/dashboard/manager	Manager dashboard
🟩 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/Employee_Attendance-System.git
cd Employee_Attendance-System

2️⃣ Install backend dependencies
cd backend
npm install
npm run dev

3️⃣ Install frontend dependencies
cd ../frontend
npm install
npm run dev
