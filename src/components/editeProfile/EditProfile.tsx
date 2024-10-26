import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState({
        username: '',
        email: '',
        id: ''
    });
    const [initialUsername, setInitialUsername] = useState('');
    const navigate = useNavigate();

    // Проверка наличия токена при загрузке компонента
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAccessToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    // Функция для получения данных пользователя
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

                if (!response.ok) {
                    throw new Error('Не удалось получить данные пользователя');
                }

                const data = await response.json();
                setUser(data);
                setInitialUsername(data.username);
            } catch (error) {
                console.error('Ошибка при загрузке данных пользователя:', error);
                alert('Ошибка при загрузке данных пользователя. Пожалуйста, попробуйте позже.');
            }
        };

        if (accessToken) {
            fetchUserData();
        }
    }, [accessToken]);

    // Обработчик изменения полей формы
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Обработчик отправки формы для обновления данных
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!accessToken || !user.id) {
            alert('Не удалось обновить данные. Токен или ID пользователя отсутствуют.');
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
                throw new Error('Не удалось обновить данные пользователя');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            alert('Данные успешно обновлены!');

            // Если имя пользователя изменилось, сбрасываем токен, выходим из учетной записи и перенаправляем на страницу логина
            if (updatedUser.username !== initialUsername) {
                alert('Имя пользователя изменилось. Пожалуйста, войдите снова.');
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                navigate('/login');
            }
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя:', error);
            alert('Ошибка при обновлении данных. Пожалуйста, попробуйте позже.');
        }
    };

    // Функция выхода из системы
    const handleLogout = async () => {
        try {
            const response = await fetch(`/api/auth/logout`, {
                method: 'DELETE', // Используем DELETE, как указано на сервере
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser({ username: '', email: '', id: '' });

                // Генерируем уникальный ключ
                const uniqueKey = Date.now().toString();
                navigate(`/login?key=${uniqueKey}`);
            } else {
                console.error("Logout failed:", response.statusText);
                alert("Не удалось выйти из системы. Пожалуйста, попробуйте позже.");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
            alert("Ошибка при выходе из системы. Пожалуйста, попробуйте позже.");
        }
    };

    // Если пользователь не авторизован, отображаем сообщение
    if (!isAuthenticated) {
        return <div>Пожалуйста, войдите в систему для просмотра профиля.</div>;
    }

    // Отображение формы для редактирования профиля
    return (
        <div>
            <h2>Мой профиль</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Имя пользователя:</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" onClick={handleLogout}>Сохранить изменения</button>
            </form>
        </div>
    );
}

export default EditProfile;
