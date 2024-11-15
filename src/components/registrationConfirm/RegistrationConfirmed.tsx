import { useSearchParams } from "react-router-dom";

const RegistrationConfirmed = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  console.log("Received confirmation code:", code);

  return (
    <div>
      <h1>Registration Confirmed</h1>
      <p>Your confirmation code: {code}</p>
    </div>
  );
};

export default RegistrationConfirmed;
