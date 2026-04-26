import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from 'axios';
import '../styles/RegisterPage.css';
import { Wallet } from "lucide-react";

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

        <div className="auth-left">
            <div className="auth-left-content">
                <div className="auth-brand">
                    <div className="auth-brand-icon">
                        <Wallet size={28} color="#3fb884" strokeWidth={2.5} />
                    </div>
                    <span className="auth-brand-name">Smart Expense Tracker</span>
                </div>
                <div className="auth-left-headline">
                    Контролюй<br />кожну <span>гривню</span>
                </div>
                <p className="auth-left-sub">
                    Повноцінний трекер витрат із аналітикою, бюджетами та мультивалютними рахунками.
                </p>
                <div className="auth-left-stats">
                    <div className="auth-stat"><div className="auth-stat-val">UAH</div><div className="auth-stat-lbl">Гривня</div></div>
                    <div className="auth-stat"><div className="auth-stat-val">USD</div><div className="auth-stat-lbl">Долар</div></div>
                    <div className="auth-stat"><div className="auth-stat-val">EUR</div><div className="auth-stat-lbl">Євро</div></div>
                </div>
            </div>
        </div>

        <div className="auth-right">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form-header">
                    <h2 className="auth-title">Створити акаунт</h2>
                    <p className="auth-subtitle">Почніть безкоштовно вже сьогодні</p>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <div className="auth-row">
                    <div className="auth-fild">
                        <label>Ім'я</label>
                        <input type="text" className="auth-input" placeholder="Анастасія" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="auth-fild">
                        <label>Прізвище</label>
                        <input type="text" className="auth-input" placeholder="Заровська" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                </div>
                <div className="auth-fild">
                    <label>Email</label>
                    <input type="email" className="auth-input" placeholder="nastia@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="auth-fild">
                    <label>Пароль</label>
                    <input type="password" className="auth-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="auth-button" disabled={isLoading}>
                    {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
                </button>
                <div className="auth-divider">або</div>
                <div className="auth-footer">Вже є акаунт? <a href="/login">Увійти</a></div>
            </form>
        </div>
    </div>
);
}

export default RegisterPage;