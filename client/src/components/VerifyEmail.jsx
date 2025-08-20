import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const hasVerified = useRef(false); // Prevent double verification

  useEffect(() => {
    // Prevent multiple calls in React StrictMode
    if (hasVerified.current) return;
    
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }
    
    const verifyEmail = async () => {
      // Double-check to prevent race conditions
      if (hasVerified.current) return;
      hasVerified.current = true;
      
      try {
        // Use your actual backend URL
        const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Start countdown for redirect
          let timeLeft = 5;
          const timer = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            
            if (timeLeft <= 0) {
              clearInterval(timer);
              navigate('/login', { replace: true });
            }
          }, 1000);
          
          // Cleanup timer on unmount
          return () => clearInterval(timer);
        } else {
          setStatus('error');
          
          // Handle specific error cases
          if (data.message?.includes('expired')) {
            setMessage('Your verification link has expired. Please request a new verification email.');
          } else if (data.message?.includes('already verified')) {
            setMessage('Your email is already verified. You can log in now.');
          } else {
            setMessage(data.message || 'Verification failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      }
    };
    
    // Small delay to show loading state
    const timeoutId = setTimeout(verifyEmail, 500);
    
    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array

  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  const handleGoToSignup = () => {
    navigate('/signup', { replace: true });
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-[90vw] md:w-[400px] mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verifying Your Email</h2>
          <p className="text-gray-600">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-[90vw] md:w-[400px] mx-auto p-8 bg-white rounded-lg shadow-md text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-green-800 mb-2">Email Verified!</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              Your account is now active. You can log in to start using our services.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Go to Login {countdown > 0 && `(${countdown}s)`}
            </button>
          </div>

          {countdown > 0 && (
            <p className="text-xs text-gray-500 mt-4">
              Automatically redirecting to login in {countdown} seconds...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[90vw] md:w-[400px] mx-auto p-8 bg-white rounded-lg shadow-md text-center">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-red-800 mb-2">Verification Failed</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-medium text-red-800 mb-2">What can you do?</h4>
          <ul className="text-sm text-red-700 text-left space-y-1">
            <li>• Check if you clicked the correct link from your email</li>
            <li>• The verification link may have expired (24 hours)</li>
            <li>• Try signing up again to get a new verification email</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoToSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Sign Up Again
          </button>
          
          <button
            onClick={handleGoToLogin}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition duration-200"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;