import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="text-white p-8">جاري التحقق...</div>;
  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
