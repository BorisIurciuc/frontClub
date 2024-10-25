import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAppDispatch } from '../../app/hooks';
import Button from '../button/Button';
import Input from '../input/Input';
import { registerUser } from '../features/auth/authAction';
import styles from './auth.module.css';
import { useState } from 'react';
import Loader from '../loader/Loader';
import axios from 'axios';

export interface IRegisterFormValues  {
  username: string;
  password: string;
  email: string;
}

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Обязательное поле')
    .min(2, 'Минимум 2 символа')
    .max(20, 'Максимум 20 символов'),
  email: Yup.string()
    .required('Обязательное поле')
    .email('Неверный формат email'),
  password: Yup.string()
    .required('Обязательное поле')
    .min(2, 'Минимум 2 символа')
    .max(20, 'Максимум 20 символов'),
});

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
    } as IRegisterFormValues ,
    validationSchema: schema,
    validateOnChange: false,
    onSubmit: async (values: IRegisterFormValues , { resetForm }) => {
      setLoading(true); 
      
      try {
        await dispatch(registerUser({
          username: values.username,
          password: values.password,
          email: values.email,
        })).unwrap();
        
        setSuccessMessage(
          "Регистрация прошла успешно! Проверьте вашу почту для подтверждения."
        );
        resetForm();

        setTimeout(() => {
          navigate("/");
        }, 5000);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message =
            error.response?.data?.message ||
            "Ошибка регистрации. Попробуйте снова.";
          setErrorMessage(message);
        } else {
          setErrorMessage("Произошла неизвестная ошибка.");
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section>
      <h2>Создать аккаунт</h2>
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={formik.handleSubmit} className={styles.container}>
          <div aria-live="polite" role="alert">
            {errorMessage && <div className={styles.error}>{errorMessage}</div>}
            {successMessage && <div className={styles.success}>{successMessage}</div>}
          </div>
          <Input
            name='username'
            placeholder='Имя пользователя'
            type='text'
            error={formik.errors.username}
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          <Input
            name='email'
            placeholder='Email'
            type='email'
            error={formik.errors.email}
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <Input
            name='password'
            placeholder='Пароль'
            type='password'
            error={formik.errors.password}
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <Button type='submit' name='Зарегистрироваться' disabled={loading} />
          <Link to='/login' className={styles.link}>Sing In</Link>
        </form>
      )}
    </section>
  );
}
