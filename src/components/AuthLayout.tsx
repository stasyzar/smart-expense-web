import React, { type ReactNode } from 'react';
import { Wallet } from "lucide-react";
import '../styles/Auth.css';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="auth-container">
      {/* ЛІВА ПАНЕЛЬ — тепер вона живе тільки тут */}
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
            <div className="auth-stat">
              <div className="auth-stat-val">UAH</div>
              <div className="auth-stat-lbl">Гривня</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-val">USD</div>
              <div className="auth-stat-lbl">Долар</div>
            </div>
            <div className="auth-stat">
              <div className="auth-stat-val">EUR</div>
              <div className="auth-stat-lbl">Євро</div>
            </div>
          </div>
        </div>
      </div>

      {/* ПРАВА ПАНЕЛЬ — сюди підставиться форма */}
      <div className="auth-right">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;