import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch } from "../../app/hooks";
import Button from "../button/Button";
import Input from "../input/Input";
import styles from "./auth.module.css";
import { useState } from "react";
import Loader from "../loader/Loader";
import { loginUser, loginAdmin } from "../features/auth/authAction"; // Добавили экшен для логина администратора

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
        // Проверяем, является ли пользователь администратором

        // Если пользователь — обычный, используем экшен для логина пользователя
        const response = await dispatch(
          loginUser({
            username: values.username,
            password: values.password,
          })
        );
    
        setSuccessMessage("Вход прошел успешно!");
        if(loginUser.fulfilled.match(response)){
          navigate("/"); // Перенаправляем на главную
        }
      } catch (error) {
        const errorMsg =
          typeof error === "string"
            ? error
            : "Вход не удался. Попробуйте снова.";
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
            placeholder="Username"
            type="text"
            error={formik.errors.username}
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          <Input
            name="password"
            placeholder="Пароль"
            type="password"
            error={formik.errors.password}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <Button type="submit" name="Войти" disabled={loading} />
          <Link to="/register" className={styles.link}>
            Create account
          </Link>
        </form>
      )}
    </div>
  );
}
