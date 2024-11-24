import "./registrationConfirmed.css"


const RegistrationConfirmed = () => {
    return (
      <div className="registration-container">
        <h2>Registration Confirmed!</h2>
        <p>Your account has been successfully activated. You can now log in.</p>
        <a href="/#/login">Go to Login</a>
      </div>
    );
  };

export default RegistrationConfirmed;