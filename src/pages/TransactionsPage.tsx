import { useCallback, useEffect, useReducer, useMemo, useState } from "react";
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
import { CATEGORY_ICONS, type Transaction, normalizeTransaction, enrichTransactions } from "../types/transaction";
import { dashboardReducer, initialState } from "../reducers/dashboardReducer";
import "../styles/DashboardPage.css";
import "../styles/TransactionsPage.css";
import "../styles/Modal.css";

const columnHelper = createColumnHelper<Transaction>();

const TransactionsPage = () => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState);
    const { logout } = useAuth();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
    const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

    const loadData = useCallback(async (isManual = false) => {
        if (isManual) dispatch({ type: 'FETCH_START' });
        try {
            const [accounts, rawTransactions, categories] = await Promise.all([
                accountService.getAccounts(),
                transactionService.getRecentTransactions(),
                categoryService.getCategories(),
            ]);

            const normalizedAccounts = Array.isArray(accounts) ? accounts : [];
            const normalizedCategories = Array.isArray(categories) ? categories : [];
            const transactions = enrichTransactions(
                (Array.isArray(rawTransactions) ? rawTransactions : []).map(normalizeTransaction),
                normalizedAccounts,
                normalizedCategories,
            );

            dispatch({
                type: 'FETCH_SUCCESS',
                payload: {
                    accounts: normalizedAccounts,
                    transactions,
                    categories: normalizedCategories,
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

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = useCallback(async (id: number) => {
        if (!confirm("Видалити транзакцію?")) return;
        setDeletingId(id);
        try {
            await transactionService.deleteTransaction(id);
            await loadData(true);
        } catch (err) {
            console.error(err);
            alert("Помилка при видаленні транзакції");
        } finally {
            setDeletingId(null);
        }
    }, [loadData]);

    const formatDate = (dateString: string) =>
        new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short", year: "numeric" }).format(
            new Date(dateString)
        );

    const filteredByType = useMemo(() =>
        typeFilter === "ALL"
            ? state.transactions
            : state.transactions.filter((tx) => tx.transactionType === typeFilter),
        [state.transactions, typeFilter]
    );

    const columns = useMemo(() => [
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
                            // <span className="material-icons" style={{ background: "transparent" }}>
                            //     delete
                            // </span>
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

                    <div className="card tx-table-card">
                        {filteredByType.length === 0 ? (
                            <div className="tx-table-empty">
                                {typeFilter === "ALL"
                                    ? "Транзакцій поки немає"
                                    : `Немає транзакцій «${typeFilter === "INCOME" ? "Доходи" : "Витрати"}»`}
                            </div>
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