import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AuthRedirect = () => {
  const [message, setMessage] = useState('Authenticating...');
  const navigate = useNavigate();
  const { loading } = useAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Get auth token from URL parameters
        const params = new URLSearchParams(window.location.search);
        const authToken = params.get('auth_token');
        
        if (!authToken) {
          setMessage('Authentication failed. No token provided.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        // Store the token
        localStorage.setItem('doit-token', authToken);
        
        // Clean URL by removing token
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect to dashboard after a short delay
        setMessage('Authentication successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1000);
        
      } catch (error) {
        console.error('Error during auth redirect:', error);
        setMessage('Authentication failed. Please try logging in again.');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    if (!loading) {
      handleRedirect();
    }
  }, [loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-doit-500/90 to-doit-200/80">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="animate-pulse mb-4">
          <div className="h-12 w-12 mx-auto rounded-full bg-doit-500/50"></div>
        </div>
        <h1 className="text-2xl font-bold mb-2">DO!T Authentication</h1>
        <p className="text-gray-600 mb-4">{message}</p>
        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
          <div className="bg-doit-500 h-1 rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthRedirect;
