# 🌟 **PROJECT AUTHOR & CONTACT INFORMATION** 🌟

## **<center>NAME: VISHAL BHARATH R</center>**
## **<center>ROLL NO: 22ALR110</center>**
## **<center>DEPARTMENT: AIML</center>**
## **<center>COLLEGE: KONGU ENGINEERING COLLEGE</center>**

| Contact Detail | Information |
| :--- | :--- |
| **Contact Number** | 8072865461 |
| **Personal Email ID** | vishalbharathonly@gmail.com |
| **College Email ID** | vishalbharathr.22aim@kongu.edu |

---

## 🚀 Employee Attendance Tracking System

A **full-stack** Employee Attendance Tracking System designed with **role-based access** for Employees and Managers.

This project showcases a modern MERN-stack application, focusing on robust authentication, state management, and clear data visualization.


---

### 💻 Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React** + **Redux Toolkit** | UI development and predictable state management. |
| | **Axios** | HTTP client for API requests. |
| | **Recharts** | For clear, data-driven charts and visualizations. |
| | **React Calendar** | Full calendar views for attendance history. |
| | **Vite** | Fast frontend tooling and bundling. |
| **Backend** | **Node.js** + **Express** | Server-side runtime and flexible web framework. |
| | **MongoDB Atlas** | Cloud-hosted NoSQL database for flexible data storage. |
| | **JWT** Authentication | Secure, stateless authentication with JSON Web Tokens. |
| | **Bcrypt** | Strong password hashing for security. |
| **Deployment** | Backend: **Render** | Continuous deployment for the Node/Express API. |
| | Frontend: **Netlify** | Hosting for the React application. |

---

### 🌐 Live Demo

Experience the system in action!

| Component | Link |
| :--- | :--- |
| **🔹 Frontend (Netlify)** | ➡️ `https://employee-attendance-system-project.netlify.app/` |
| **🔹 Backend API (Render)** | ➡️ `https://employee-attendance-system-rz8p.onrender.com/api` |

*(Note: Replace with your actual Netlify site link in the documentation.)*

---

### ✨ Key Features

This system offers distinct functionalities tailored for each user role:

#### 🧑‍💼 Employee Features

* **Secure Access:** Register / Login using **JWT Authentication**.
* **Attendance Tracking:** Effortlessly **Mark Attendance** (**Check In / Check Out**).
* **Personal Overview:** View **Monthly Summary** (Present / Absent / Late / Half-day counts).
* **Visual History:** **Full Calendar View** with intuitive **color coding**.
* **Real-time Status:** Daily status indicator (checked-in or not).
* **Detailed History:** View comprehensive attendance history.
* **Dashboard:** Personalized stats & charts powered by **Recharts**.

<img width="2879" height="909" alt="image" src="https://github.com/user-attachments/assets/4e0678de-1043-44a7-baf4-4be1c6c8821e" />

<img width="2879" height="1529" alt="image" src="https://github.com/user-attachments/assets/f3cc5e4f-8f84-4bed-967a-55496453f973" />

#### 👨‍💼 Manager Features

* **Secure Access:** Login with Manager role.
* **Team Visibility:** View **All Employees' Attendance**.
* **Powerful Filtering:** Filter data by employee, date range, and status.
* **Team Analytics:** Get **Team Summary** analytics.
* **Visualization:** **Team Calendar** using a **heatmap** view.
* **Reporting:** **Export attendance reports as CSV**.
* **Management Dashboard:** Comprehensive dashboard with charts for:
    * Weekly trend analysis.
    * Department-wise attendance breakdown.
    * List of absent / late employees for today.
    

<img width="2854" height="1606" alt="image" src="https://github.com/user-attachments/assets/179aaf96-a518-4eb8-beca-906cf69c8784" />

<img width="2879" height="806" alt="image" src="https://github.com/user-attachments/assets/8373650a-a86b-45d7-b824-bbff03ebfc3b" />

---

### 🗂️ Project Structure

A clean, modular structure separates the frontend and backend for better maintainability.

Employee_Attendance_System/ │ ├── backend/ │   ├── controllers/ # Business logic │   ├── models/ # MongoDB schemas │   ├── middleware/ # Auth/Error handlers │   ├── routes/ # API endpoints │   ├── utils/ # Utility functions │   ├── server.js # Entry point │   └── package.json │ ├── frontend/ │   ├── public/ │   │   └── _redirects # Netlify SPA routing config │   ├── src/ │   │   ├── api/ # Axios setup and service functions │   │   ├── components/ # Reusable UI components │   │   ├── pages/ # Route-level components │   │   ├── store/ # Redux Toolkit setup (slices, store) │   │   ├── styles/ # Global styles │   │   └── App.jsx │   └── package.json │ └── README.md


---

### 📡 API Endpoints

The following endpoints are secured and accessed via **JWT Authentication**:

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/auth/register` | Register user |
| | POST | `/api/auth/login` | Login user |
| | GET | `/api/auth/me` | Get authenticated user info |
| **Employee** | POST | `/api/attendance/checkin` | Mark daily check-in |
| | POST | `/api/attendance/checkout` | Mark daily check-out |
| | GET | `/api/attendance/my-history` | Full attendance history |
| | GET | `/api/attendance/my-summary` | Monthly status summary |
| | GET | `/api/attendance/today` | Today’s check-in status |
| **Manager** | GET | `/api/attendance/all` | All employees' attendance records |
| | GET | `/api/attendance/employee/:id` | Single employee's attendance |
| | GET | `/api/attendance/summary` | Team attendance statistics |
| | GET | `/api/attendance/export` | Export all data as CSV file |
| | GET | `/api/attendance/today-status` | Absent/Late list for today |
| **Dashboards** | GET | `/api/dashboard/employee` | Data for employee dashboard |
| | GET | `/api/dashboard/manager` | Data for manager dashboard |

---

### 🔐 Environment Variables

You must set up your environment variables for both the backend and frontend to run the application locally.

#### Backend (`backend/.env`)

```env
MONGO_URI=your_mongo_atlas_connection_string
JWT_SECRET=your_secret_key_for_jwt_signing
PORT=10000
Frontend (frontend/.env)
Code snippet

VITE_API_URL=[https://employee-attendance-system-rz8p.onrender.com/api](https://employee-attendance-system-rz8p.onrender.com/api) 
# Use http://localhost:10000/api for local development 
🛠️ Installation & Setup
Follow these steps to get a local copy up and running.

1️⃣ Clone the repository
Bash

git clone [https://github.com/your-username/Employee_Attendance-System.git](https://github.com/your-username/Employee_Attendance-System.git)
cd Employee_Attendance-System
2️⃣ Install and Run Backend
Ensure your backend/.env file is configured.

Bash

cd backend
npm install
npm run dev
# The API will start on http://localhost:10000
3️⃣ Install and Run Frontend
Ensure your frontend/.env file is configured to point to your backend API.

Bash

cd ../frontend
npm install
npm run dev
# The frontend will start on http://localhost:5173 (or similar)
