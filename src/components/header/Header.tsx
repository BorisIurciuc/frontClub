import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser } from "../auth/features/authSlice";
import { cleanActivities } from "../auth/reduxActivities/reduxActivitiesSlice";
import { links } from "./links";
import iconImage from "./imgHeder/icon.jpg";
import styles from "./header.module.css";
import { FaHome, FaUser, FaSignOutAlt, FaUserCircle, FaBars, FaTimes, FaBook, FaSchool } from 'react-icons/fa';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((store) => store.user);
  let isAuthenticated = Boolean(user?.username);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch(logoutUser());
    dispatch(cleanActivities());
    window.location.href = "/";
    isAuthenticated = false
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <img src={iconImage} alt="Header Icon" className={styles.icon} />
        <h1 className={styles.title}>Conversation Club</h1>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ""}`}>
          {links(isAuthenticated).map((link) => (
            <Link
              key={link.pathname}
              className={`${styles.navLink} ${location.pathname === link.pathname ? styles.active : ""}`}
              to={link.pathname}
            >
              {link.title === "Home" && <FaHome className={styles.iconLink} />}
              {link.title === "Profile" && <FaUser className={styles.iconLink} />}
              {link.title === "Courses" && <FaBook className={styles.iconLink} />}
              {link.title === "School" && <FaSchool className={styles.iconLink} />}  
              <span className={styles.linkText}>{link.title}</span>
            </Link>
          ))}
          {isAuthenticated ? (
            <Link onClick={handleLogout} to="/" className={styles.signOutLink}>
              <FaSignOutAlt className={styles.iconLink} />
              <span className={styles.linkText}>Sign Out</span>
            </Link>
          ) : (
            <div className={styles.authContainer} ref={dropdownRef}>
              <div className={styles.iconWrapper} onClick={toggleDropdown}>
                <FaUserCircle className={styles.userIcon} />
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link to="/login" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
