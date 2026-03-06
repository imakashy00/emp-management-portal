import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem("userRole")?.toLowerCase();

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/error" replace />;
    }

    return children;
};

export default ProtectedRoute