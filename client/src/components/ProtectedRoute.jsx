import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
