import React, { useState, useEffect } from 'react';
import ProfilePhotoSelector from '../components/ProfilePhotoSelector';
import Input from '../components/Input';
import { validateEmail } from '../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, resetSignupSuccess } from '../features/auth/authSlice';
import { toast } from 'react-toastify';


const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [showSuccess, setShowSuccess] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, signupSuccess } = useSelector((state) => state.auth);

  // Custom Gmail validation
  const validateGmail = (email) => {
    if (!email.endsWith('@gmail.com')) {
      return { valid: false, message: 'Only Gmail addresses are allowed' };
    }
    
    const localPart = email.split('@')[0].toLowerCase();
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /^[a-z]{1,3}$/,     // Very short like "a", "ab", "abc"
      /^test\d*$/,        // test, test123
      /^fake\d*$/,        // fake, fake123
      /^temp\d*$/,        // temp, temp123
      /^demo\d*$/,        // demo, demo123
      /^\d+$/,            // Only numbers like "123"
      /^[a-z]\d+$/,       // Single letter + numbers like "a123"
      /^abc\d*$/,         // abc, abc123
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(localPart)) {
        return { valid: false, message: 'Please use a real Gmail address' };
      }
    }

    if (localPart.length < 4) {
      return { valid: false, message: 'Gmail address appears to be too short' };
    }

    return { valid: true };
  };

  useEffect(() => {
    if (signupSuccess) {
      setShowVerificationMessage(true);
      // Clear form
      setFullName('');
      setEmail('');
      setPassword('');
      setProfilePic(null);
      // Reset success after showing message
      setTimeout(() => {
        dispatch(resetSignupSuccess());
      }, 100);
    }
  }, [signupSuccess, dispatch]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Custom Gmail validation
    const gmailValidation = validateGmail(email);
    if (!gmailValidation.valid) {
      toast.error(gmailValidation.message);
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }


    dispatch(
      signupUser({
        name: fullName.trim(),
        email: email.toLowerCase().trim(),
        password,
        profilePhoto: profilePic
      })
    );
  };

  const handleResendVerification = async () => {
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
        toast.success('Verification email sent! Please check your Gmail.');
      } else {
        toast.error(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.log(error);
      toast.error('Network error. Please try again.');
    }
  };

  const goToLogin = () => {
    setShowVerificationMessage(false);
    setCurrentPage('login');
  };

  if (showVerificationMessage) {
    return (
      <div className="w-[90vw] md:w-[400px] mx-auto p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 3.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Check Your Email</h3>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to your Gmail address. Please check your email and click the verification link to activate your account.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> You must verify your email before you can log in to your account.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition duration-200"
            >
              Resend Verification Email
            </button>
            
            <button
              onClick={goToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Go to Login
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Didn't receive the email? Check your spam folder or click "Resend Verification Email"
          </p>
        </div>
      </div>
    );
  }

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

        <div>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Gmail Address"
            placeholder="yourname@gmail.com"
            type="email"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only Gmail addresses are accepted
          </p>
        </div>

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Minimum 6 characters"
          type="password"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

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