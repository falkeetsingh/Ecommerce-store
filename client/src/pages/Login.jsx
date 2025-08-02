import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import { validateEmail } from '../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';

const Login = ({ setCurrentPage, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setLocalError('Please enter a valid password.');
      return;
    }

    setLocalError('');
    dispatch(loginUser({ email, password, rememberMe }));
  };

  return (
    <div className="w-[90vw] md:w-[400px] mx-auto p-8 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 mb-1">Welcome Back</h3>
      <p className="text-sm text-gray-600 mb-6">Please enter your details to log in.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="hello@example.com"
          type="email"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
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

        {localError && <p className="text-red-500 text-sm">{localError}</p>}
        {showSuccess && <p className="text-green-500 text-sm">Login successful!</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          disabled={loading}
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
