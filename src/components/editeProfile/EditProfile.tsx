import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './editProfile.module.css';

function EditProfile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState({
        username: '',
        email: '',
        id: ''
    });
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAccessToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!accessToken) return;

            try {
                const response = await fetch(`/api/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch user data');

                const data = await response.json();
                setUser(data);
            } catch (error: unknown) {
                console.error('Error loading user data:', error);
                setMessage('Error loading user data.'); 
            }
        };

        fetchUserData();
    }, [accessToken]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!accessToken || !user.id) {
            console.error('Failed to update data. Token or user ID is missing.');
            setMessage('Error: failed to update data.'); 
            return;
        }
        if (!user.username.trim() || !user.email.trim()) {
            setMessage('Please fill out all fields.'); 
            return;
        }

        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user data');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setMessage('Data successfully updated!'); 

            if (updatedUser.username !== user.username) {
                alert('Username has changed. Please log in again.');
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                navigate('/login');
            }
        } catch (error: unknown) {
            console.error('Error updating user data:', error);
            if (error instanceof Error) {
                setMessage(`Error updating data: ${error.message}`); 
            } else {
                setMessage('Unknown error while updating data.'); 
            }
        }
    };

    if (!isAuthenticated) {
        return <div>Please log in to view your profile.</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Edit Profile</h2>
            {message && <div className={styles.message}>{message}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <input
                        placeholder='Username'
                        type="text"
                        name="username"
                        value={user.username} 
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <input
                        placeholder='Email'
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>Save Changes</button>
            </form>
        </div>
    );
}

export default EditProfile;
