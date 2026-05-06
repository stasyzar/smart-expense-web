import React, { useCallback, useEffect, useReducer } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import accountService from "../services/accountService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import RecentTransactions from "../components/RecentTransactions";
import AccountsWidget from "../components/AccountsWidget";

import "../styles/DashboardPage.css";

import { dashboardReducer, initialState } from "../reducers/dashboardReducer";
import AddAccountModal from "../components/dashboard/AddAccountModal";

const DashboardPage = () => {
   const [state, dispatch] = useReducer(dashboardReducer, initialState);
   const {logout} = useAuth();

   const loadData = useCallback(async (isManual = false) => {
    if (isManual) dispatch({ type: 'FETCH_START' });
    try {
        const data = await accountService.getAccounts();
        
        if (Array.isArray(data)) {
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } else {
            console.error("Очікувався масив, але прийшло:", data);
            dispatch({ type: 'FETCH_ERROR', payload: "Неправильний формат даних від сервера" });
        }
    } catch (err) {
        console.error("Повна помилка запиту:", err);

        let message = "Сталася непередбачена помилка";
        
        if (axios.isAxiosError(err)) {
            if (err.response) {
                message = err.response.data?.message || `Помилка сервера: ${err.response.status}`;
            } 
            else if (err.request) {
                message = "Сервер не відповідає. Перевірте, чи запущено бекенд на порті 8080";
            } 
            else {
                message = err.message;
            }
        }
        
        dispatch({ type: 'FETCH_ERROR', payload: message }); //
    }
}, []);

   useEffect(() => {
        loadData();
    }, [loadData]);

    const totalBalance = state.accounts.reduce((sum, a) => sum + a.balance, 0);

    if (state.isLoading) return <div className="loader">Завантаження...</div>;

    return (
        <div className="dashboard">
            <Sidebar accounts={state.accounts} error={state.error} logout={logout} />

            <div className="dashboard-main">
                <TopBar 
                    title="Огляд фінансів" 
                    onAddClick={() => dispatch({ type: 'TOGGLE_MODAL', payload: true })} 
                />

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
                        <AccountsWidget accounts={state.accounts} />
                    </div>
                </div>
            </div>

            <AddAccountModal
            isOpen = {state.isModalOpen}
            onClose={() => dispatch({type: 'TOGGLE_MODAL', payload: false})}
            onSuccess={() => loadData(true)}
            />
        </div>
    );
};

export default DashboardPage;