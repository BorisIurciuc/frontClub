import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAppDispatch } from "../../app/hooks";
import { useState, useEffect } from "react";
import { addActivity } from "../reduxActivities/reduxActivitiesAction";
import style from "./formAddActivities.module.css";
import axios from "axios";

interface AddActivityFormProps {
  onSuccess: () => void;
}

const AddActivityForm: React.FC<AddActivityFormProps> = ({ onSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [image, setImageUrl] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      address: "",
      startDate: "",
      description: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .required("Title is required")
        .min(2, "Minimum 2 characters"),
      address: Yup.string().required("Address is required"),
      startDate: Yup.string().required("Date is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const resultActivity = await dispatch(
          addActivity({
            title: values.title,
            address: values.address,
            startDate: values.startDate,
            description: values.description,
            image: image,
          })
        ).unwrap();

        const { id } = resultActivity;

        setTimeout(() => {
          navigate(`/activityList/${id}`, {
            state: { activity: resultActivity },
          });
        }, 2000);

        onSuccess();
        formik.resetForm();
        setImageUrl("");
        setSuccessMessage("The event has been successfully added!");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message ||
              "Failed to add the event. Please try again."
          );
        } else {
          setSuccessMessage("The event has been successfully added!");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  if (!isAuthenticated) {
    return (
      <div className={style.formContainer}>
        <p className={style.errorMessage}>Please log in to add an event.</p>
        <button onClick={handleLoginRedirect} className={style.loginButton}>
          Sing In
        </button>
      </div>
    );
  }

  return (
    <div className={style.formContainer}>
      <h2 className={style.heading}>Add a new event</h2>
      {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}
      {successMessage && (
        <p className={style.successMessage}>{successMessage}</p>
      )}
      <form onSubmit={formik.handleSubmit} className={style.form}>
        <input
          type="text"
          placeholder="Название"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.errors.title && formik.touched.title && (
          <p className={style.errorText}>{formik.errors.title}</p>
        )}

        <input
          type="text"
          placeholder="Адрес"
          name="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.errors.address && formik.touched.address && (
          <p className={style.errorText}>{formik.errors.address}</p>
        )}

        <input
          type="date"
          name="startDate"
          value={formik.values.startDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.errors.startDate && formik.touched.startDate && (
          <p className={style.errorText}>{formik.errors.startDate}</p>
        )}

        <input
          type="text"
          placeholder="URL изображения"
          value={image}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {image && (
          <div className={style.imagePreview}>
            <img src={image} alt="Activity" className={style.activityImage} />
          </div>
        )}

        <textarea
          placeholder="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.errors.description && formik.touched.description && (
          <p className={style.errorText}>{formik.errors.description}</p>
        )}

        <button type="submit" className={style.submitButton} disabled={loading}>
          {loading ? "Loading..." : "Add activity"}
        </button>
      </form>
    </div>
  );
};

export default AddActivityForm;
