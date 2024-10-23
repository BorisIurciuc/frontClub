import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import Loader from "../loader/Loader";
import styles from "./homePage.module.css";
import { useNavigate } from "react-router-dom";
import { FaBook, FaEye, FaGift, FaPlus, FaVideo } from "react-icons/fa";

export default function HomePage() {
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const [showLoader, setShowLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setShowLoader(true);
    if (isLoading) {
      const timer = setTimeout(() => setShowLoader(false), 100);
      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [isLoading]);

  const handleCreateCourse = () => {
    navigate("/activityList/addActivity");
  };

  return (
    <div className={styles.container}>
      {showLoader && <Loader />}
      
      {/* Добавляем изображение фона */}
      <div className={styles.imageContainer}>
        <img
          src="/src/components/homePages/imgHomePage/decoration-retour-ecole-livres_23-2147662350.jpg"
          alt="Books and school decoration"
          className={styles.backgroundImage}
        />
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to the Conversation Club!</h1>
        <p className={styles.subtitle}>
          Learn, communicate, and grow together!
        </p>
      </header>

      <div className={styles.highlightSection}>
        <img
          src="/src/components/homePages/imgHomePage/crayons.jpg"
          alt="Colorful crayons"
          className={styles.highlightImage}
        />
        <div className={styles.textOverlay}>
          <h2 className={styles.sectionTitle}>
            Expand Your Language Skills with Ease
          </h2>
          <p className={styles.highlightText}>
            Whether you're a beginner or an advanced learner, our platform
            provides a variety of language courses tailored to your level.
            Explore courses in English, Spanish, French, and many more! Want to
            share your knowledge? You can also create your own language course
            and help others improve their skills. Learn at your own pace,
            communicate with fellow learners, and unlock your full potential
            with Conversation Club!
          </p>
        </div>
      </div>

      <div className={styles.courseSection}>
        <h2 className={styles.sectionTitle}>Course Selection</h2>
        <div className={styles.courseGrid}>
          <button onClick={handleCreateCourse} className={styles.courseButton}>
            <FaPlus /> Create Course
          </button>
          <button
            onClick={() => navigate("/activityList")}
            className={styles.courseButton}
          >
            <FaEye /> View Courses
          </button>
        </div>
      </div>

      <div className={styles.newsContainer}>
        <h2 className={styles.sectionTitle}>App News</h2>
        <div className={styles.newsGrid}>
          <div className={styles.newsItem}>
            <FaBook /> New English courses have been added!
          </div>
          <div className={styles.newsItem}>
            <FaVideo /> A new video call feature is coming soon!
          </div>
          <div className={styles.newsItem}>
            <FaGift /> Don't miss our subscription promotion!
          </div>
        </div>
      </div>
    </div>
  );
}
