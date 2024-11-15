import { useSearchParams } from "react-router-dom";

const RegistrationConfirmed = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
// useEffect(()=>{
//   fetch("")
// },[])
  console.log("Confirmation code:", code);

  if (!code) {
    return <p>Error: No confirmation code provided.</p>;
  }

  return (
    <div className="registration-container">
      <h2>Registration Confirmed!</h2>
      <p>Your account has been successfully activated. You can now log in.</p>
      <a href="/#/login">Go to Login</a>
    </div>
  );
};

export default RegistrationConfirmed;
