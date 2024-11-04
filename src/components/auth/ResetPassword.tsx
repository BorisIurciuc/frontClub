import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the token from URL
    const searchParams = new URLSearchParams(location.search);
    const tokenParam = searchParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      validateToken(tokenParam);
    } else {
      setMessage('Invalid reset link');
      setIsLoading(false);
    }
  }, [location]);

  // Token validation function
  const validateToken = async (tokenParam) => {
    try {
      const response = await fetch(`http://localhost:8080/api/validate-reset-token?token=${tokenParam}`);
      if (response.ok) {
        setIsValid(true);
        setIsLoading(false);
      } else {
        setMessage('This reset link is invalid or has expired.');
        setIsValid(false);
        setIsLoading(false);
      }
    } catch (error) {
      setMessage('Error validating reset link.');
      setIsValid(false);
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `token=${token}&newPassword=${password}`,
      });

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Password successfully reset! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000); 
      } else {
        const data = await response.text();
        setIsSuccess(false);
        setMessage(data || 'Error resetting password');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Error connecting to server');
    }
  };

  // Render loading state
  if (isLoading) {
    return <div className="auth-container">Loading...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        {message && (
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        {isValid && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="form-control"
              />
            </div>
            
            <button type="submit" className="auth-button">
              Reset Password
            </button>
          </form>
        )}
        
        <div className="auth-links">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
