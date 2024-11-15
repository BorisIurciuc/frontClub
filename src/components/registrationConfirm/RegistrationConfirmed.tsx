import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const RegistrationConfirmed = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"success" | "error" | null>(null); 
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      fetch(`/api/register?code=${code}`)
        .then((response) => {
          if (response.ok) {
            setStatus("success");
          } else {
            return response.json().then((data) => {
              throw new Error(data.message || "Confirmation failed");
            });
          }
        })
        .catch((error) => {
          console.error("Error during confirmation:", error);
          setStatus("error");
        });
    }
  }, [code]);

  if (!code) {
    return <p>Error: No confirmation code provided.</p>;
  }

  if (status === "success") {
    return (
      <div className="registration-container">
        <h2>Registration Confirmed!</h2>
        <p>Your account has been successfully activated. You can now log in.</p>
        <a href="/#/login">Go to Login</a>
      </div>
    );
  }

  if (status === "error") {
    return <p>Error: Confirmation failed. Please try again later.</p>;
  }

  return <p>Loading confirmation status...</p>;
};

export default RegistrationConfirmed;
