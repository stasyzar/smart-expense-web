import { Link, useLocation } from 'react-router-dom';
import type { SidebarProps } from '../types/sidebar';


const Sidebar = ({ accounts, error, logout }: SidebarProps) => {
    const location = useLocation();


    return (
        <aside className="sidebar">
            {/* Логотип */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" />
                        <path d="M10 5v10M7.5 7.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <div>
                    <div className="sidebar-logo-text">Expense Tracker</div>
                    <div className="sidebar-logo-sub">Smart Finance</div>
                </div>
            </div>

            {/* Навігація */}
            <nav className="sidebar-nav">
                <div className="nav-label">Головне</div>

                <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}><svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="1" y="1" width="6" height="6" rx="1.5" />
                    <rect x="9" y="1" width="6" height="6" rx="1.5" />
                    <rect x="1" y="9" width="6" height="6" rx="1.5" />
                    <rect x="9" y="9" width="6" height="6" rx="1.5" />
                </svg>
                    Дашборд
                </Link>

                <Link to="/transactions" className={`nav-item ${location.pathname === '/transactions' ? 'active' : ''}`}>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 4h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm1-2h10a1 1 0 011 1H2a1 1 0 011-1z" />
                    </svg>
                    Транзакції
                </Link>
            </nav>

            {/* Рахунки */}
            <div className="sidebar-accounts">
                <div className="nav-label">Мої рахунки</div>
                {error && <div className="sidebar-error">{error}</div>}
                {accounts.length === 0 && !error ? (
                    <div className="sidebar-empty">Рахунків ще немає</div>
                ) : (
                    accounts.map((account) => (
                        <div className="sidebar-account-chip" key={account.id}>
                            <div className="chip-name">
                                {account.type === 'CARD' && '💳'}
                                {account.type === 'CASH' && '💵'}
                                {account.type === 'SAVINGS' && '🏦'}
                                {' '}{account.name}
                            </div>
                            <div className="chip-balance">
                                {account.balance.toLocaleString('uk-UA')} {account.currency}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button className="sidebar-logout" onClick={logout}>
                <span>Вийти</span>
            </button>
        </aside>
    );
};

export default Sidebar;