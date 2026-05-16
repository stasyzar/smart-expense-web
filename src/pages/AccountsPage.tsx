import { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
} from "@tanstack/react-table";
import { useAuth } from "../hooks/useAuth";
import accountService from "../services/accountService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AddAccountModal from "../components/dashboard/AddAccountModal";
import type { Account } from "../types/account";
import "../styles/DashboardPage.css";
import "../styles/TransactionsPage.css";
import "../styles/Modal.css";

const CURRENCY_SYMBOL: Record<string, string> = { UAH: '₴', USD: '$', EUR: '€' };
const TYPE_LABEL: Record<string, string> = { CARD: '💳 Картка', CASH: '💵 Готівка', SAVINGS: '🏦 Заощадження' };

const columnHelper = createColumnHelper<Account>();

const AccountsPage = () => {
    const { logout } = useAuth();

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    const loadAccounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await accountService.getAccounts();
            setAccounts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            let message = "Не вдалось завантажити рахунки";
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || err.message;
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    const handleDelete = useCallback(async (id: string) => {
        if (!confirm("Видалити рахунок?")) return;
        setDeletingId(id);
        try {
            await accountService.deleteAccount(id);
            await loadAccounts();
        } catch (err) {
            console.error(err);
            alert("Помилка при видаленні рахунку");
        } finally {
            setDeletingId(null);
        }
    }, [loadAccounts]);

    const columns = useMemo(() => [
        columnHelper.accessor("type", {
            header: "Тип",
            cell: (info) => <span>{TYPE_LABEL[info.getValue()] || info.getValue()}</span>,
        }),
        columnHelper.accessor("name", {
            header: "Назва",
            cell: (info) => <span style={{ fontWeight: 500 }}>{info.getValue()}</span>,
        }),
        columnHelper.accessor("currency", {
            header: "Валюта",
            cell: (info) => <span className="tx-cell-account">{info.getValue()}</span>,
        }),
        columnHelper.accessor("balance", {
            header: "Баланс",
            cell: (info) => {
                const acc = info.row.original;
                const symbol = CURRENCY_SYMBOL[acc.currency] || '';
                const isPositive = info.getValue() >= 0;
                return (
                    <span className={`tx-amount ${isPositive ? 'tx-amount--income' : 'tx-amount--expense'}`}>
                        {symbol} {info.getValue().toLocaleString('uk-UA')}
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: "actions",
            header: "",
            cell: (info) => {
                const id = info.row.original.id;
                return (
                    <button
                        className="tx-delete-btn"
                        onClick={() => handleDelete(id)}
                        disabled={deletingId === id}
                        title="Видалити"
                    >
                        {deletingId === id ? "..." : (
                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8l1-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                );
            },
        }),
    ], [handleDelete, deletingId]);

    const table = useReactTable({
        data: accounts,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const totalBalance = useMemo(() =>
        accounts.reduce((sum, a) => sum + (a.currency === 'UAH' ? a.balance : 0), 0),
        [accounts]
    );

    if (isLoading) return <div className="loader">Завантаження...</div>;

    return (
        <div className="dashboard">
            <Sidebar accounts={accounts} error={error} logout={logout} />

            <div className="dashboard-main">
                <TopBar title="Рахунки" />

                <div className="dashboard-content">
                    {/* Summary stats */}
                    <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div className="stat-card">
                            <div className="stat-label">Всього рахунків</div>
                            <div className="stat-value">{accounts.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label stat-label--income">Загальний баланс (UAH)</div>
                            <div className="stat-value stat-value--income">₴ {totalBalance.toLocaleString('uk-UA')}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label stat-label--savings">Рахунків з нульовим балансом</div>
                            <div className="stat-value stat-value--savings">
                                {accounts.filter(a => a.balance === 0).length}
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="tx-toolbar">
                        <div className="tx-toolbar-left">
                            <div className="tx-search-wrap">
                                <svg className="tx-search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    className="tx-search"
                                    placeholder="Пошук рахунків..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                            </div>
                        </div>

                        <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                <path d="M8 1v14M1 8h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                            Додати рахунок
                        </button>
                    </div>

                    {/* Table */}
                    <div className="card tx-table-card">
                        {accounts.length === 0 ? (
                            <div className="tx-table-empty">Рахунків поки немає</div>
                        ) : (
                            <div className="tx-table-wrap">
                                <table className="tx-table">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        className={header.column.getCanSort() ? "tx-th--sortable" : ""}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        <div className="tx-th-inner">
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            {header.column.getCanSort() && (
                                                                <span className="tx-sort-icon">
                                                                    {header.column.getIsSorted() === "asc" ? "↑"
                                                                        : header.column.getIsSorted() === "desc" ? "↓"
                                                                        : "↕"}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map((row) => (
                                            <tr key={row.id} className="tx-tr">
                                                {row.getVisibleCells().map((cell) => (
                                                    <td key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {accounts.length > 0 && (
                            <div className="tx-table-footer">
                                Показано {table.getRowModel().rows.length} з {accounts.length} рахунків
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddAccountModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => { setIsAddModalOpen(false); loadAccounts(); }}
            />
        </div>
    );
};

export default AccountsPage;