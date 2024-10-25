import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import Loader from "../loader/Loader";
import styles from "./homePage.module.css";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { IActivity } from "../auth/reduxActivities/types";
import ScrollToTopButton from "../scrollToTopButton/ScrollToTopButton";

interface ActivityCardProps {
  activity: IActivity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => (
  <Link to={`/activityList/${activity.id}`} state={{ activity }} className={styles.activityCard}>
    <h3>{activity.title}</h3>
    <p><strong>Date:</strong> {activity.startDate}</p>
  </Link>
);

const HomePage: React.FC = () => {
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingActivities, setLoadingActivities] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      setLoadingActivities(true);
      try {
        const response = await axios.get("/api/activity");
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setError("Failed to load activities. Please try again later.");
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchActivities();
  }, []);

  const handleCreateCourse = () => navigate("/activityList/addActivity");

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className={styles.container}>
      {(isLoading || loadingActivities) && <Loader />}
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.imageContainer}>
        <motion.img
          src="/src/components/homePages/imgHomePage/decoration-retour-ecole-livres_23-2147662350.jpg"
          alt="Books and school decoration"
          className={styles.backgroundImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1 }}
        />
      </div>

      <header className={styles.header}>
        <motion.h1 className={styles.title} initial="hidden" animate="visible" variants={fadeInUp}>
          Welcome to the Conversation Club!
        </motion.h1>
        <motion.p className={styles.subtitle} initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }}>
          Learn, communicate, and grow together!
        </motion.p>
      </header>

      <motion.div className={styles.highlightSection} initial="hidden" animate="visible" variants={fadeIn}>
        <img src="/src/components/homePages/imgHomePage/langue.avif" alt="Colorful crayons" className={styles.highlightImage} />
        <div className={styles.textOverlay}>
          <h2 className={styles.sectionTitle}>Expand Your Language Skills with Ease</h2>
          <p className={styles.highlightText}>
            Whether you’re just starting or already an advanced learner, our platform offers a diverse range of language courses tailored to your proficiency level. Dive into engaging courses in English, Spanish, French, and many more!
          </p>
          <h3 className={styles.subTitle}>Why Choose Us?</h3>
          <ul className={styles.benefitsList}>
            <li><strong>Create Your Own Course:</strong> Share your knowledge and design a course that empowers others to improve their skills.</li>
            <li><strong>Flexible Learning:</strong> Learn at your own pace, fitting your studies into your busy life.</li>
            <li><strong>Community Connection:</strong> Engage with fellow learners through discussions and collaborative activities, enriching your learning experience.</li>
          </ul>
          <p className={styles.cta}>Unlock your full potential and embark on your language learning journey with the Conversation Club today!</p>
        </div>
      </motion.div>

      <motion.div className={styles.courseSection} initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.4 }}>
        <h2 className={styles.sectionTitle}>Course Selection</h2>
        <div className={styles.courseGrid}>
          <motion.button onClick={handleCreateCourse} className={styles.courseButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaPlus /> Create Course
          </motion.button>
          <motion.button onClick={() => navigate("/activityList")} className={styles.courseButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <FaEye /> View Courses
          </motion.button>
        </div>
      </motion.div>

      <motion.div className={styles.activitiesContainer} initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.6 }}>
        <h2 className={styles.sectionTitle}>Available Activities</h2>
        <div className={styles.activityGrid}>
          {activities.length === 0 ? (
            <p>No activities available at the moment.</p>
          ) : (
            activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </motion.div>
      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;
