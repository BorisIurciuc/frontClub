import UserActivity from "../userActivity/UserActivity.tsx";
import styles from "./dashboard.module.css";

const DashBoard = () => {
    return (
    <div className={styles.dashboard}>
        <div className={styles.edit_btn}></div>
            <div>
            <UserActivity />
            </div>
    </div>
    );
};

export default DashBoard;
