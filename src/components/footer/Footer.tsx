import React from "react";
import styles from "./footer.module.css";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer_container}>
                <p className={styles.footerText}>© 2024 Conversation Club | All rights reserved</p>
                <Link to="/projectCreators" className={styles.navLink}>
                Project Creators
                </Link>
                <a
                    href="https://www.ait-tr.de/"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className={styles.navLink}
                >
                    AIT-TR
                </a>
            </div>
        </footer>
    );
};
