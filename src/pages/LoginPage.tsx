import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import '../styles/Auth.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login({ email, password });
            alert('Вхід успішний!');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;
                const serverMessage = err.response?.data?.message;

                if (status === 401) {
                    setError('Неправильний email або пароль');
                } else if (status === 400) {
                    setError(serverMessage || 'Невірний формат даних');
                } else if (!status) {
                    setError('Немає відповіді від сервера. Перевірте з’єднання');
                } else {
                    setError(`Помилка сервера: ${status}`);
                }
            } else {
                setError('Сталася непередбачувана помилка');
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // return (
    //     <AuthLayout>
    //         <form className="auth-form" onSubmit={handleSubmit}>
    //             <h2 className="form-title">Вхід у систему</h2>
    //             <p className="form-subtitle">З поверненням! Введіть свої дані</p>

    //             {error && <div className="auth-error-message">{error}</div>}

    //             <div className="form-group">
    //                 <label>Email</label>
    //                 <input
    //                     type="email"
    //                     className="auth-input"
    //                     placeholder="example@mail.com"
    //                     value={email}
    //                     onChange={(e) => setEmail(e.target.value)}
    //                     required
    //                 />
    //             </div>

    //             <div className="form-group">
    //                 <label>Пароль</label>
    //                 <input
    //                     type="password"
    //                     className="auth-input"
    //                     placeholder="••••••••"
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                     required
    //                 />
    //             </div>

    //             <button
    //                 type="submit"
    //                 className="auth-submit-btn"
    //                 disabled={isLoading}
    //             >
    //                 {isLoading ? 'Завантаження...' : 'Увійти'}
    //             </button>

    //             <p className="auth-switch-text">
    //                 Ще не маєте акаунту? <Link to="/register" className="auth-link">Зареєструватися</Link>
    //             </p>
    //         </form>
    //     </AuthLayout>
    // );
    return (
        <AuthLayout>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-header">
                    <h2 className="auth-title">Вхід у систему</h2>
                    <p className="auth-subtitle">З поверненням! Введіть свої дані</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <div className="auth-fild">
                    <label>Email</label>
                    <input
                        type="email"
                        className="auth-input"
                        placeholder="nastia@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="auth-fild">
                    <label>Пароль</label>
                    <input
                        type="password"
                        className="auth-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="auth-button"
                    disabled={isLoading}>
                    {isLoading ? 'Завантаження...' : 'Увійти'}
                </button>
                <div className="auth-divider">або</div>
                <p className="auth-footer">
                    Ще не маєте акаунту? <Link to="/register" className="auth-link">Зареєструватися</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;