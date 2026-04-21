import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-white p-8">جاري التحميل...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
