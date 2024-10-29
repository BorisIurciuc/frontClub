import UserActivity from "../userActivity/UserActivity.tsx";
import Button from "../button/Button.tsx";
import {useNavigate} from "react-router-dom";
import styles from './dashboard.module.css'

const DashBoard = () => {
    const navigate = useNavigate();
    const handleEditProfileClick = () => {
        navigate("/editProfile");
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.edit_btn}>
                <Button name={"Edit profile"} onClick={handleEditProfileClick} />
            </div>
            <div>
                <UserActivity />
            </div>


        </div>
    );
};

export default DashBoard;
