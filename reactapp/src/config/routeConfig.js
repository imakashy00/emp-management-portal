import ForgotPassword from "../Components/ForgotPassword";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import LeaveForm from "../EmployeeComponents/LeaveForm";
import ViewLeave from "../EmployeeComponents/ViewLeave";
import ViewWfh from "../EmployeeComponents/ViewWfh";
import WfhForm from "../EmployeeComponents/WfhForm";
import EmployeeList from '../ManagerComponents/EmployeeList';
import LeaveRequest from '../ManagerComponents/LeaveRequest';
import WfhRequest from '../ManagerComponents/WfhRequest';
import RegisterManager from '../ManagerComponents/RegisterManager';
import Home from "../Pages/Home"; // Import Home here

export const publicRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
];

export const protectedRoutes = [
    { path: '', element: <Home />, roles: ['employee', 'manager'] }, // Empty path is the 'index'
    { path: 'apply-wfh', element: <WfhForm />, roles: ['employee'] },
    { path: 'wfh-history', element: <ViewWfh />, roles: ['employee'] },
    { path: 'apply-leave', element: <LeaveForm />, roles: ['employee'] },
    { path: 'leave-history', element: <ViewLeave />, roles: ['employee'] },
    { path: 'employees', element: <EmployeeList />, roles: ['manager'] },
    { path: 'manager/wfh', element: <WfhRequest />, roles: ['manager'] },
    { path: 'manager/leave', element: <LeaveRequest />, roles: ['manager'] },
    { path: 'invite-manager', element: <RegisterManager />, roles: ['manager'] },
];