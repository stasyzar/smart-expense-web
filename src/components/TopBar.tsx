import React from 'react';
import type { TopBarProps } from '../types/dashboard';

const TopBar = ({ title, onAddClick }: TopBarProps) => {
    return (
        <header className="dashboard-topbar">
            <div className="topbar-title">{title}</div>
            <div className="topbar-right">
                <div className="period-tabs">
                    {['7д', 'Місяць', 'Квартал', 'Рік'].map((period) => (
                        <button 
                            key={period} 
                            className={`period-tab ${period === 'Місяць' ? 'active' : ''}`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
                <button className="btn-add" onClick={onAddClick}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1v14M1 8h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    Додати
                </button>
            </div>
        </header>
    );
};

export default TopBar;