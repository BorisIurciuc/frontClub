import React from "react";
import styles from "./backButton.module.css";
import { FaArrowLeft } from "react-icons/fa";

const BackButton: React.FC = () => {
    return (
        <button onClick={() => window.history.back()} className={styles.backButton}>
            <FaArrowLeft className={styles.icon} />
            Back
        </button>
    );
};

export default BackButton;