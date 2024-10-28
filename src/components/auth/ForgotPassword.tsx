import { useState } from 'react';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/forgot-password?email=${email}`, {  // 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.ok) {
        setIsSuccess(true);
        setMessage('Password reset instructions have been sent to your email.');
      } else {
        const data = await response.text();
        setIsSuccess(false);
        setMessage(data || 'Error sending reset instructions.');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Error connecting to server.');
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        {message && (
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="auth-button">
            Send Reset Instructions
          </button>
        </form>
        <div className="auth-links">
          <a href="/#/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;