import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import accountService from "../services/accountService";
import { useEffect, useState } from "react";
import type { Account } from "../types/account";
import '../styles/DashboardPage.css';

const DashboardPage = () => {
    const[accounts, setAccounts] = useState<Account[]>([]);
    const[isLoading, setIsLoading] = useState<boolean>(true);
    const[error, setError] = useState<string | null >(null);

    const{logout} = useAuth();

    useEffect(() => {
        const fetchAccounts = async () =>{
            try{
                setIsLoading(true);
                setError(null);

                const data = await accountService.getAccounts();
                setAccounts(data);
            } catch(err){
                if(axios.isAxiosError(err)){
                    const status = err.response?.status;
                    const message = err.response?.data?.message;

                    if(status === 401){
                        setError("Сесія завершилася. Будь ласка, увійдіть знову.");
                    }else if(!status){
                        setError("Немає відповіді від сервера. Перевірте з’єднання.");
                    }else {
                        setError(message || "Не вдалося завантажити список рахунків.");
                    }
                }else {
                    setError("Сталася внутрішня помилка додатку.");
                console.error("Non-Axios error:", err);
                }
            } finally{
                setIsLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    if(isLoading){
        return(
            <div className="dashboard-status-container">
                <div className="loader">Завантаження даних...</div>
            </div>
        );
    }

    return (
    <div className="dashboard">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                        <path d="M10 5v10M7.5 7.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3H13"
                            stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </div>
                <div>
                    <div className="sidebar-logo-text">Expense Tracker</div>
                    <div className="sidebar-logo-sub">Smart Finance</div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-label">Головне</div>
                <div className="nav-item active">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="1" y="1" width="6" height="6" rx="1.5"/>
                        <rect x="9" y="1" width="6" height="6" rx="1.5"/>
                        <rect x="1" y="9" width="6" height="6" rx="1.5"/>
                        <rect x="9" y="9" width="6" height="6" rx="1.5"/>
                    </svg>
                    Дашборд
                    {/* <span className="nav-badge">Нині</span> */}
                </div>
                <div className="nav-item">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 4h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm1-2h10a1 1 0 011 1H2a1 1 0 011-1z"/>
                    </svg>
                    Транзакції
                </div>
                <div className="nav-item">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M14 5H2a1 1 0 00-1 1v8a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1zM2 3h12V2a1 1 0 00-1-1H3a1 1 0 00-1 1v1z"/>
                    </svg>
                    Рахунки
                </div>
                <div className="nav-item">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1l1.5 4.5H14l-3.5 2.5L12 13 8 10.5 4 13l1.5-5L2 5.5h4.5z"/>
                    </svg>
                    Аналітика
                </div>
                <div className="nav-item">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="5" r="3"/>
                        <path d="M1 14c0-3.3 3.1-6 7-6s7 2.7 7 6"/>
                    </svg>
                    Категорії
                </div>
            </nav>

            {/* Рахунки в сайдбарі */}
            <div className="sidebar-accounts">
                <div className="nav-label">Мої рахунки</div>

                {error && (
                    <div className="sidebar-error">{error}</div>
                )}

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
                                {account.currency === 'UAH' && '₴'}
                                {account.currency === 'USD' && '$'}
                                {account.currency === 'EUR' && '€'}
                                {' '}{account.balance.toLocaleString('uk-UA')}
                            </div>
                            <span className={`chip-type chip-type--${account.type.toLowerCase()}`}>
                                {account.type}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Logout */}
            <button className="sidebar-logout" onClick={logout}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l4-4-4-4M14 8H6"/>
                </svg>
                Вийти
            </button>
        </aside>

        {/* ── MAIN ── */}
        <div className="dashboard-main">

            {/* Topbar */}
            <header className="dashboard-topbar">
                <div className="topbar-title">Огляд фінансів</div>
                <div className="topbar-right">
                    <div className="period-tabs">
                        <button className="period-tab">7д</button>
                        <button className="period-tab active">Місяць</button>
                        <button className="period-tab">Квартал</button>
                        <button className="period-tab">Рік</button>
                    </div>
                    <button className="btn-add">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1v14M1 8h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                        Додати
                    </button>
                </div>
            </header>

            <div className="dashboard-content">

                {/* ── Stat cards ── */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-label">Загальний баланс</div>
                        <div className="stat-value">
                            ₴ {accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString('uk-UA')}
                        </div>
                        <div className="stat-change stat-change--up">↑ 12% від минулого місяця</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label stat-label--income">Доходи</div>
                        <div className="stat-value stat-value--income">₴ 42 000</div>
                        <div className="stat-change stat-change--up">↑ 8% від плану</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label stat-label--expense">Витрати</div>
                        <div className="stat-value stat-value--expense">₴ 12 450</div>
                        <div className="stat-change stat-change--down">↑ 3% від минулого місяця</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label stat-label--savings">Заощаджено</div>
                        <div className="stat-value stat-value--savings">70%</div>
                        <div className="stat-change stat-change--up">від доходу</div>
                    </div>
                </div>

                {/* ── Charts row ── */}
                <div className="charts-row">
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Доходи vs Витрати</div>
                                <div className="card-sub">Квітень 2025</div>
                            </div>
                        </div>
                        <div className="chart-placeholder">
                            {/* Сюди підключиш Chart.js або Recharts */}
                            <span>📊 Графік тут</span>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div>
                                <div className="card-title">Витрати по категоріях</div>
                                <div className="card-sub">₴ 12 450 всього</div>
                            </div>
                        </div>
                        <div className="chart-placeholder">
                            {/* Сюди підключиш Donut chart */}
                            <span>🍩 Donut тут</span>
                        </div>
                    </div>
                </div>

                {/* ── Bottom row ── */}
                <div className="bottom-row">

                    {/* Останні транзакції */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Останні транзакції</div>
                            <div className="card-link">Всі →</div>
                        </div>
                        <div className="tx-list">
                            {/* Заглушка — замінити на реальні дані */}
                            {[
                                { icon: '🍔', name: "McDonald's", cat: '🍕 Їжа', account: 'Monobank', amount: -189, date: 'Сьогодні' },
                                { icon: '💼', name: 'Зарплата',   cat: '💼 Дохід', account: 'Monobank', amount: 42000, date: '26 квіт' },
                                { icon: '🚇', name: 'Uber',       cat: '🚗 Транспорт', account: 'Готівка', amount: -320, date: '25 квіт' },
                                { icon: '🎬', name: 'Netflix',    cat: '🎬 Розваги', account: 'Monobank', amount: -299, date: '24 квіт' },
                            ].map((tx, i) => (
                                <div className="tx-row" key={i}>
                                    <div className="tx-icon">{tx.icon}</div>
                                    <div className="tx-info">
                                        <div className="tx-name">{tx.name}</div>
                                        <div className="tx-cat">{tx.cat} • {tx.account}</div>
                                    </div>
                                    <div className="tx-right">
                                        <div className={`tx-amount ${tx.amount > 0 ? 'tx-amount--income' : 'tx-amount--expense'}`}>
                                            {tx.amount > 0 ? '+' : ''}₴ {Math.abs(tx.amount).toLocaleString('uk-UA')}
                                        </div>
                                        <div className="tx-date">{tx.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Рахунки */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Рахунки</div>
                            <div className="card-link">Керувати →</div>
                        </div>
                        <div className="accounts-list">
                            {accounts.length === 0 ? (
                                <div className="accounts-empty">Немає рахунків</div>
                            ) : (
                                accounts.map((account) => (
                                    <div className="acc-item" key={account.id}>
                                        <div className="acc-left">
                                            <div className="acc-icon">
                                                {account.type === 'CARD'    && '💳'}
                                                {account.type === 'CASH'    && '💵'}
                                                {account.type === 'SAVINGS' && '🏦'}
                                            </div>
                                            <div>
                                                <div className="acc-name">{account.name}</div>
                                                <div className="acc-type">{account.type}</div>
                                            </div>
                                        </div>
                                        <div className="acc-right">
                                            <div className="acc-balance">
                                                {account.currency === 'UAH' && '₴'}
                                                {account.currency === 'USD' && '$'}
                                                {account.currency === 'EUR' && '€'}
                                                {' '}{account.balance.toLocaleString('uk-UA')}
                                            </div>
                                            <div className="acc-currency">{account.currency}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
);
}

export default DashboardPage;