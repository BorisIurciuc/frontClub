import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch } from "../../app/hooks";
import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./auth.module.css";
import { useState } from "react";
import Loader from "../loader/Loader";
import { loginUser } from "./features/authAction";

export interface ILoginFormValues {
  username: string;
  password: string;
}

const schema = Yup.object().shape({
  username: Yup.string()
    .required("Обязательное поле")
    .min(2, "Минимум 2 символа")
    .max(20, "Максимум 20 символов"),
  password: Yup.string()
    .required("Обязательное поле")
    .min(2, "Минимум 2 символа")
    .max(20, "Максимум 20 символов"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    } as ILoginFormValues,
    validationSchema: schema,
    onSubmit: async (values: ILoginFormValues) => {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      try {
        const response = await dispatch(
          loginUser({
            username: values.username,
            password: values.password,
          })
        ).unwrap();

        console.log('Login response:', response);
        
        localStorage.setItem('token', response.accessToken);
        
        setSuccessMessage('Login successful!'); 
        navigate('/'); 
      } catch (error) {
        const errorMsg = typeof error === "string" ? error : "Failed to login.";
        setErrorMessage(errorMsg);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <h2>Вход</h2>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={formik.handleSubmit} className={styles.container}>
          <div aria-live="polite" role="alert">
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            {successMessage && (
              <div className={styles.success}>{successMessage}</div>
            )}
          </div>
          <Input
            name="username"
            placeholder="your username"
            type="text"
            error={formik.errors.username}
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          <Input
            name="password"
            placeholder="your password"
            type="password"
            error={formik.errors.password}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <Button type="submit" name="Login" disabled={loading} />
          
            <Link to="/forgot-password" className={styles.link}>
              Forgot Password?
            </Link>
          <Link to="/register" className={styles.link}>
            Create account
          </Link>
        </form>
      )}
    </div>
  );
}
