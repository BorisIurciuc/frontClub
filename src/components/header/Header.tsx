import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser } from "../auth/features/authSlice";
import { cleanActivities } from "../auth/reduxActivities/reduxActivitiesSlice";
import { links } from "./links";
import iconImage from "./imgHeder/icon.jpg";
import styles from "./header.module.css";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaBook,
  FaSchool,
  FaComments,
  FaNewspaper,
  FaEdit,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit } from "@fortawesome/free-solid-svg-icons";

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((store) => store.user);
  const isAuthenticated = Boolean(user?.username);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (user?.roles?.includes("ROLE_ADMIN")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    dispatch(logoutUser());
    dispatch(cleanActivities());
    window.location.href = "/";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element; 
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
      if (mobileMenuOpen && !target.closest(`.${styles.navLinks}`)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]); 

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <img
          src={iconImage}
          alt="Header Icon"
          className={styles.icon}
          onClick={() => (window.location.href = "/")} 
        />
        <h1 className={styles.title} onClick={() => (window.location.href = "/")}> 
          Conversation Club
        </h1>
      </div>
      <nav className={styles.navbar}>
        <div className={styles.mobileMenuToggle} onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div
          className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ""}`}
        >
          {links(isAuthenticated, isAdmin).map((link) => (
            <Link
              key={link.pathname}
              className={`${styles.navLink} ${
                location.pathname === link.pathname ? styles.active : ""
              }`}
              to={link.pathname}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.title === "Home" && <FaHome className={styles.iconLink} />}
              {link.title === "Profile" && <FaUser className={styles.iconLink} />}
              {link.title === "Courses" && <FaBook className={styles.iconLink} />}
              {link.title === "School" && <FaSchool className={styles.iconLink} />}
              {link.title === "News" && <FaNewspaper className={styles.iconLink} />}
              {link.title === "Review" && <FaComments className={styles.iconLink} />}
              {link.title === "Dashboard" && <FaEdit className={styles.iconLink} />}

              <span className={styles.linkText}>{link.title}</span>
            </Link>
          ))}
          {isAuthenticated && (
            <div className={styles.authContainer} ref={dropdownRef}>
              <div className={styles.iconWrapper} onClick={toggleDropdown}>
                <FaUserCircle className={styles.userIcon} />
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link 
                    to="/editProfile" 
                    className={styles.dropdownItem} 
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faUserEdit} className={styles.iconLink} />
                    <span className={styles.linkText}>Edit Profile</span>
                  </Link>
                  <Link 
                    to="/" 
                    className={styles.dropdownItem} 
                    onClick={(event) => {
                      handleLogout(event);
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FaSignOutAlt className={styles.iconLink} />
                    <span className={styles.linkText}>Sign Out</span>
                  </Link>
                </div>
              )}
            </div>
          )}
          {!isAuthenticated && (
            <div className={styles.authContainer} ref={dropdownRef}>
              <div className={styles.iconWrapper} onClick={toggleDropdown}>
                <FaUserCircle className={styles.userIcon} />
              </div>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link 
                    to="/login" 
                    className={styles.dropdownItem}
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className={styles.dropdownItem}
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Registration
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
