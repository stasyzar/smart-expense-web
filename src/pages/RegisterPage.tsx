import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from 'axios';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await register({ email, password, firstName, lastName });
            alert('Реєстрація успішна!');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 409) {
                    setError('Користувач з таким email вже існує');
                } else {
                    setError('Помилка сервера. Спробуйте пізніше.');
                }
            } else {
                setError('Сталася непередбачувана помилка.');
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Створити акаунт</h2>
                {error && <div className="auth-error">{error}</div>}

                <div className="auth-fild">
                    <label>Ім'я</label>
                    <input type="text" className="auth-input" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} required></input>
                </div>

                <div className="auth-fild">
                    <label>Прізвище</label>
                    <input type="text" className="auth-input" value={lastName}
                        onChange={(e) => setLastName(e.target.value)} required></input>
                </div>

                <div className="auth-fild">
                    <label>Email</label>
                    <input type="email" className="auth-input" value={email}
                        onChange={(e) => setEmail(e.target.value)} required></input>
                </div>

                <div className="auth-fild">
                    <label>Пароль</label>
                    <input type="password" className="auth-input" value={password}
                        onChange={(e) => setPassword(e.target.value)} required></input>
                </div>

                <button
                    type="submit"
                    className="auth-button"
                    disabled={isLoading}>
                    {isLoading ? 'Реєстрація...' : 'Зареєструватися'}</button>
            </form>
        </div>
    )
}

export default RegisterPage;