import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import { validateEmail } from '../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setCurrentPage, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (onLoginSuccess) onLoginSuccess();
      }, 1500);
    }
  }, [user, onLoginSuccess]);

  // Reset verification state when error changes
  useEffect(() => {
    if (error && error.includes('verify')) {
      setNeedsVerification(true);
    } else {
      setNeedsVerification(false);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      toast.error('Please use your Gmail address.');
      return;
    }

    if (!password) {
      toast.error('Please enter your password.');
      return;
    }

    setNeedsVerification(false);
    
    dispatch(loginUser({ 
      email: email.toLowerCase().trim(), 
      password, 
      rememberMe 
    }));
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }

    setResendingVerification(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Verification email sent! Check your Gmail.');
        setNeedsVerification(false);
      } else {
        toast.error(data.message || 'Failed to resend verification email');
      }

    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[400px] mx-auto p-8 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 mb-1">Welcome Back</h3>
      <p className="text-sm text-gray-600 mb-6">Please enter your details to log in.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Gmail Address"
            placeholder="yourname@gmail.com"
            type="email"
          />
          <p className="text-xs text-gray-500 mt-1">
            Use the same Gmail address you registered with
          </p>
        </div>

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Enter your password"
          type="password"
        />

        {/* Remember Me checkbox */}
        <div className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="cursor-pointer">Remember Me</label>
        </div>

        {/* Error Messages */}
        {error && !needsVerification && <p className="text-red-500 text-sm">{error}</p>}
        
        {/* Email Verification Alert */}
        {needsVerification && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800">Email Verification Required</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Please verify your email address before logging in. Check your Gmail for the verification link.
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendingVerification}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900 disabled:opacity-50"
                >
                  {resendingVerification ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm text-center">Login successful! Redirecting...</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || showSuccess}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-gray-700 text-center mt-3">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium"
            onClick={() => setCurrentPage('signup')}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;