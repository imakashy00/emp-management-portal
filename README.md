# Employee Management Portal

Employee Management Portal is a full-stack web app for managing employee workflows such as authentication, profile management, leave requests, and work-from-home (WFH) requests.

## What this project does

- Supports employee and manager roles with protected access.
- Lets employees apply for leave and WFH, then track request history.
- Lets managers review employee lists, approve/reject leave and WFH requests, and invite managers.
- Provides dashboard statistics for managers and employees.

## Tech stack

### Frontend (`/reactapp`)
- React 18
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS
- React Toastify

### Backend (`/nodeapp`)
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer (file uploads)
- Swagger UI (API docs)

## Setup

### Prerequisites
- Node.js and npm
- MongoDB (local or hosted)

### 1) Clone and install dependencies

```bash
git clone https://github.com/imakashy00/emp-management-portal.git
cd emp-management-portal

cd nodeapp && npm install
cd ../reactapp && npm install
```

### 2) Configure backend environment

Create `nodeapp/.env` with:

```env
port=8080
MONGODB_URI=mongodb://127.0.0.1:27017/workbuddy
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_email@example.com
GMAIL_APP_PASSWORD=your_app_password
backend_uri=http://localhost:8080
```

### 3) Run the apps

In one terminal:

```bash
cd nodeapp
npm start
```

In another terminal:

```bash
cd reactapp
npm start
```

Frontend runs on `http://localhost:8081` and backend runs on `http://localhost:8080`.

Swagger API docs: `http://localhost:8080/api-docs`

## Features

- Authentication: signup, login, forgot/reset password
- Role-based access for employees and managers
- Profile view and update
- Employee leave request workflow (apply, edit, delete, history)
- Employee WFH request workflow (apply, edit, delete, history)
- Manager review workflows for leave and WFH status updates
- Manager employee directory and dashboard insights
