import { useState } from 'react';
import Modal from '../components/Modal';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import { IoCartOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { FaHeart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleScrollToAbout = () => {
    navigate('/', { state: { scrollTo: 'about-section' } });
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-900 font-serif">
      <div className="max-w-screen-xl mx-auto px-4 py-7 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src="https://static.vecteezy.com/system/resources/previews/011/144/540/non_2x/jewelry-ring-abstract-logo-template-design-with-luxury-diamonds-or-gems-isolated-on-black-and-white-background-logo-can-be-for-jewelry-brands-and-signs-free-vector.jpg" className="h-15 rounded-full object-cover" alt="Jewelry Logo" />
          <span className="text-2xl font-semibold text-black dark:text-white">Jewellery</span>
        </Link>

        {/* Nav & Icons */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 text-lg font-medium">
            <Link to="/" className="text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition">Home</Link>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition"
            >
              Collections
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 10 6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l4 4 4-4" />
              </svg>
            </button>
            <button onClick={handleScrollToAbout} className="text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition">About</button>
          </div>

          {/* Icons */}
          {user ? (
            <>
              <Link to="/wishlist" className="text-2xl text-rose-500 hover:text-rose-600 transition">
                <FaHeart />
              </Link>
              <Link to="/cart" className="text-2xl text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-white transition">
                <IoCartOutline />
              </Link>
            </>
          ) : null}

          
          {/* User Profile or Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center focus:ring-2 focus:ring-rose-400"
              >
                {user.profilePhoto ? (
                  <img
                    src={
                      user.profilePhoto.startsWith("http")
                        ? user.profilePhoto
                        : `${BACKEND_URL}${user.profilePhoto}`
                    }
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-rose-400"
                  />
                ) : (
                  <FaUserCircle className="text-3xl text-gray-500 dark:text-gray-300" />
                )}
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-800 z-50 overflow-hidden text-sm">
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-rose-50 dark:hover:bg-gray-700">My Orders</Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-rose-50 dark:hover:bg-gray-700">My Profile</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-gray-700 dark:text-white hover:bg-rose-50 dark:hover:bg-gray-700">My Wishlist</Link>
                  {user?.isAdmin && (
                    <>
                      <Link to="/admin/dashboard" className="block px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Admin Dashboard</Link>
                      <Link to="/admin/dashboard/products" className="block px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Manage Products</Link>
                      <Link to="/admin/dashboard/orders" className="block px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700">Manage Orders</Link>
                    </>
                  )}
                  <button
                    onClick={async () => {
                      await dispatch(logoutUser());
                      setIsUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-rose-50 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setOpenAuthModal(true)}
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Login / Sign Up
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="bg-rose-50 dark:bg-gray-800 shadow-inner py-4 px-6 md:px-20 grid md:grid-cols-3 gap-4 text-sm">
          {[
            ['Bracelets', 'Charm, Cuff, Bangles','/products?category=Bracelet'],
            ['Pendants', 'Elegant, Modern, Stone-studded','/products?category=Pendant'],
            ['Earrings', 'Studs, Hoops, Drops','/products?category=Earring'],
            ['Rings', 'Solitaire, Couple, Statement','/products?category=Ring'],
            ['Necklaces', 'Chains, Chokers, Sets','/products?category=Necklace'],
            ['Anklets', 'Silver, Gold, Designer','/products?category=Anklet'],
          ].map(([title, desc, url]) => (
            <div key={title}>
              <Link to={url} className="block rounded hover:bg-white dark:hover:bg-gray-700 p-3 transition">
                <div className="font-medium text-gray-800 dark:text-white">{title}</div>
                <div className="text-gray-500 dark:text-gray-400">{desc}</div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Menu Links */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4">
          <ul className="space-y-2 text-lg font-medium">
            <li><Link to="/" className="block text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400">Home</Link></li>
            <li><Link to="#" className="block text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400">Collections</Link></li>
            <li><Link to="#" className="block text-gray-700 dark:text-white hover:text-rose-600 dark:hover:text-rose-400">Gift Sets</Link></li>
          </ul>
        </div>
      )}

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        {currentPage === "login" && (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={() => setOpenAuthModal(false)} />
        )}
        {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
      </Modal>
    </nav>
  );
};

export default Navbar;
