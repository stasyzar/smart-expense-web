import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import accountService from "../services/accountService";
import type { Account } from "../types/account";

// Імпорт нових компонентів
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import RecentTransactions from "../components/RecentTransactions";
import AccountsWidget from "../components/AccountsWidget";

import "../styles/DashboardPage.css";

const DashboardPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await accountService.getAccounts();
                setAccounts(data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const status = err.response?.status;
                    const message = err.response?.data?.message;
                    if (status === 401) {
                        setError("Сесія завершилася. Будь ласка, увійдіть знову.");
                    } else if (!status) {
                        setError("Немає відповіді від сервера. Перевірте з’єднання.");
                    } else {
                        setError(message || "Не вдалося завантажити список рахунків.");
                    }
                } else {
                    setError("Сталася внутрішня помилка додатку.");
                    console.error("Non-Axios error:", err);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

    if (isLoading) {
        return (
            <div className="dashboard-status-container">
                <div className="loader">Завантаження даних...</div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <Sidebar accounts={accounts} error={error} logout={logout} />

            <div className="dashboard-main">
                <TopBar title="Огляд фінансів" onAddClick={() => alert("Додавання скоро!")} />

                <div className="dashboard-content">
                    <div className="stats-row">
                        <StatCard 
                            label="Загальний баланс" 
                            value={`₴ ${totalBalance.toLocaleString('uk-UA')}`} 
                            change="↑ 12% від минулого місяця" 
                        />
                        <StatCard label="Доходи" value="₴ 42 000" type="income" change="↑ 8% від плану" />
                        <StatCard label="Витрати" value="₴ 12 450" type="expense" change="↑ 3% від минулого місяця" />
                        <StatCard label="Заощаджено" value="70%" type="savings" change="від доходу" />
                    </div>

                    <div className="charts-row">
                        <div className="card">
                            <div className="card-header"><div className="card-title">Доходи vs Витрати</div></div>
                            <div className="chart-placeholder"><span>📊 Графік тут</span></div>
                        </div>
                        <div className="card">
                            <div className="card-header"><div className="card-title">Витрати по категоріях</div></div>
                            <div className="chart-placeholder"><span>🍩 Donut тут</span></div>
                        </div>
                    </div>

                    <div className="bottom-row">
                        <RecentTransactions />
                        <AccountsWidget accounts={accounts} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;