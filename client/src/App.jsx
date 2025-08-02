import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import AppRoutes from "./routes/AppRoutes"
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Navbar />
        <div className="flex-grow">
          <AppRoutes />
        </div>
        <Footer />
    </div>
  );
}

export default App
