import React, { useState } from "react";
import axios from 'axios';
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import '../styles/Auth.css';
import { Link } from 'react-router-dom';

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
        const status = err.response?.status;
        const serverMessage = err.response?.data?.message;

        if (status === 409) {
          setError('Користувач з таким email вже існує');
        } else if (status === 400) {
          setError(serverMessage || 'Перевірте правильність заповнення полів');
        } else if (!status) {
          setError('Немає зв’язку з сервером. Перевірте інтернет');
        } else {
          setError(`Сталася помилка на сервері (Код: ${status})`);
        }
      } else {
        setError('Сталася непередбачувана помилка у додатку');
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-header">
          <h2 className="auth-title">Створити акаунт</h2>
          <p className="auth-subtitle">Почніть безкоштовно вже сьогодні</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-row">
          <div className="auth-fild">
            <label>Ім'я</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="Анастасія" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
            />
          </div>
          <div className="auth-fild">
            <label>Прізвище</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="Заровська" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
            />
          </div>
        </div>

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

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
        </button>

        <div className="auth-divider">або</div>
        <div className="auth-footer">Вже є акаунт? <Link to="/login">Увійти</Link></div>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;