import React, { useState, useEffect } from 'react';
import ProfilePhotoSelector from '../components/ProfilePhotoSelector';
import Input from '../components/Input';
import { validateEmail } from '../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, resetSignupSuccess } from '../features/auth/authSlice';


const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, signupSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (signupSuccess) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentPage('login');
        dispatch(resetSignupSuccess());
      }, 1500);
    }
  }, [signupSuccess, setCurrentPage, dispatch]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName) {
      setLocalError('Please enter full name.');
      return;
    }

    if (!validateEmail(email)) {
      setLocalError('Please enter a valid email.');
      return;
    }

    if (!password) {
      setLocalError('Please enter the password.');
      return;
    }

    setLocalError('');

    dispatch(
      signupUser({
        name: fullName,
        email,
        password,
        profilePhoto: profilePic
      })
    );

    
  };

  return (
    <div className="w-[90vw] md:w-[400px] mx-auto p-8 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-gray-800 mb-1">Create an Account</h3>
      <p className="text-sm text-gray-600 mb-6">Join us today by entering your details below.</p>

      <form onSubmit={handleSignUp} className="space-y-4">
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          placeholder="Your name"
          type="text"
        />

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
          placeholder="Minimum 8 characters"
          type="password"
        />

        {localError && <p className="text-red-500 text-sm">{localError}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {showSuccess && (
          <p className="text-green-600 text-sm text-center">
            Account created successfully! Redirecting to login...
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          disabled={loading || showSuccess}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {localError && <p className="text-red-500 text-sm">{localError}</p>}

        <p className="text-sm text-gray-700 text-center mt-3">
          Already have an account?{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium"
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
