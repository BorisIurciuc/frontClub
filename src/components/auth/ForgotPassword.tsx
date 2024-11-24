import { useState } from 'react';
import styles from './forgotPassword.module.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/forgot-password?email=${email}`, { 
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
    <div className={styles.authContainer}>
      <div className={styles.authBox}>
        <h2>Reset Password</h2>
        {message && (
          <div className={`${styles.message} ${isSuccess ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.inputControl}
            />
          </div>
          <button type="submit" className={styles.authButton}>
            Send Reset Instructions
          </button>
        </form>
        <div className={styles.authLinks}>
          <a href="/#/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
