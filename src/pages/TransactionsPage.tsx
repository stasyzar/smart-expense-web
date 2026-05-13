import { useCallback, useEffect, useReducer, useState } from "react";
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
import transactionService from "../services/transactionService";
import categoryService from "../services/categoryService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AddTransactionModal from "../components/dashboard/AddTransactionModal";
import { CATEGORY_ICONS, type Transaction } from "../types/transaction";
import { dashboardReducer, initialState } from "../reducers/dashboardReducer";
import "../styles/DashboardPage.css";
import "../styles/TransactionsPage.css";

const columnHelper = createColumnHelper<Transaction>();

const TransactionsPage = () => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState);
    const { logout } = useAuth();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
    const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

    const loadData = useCallback(async (isManual = false) => {
        if (isManual) dispatch({ type: 'FETCH_START' });
        try {
            const [accounts, transactions] = await Promise.all([
                accountService.getAccounts(),
                transactionService.getRecentTransactions(),
            ]);

            dispatch({
                type: 'FETCH_SUCCESS',
                payload: {
                    accounts: Array.isArray(accounts) ? accounts : [],
                    transactions: Array.isArray(transactions) ? transactions : [],
                    
                },
            });
        } catch (err) {
            console.error(err);
            let message = "Сталася непередбачена помилка";
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    message = err.response.data?.message || `Помилка сервера: ${err.response.status}`;
                } else if (err.request) {
                    message = "Сервер не відповідає";
                } else {
                    message = err.message;
                }
            }
            dispatch({ type: 'FETCH_ERROR', payload: message });
        }
    }, []);

    const loadCategories = useCallback(async () => {
        try {
            const data = await categoryService.getCategories();
            if (Array.isArray(data)) dispatch({ type: 'SET_CATEGORIES', payload: data });
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        loadData();
        loadCategories();
    }, [loadData, loadCategories]);

    const formatDate = (dateString: string) =>
        new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short", year: "numeric" }).format(
            new Date(dateString)
        );

    const filteredByType =
        typeFilter === "ALL"
            ? state.transactions
            : state.transactions.filter((tx) => tx.transactionType === typeFilter);

    const columns = [
        columnHelper.accessor("categoryName", {
            header: "Категорія",
            cell: (info) => (
                <div className="tx-cell-category">
                    <span className="tx-icon-sm">{CATEGORY_ICONS[info.getValue()] || "💰"}</span>
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor("description", {
            header: "Опис",
            cell: (info) => <span className="tx-cell-desc">{info.getValue() || "—"}</span>,
        }),
        columnHelper.accessor("accountName", {
            header: "Рахунок",
            cell: (info) => <span className="tx-cell-account">{info.getValue()}</span>,
        }),
        columnHelper.accessor("transactionType", {
            header: "Тип",
            cell: (info) => (
                <span className={`tx-badge ${info.getValue() === "INCOME" ? "tx-badge--income" : "tx-badge--expense"}`}>
                    {info.getValue() === "INCOME" ? "Дохід" : "Витрата"}
                </span>
            ),
        }),
        columnHelper.accessor("amount", {
            header: "Сума",
            cell: (info) => {
                const tx = info.row.original;
                return (
                    <span className={`tx-amount ${tx.transactionType === "INCOME" ? "tx-amount--income" : "tx-amount--expense"}`}>
                        {tx.transactionType === "INCOME" ? "+" : "−"}₴{" "}
                        {Math.abs(info.getValue()).toLocaleString("uk-UA")}
                    </span>
                );
            },
        }),
        columnHelper.accessor("createdAt", {
            header: "Дата",
            cell: (info) => <span className="tx-cell-date">{formatDate(info.getValue())}</span>,
        }),
    ];

    const table = useReactTable({
        data: filteredByType,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (state.isLoading) return <div className="loader">Завантаження...</div>;

    return (
        <div className="dashboard">
            <Sidebar accounts={state.accounts} error={state.error} logout={logout} />

            <div className="dashboard-main">
                <TopBar title="Транзакції" />

                <div className="dashboard-content">
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
                                    placeholder="Пошук транзакцій..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                            </div>
                            <div className="tx-type-tabs">
                                {(["ALL", "INCOME", "EXPENSE"] as const).map((t) => (
                                    <button
                                        key={t}
                                        className={`tx-type-tab ${typeFilter === t ? "active" : ""} ${t !== "ALL" ? `tx-type-tab--${t.toLowerCase()}` : ""}`}
                                        onClick={() => setTypeFilter(t)}
                                    >
                                        {t === "ALL" ? "Всі" : t === "INCOME" ? "Доходи" : "Витрати"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                <path d="M8 1v14M1 8h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                            Додати транзакцію
                        </button>
                    </div>

                    {/* Table */}
                    <div className="card tx-table-card">
                        {filteredByType.length === 0 ? (
                            <div className="tx-table-empty">Транзакцій поки немає</div>
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
                                                                    {header.column.getIsSorted() === "asc"
                                                                        ? "↑"
                                                                        : header.column.getIsSorted() === "desc"
                                                                            ? "↓"
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

                        {filteredByType.length > 0 && (
                            <div className="tx-table-footer">
                                Показано {table.getRowModel().rows.length} з {filteredByType.length} транзакцій
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                accounts={state.accounts}
                categories={state.categories}
                onSuccess={() => { setIsAddModalOpen(false); loadData(true); }}
            />
        </div>
    );
};

export default TransactionsPage;