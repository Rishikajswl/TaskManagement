import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Button } from '@mui/material';
import { auth } from '../utils/firebase'; // Ensure Firebase is initialized
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { FaTasks, FaGoogle } from 'react-icons/fa'; // Import Google icon

const Homepage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Logged in with Google:', result.user);
      navigate('/dashboard'); // Redirect to the protected route after successful login
    } catch (err: any) {
      setError(err.message || 'Failed to log in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full h-full">
        {/* Left side: Login Option */}
        <div className="flex-1 text-center p-6">
          <h1 className="text-4xl font-bold text-purple-600">
            <FaTasks className="inline-block text-4xl mr-2" />
            Task Buddy
          </h1>
          <p className="mt-4 text-m text-black-600 font-semibold">
            Streaming your workflow and track your progress effortlessly with our all-in-one task management app.
          </p>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <div className="mt-6">
            <Button
              onClick={handleLoginWithGoogle}
              variant="contained"
              color="secondary"
            //   fullWidth{false}
              className="w-1/2 bg-black text-white hover:bg-gray-800 rounded-xl"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <div
                    style={{
                      background: 'linear-gradient(150deg,rgba(234, 38, 41, 0.91) 20%,rgb(245, 190, 24) 40%, #34A853 65%,rgb(26, 106, 235) 100%)',
                      borderRadius: '50%',
                      width: '39px',
                      height: '39px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <FaGoogle style={{ color: 'white', fontSize: '28px' }} />
                  </div>
                  
                )
              }
              sx={{
                backgroundColor: 'black', // Black background
                '&:hover': {
                  backgroundColor: '#333', // Darker shade on hover
                },
              }}
            >
              {loading ? 'Logging in...' : 'Continue with Google'}
            </Button>
          </div>
        </div>

        {/* Right side: Spread Dotted Circles */}
        <div className="flex-1 flex justify-center items-center relative">
          {/* Main Circle with multiple smaller circles inside */}
          <div className="absolute w-[600px] h-[600px] border-1 border-dashed border-gray-400 rounded-full"></div>
          <div className="absolute w-[500px] h-[500px] border-1 border-dashed border-gray-400 rounded-full "></div>
          <div className="absolute w-[400px] h-[400px] border-1 border-dashed border-gray-400 rounded-full "></div>
          <div className="absolute w-[300px] h-[300px] border-1 border-dashed border-gray-400 rounded-full "></div>
          <div className="absolute w-[200px] h-[200px] border-1 border-dashed border-gray-400 rounded-full "></div>
          <div className="absolute w-[100px] h-[100px] border-1 border-dashed border-gray-400 rounded-full "></div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;




