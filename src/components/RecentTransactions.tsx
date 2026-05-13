import { type Transaction, CATEGORY_ICONS } from '../types/transaction';

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short' }).format(date);
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">Останні транзакції</div>
                <div className="card-link">Всі →</div>
            </div>
            <div className="tx-list">
                {transactions.length === 0 ? (
                    <div className="tx-empty">Транзакцій поки немає</div>
                ) : (
                    transactions.map((tx) => (
                        <div className="tx-row" key={tx.id}>
                            <div className="tx-icon">
                                {CATEGORY_ICONS[tx.categoryName] || "💰"}
                            </div>
                            <div className="tx-info">
                                <div className="tx-name">{tx.description || tx.categoryName}</div>
                                <div className="tx-cat">{tx.categoryName} • {tx.accountName}</div>
                            </div>
                            <div className="tx-right">
                                <div className={`tx-amount ${tx.transactionType === 'INCOME' ? 'tx-amount--income' : 'tx-amount--expense'}`}>
                                    {tx.transactionType === 'INCOME' ? '+' : '-'}
                                    ₴ {Math.abs(tx.amount).toLocaleString('uk-UA')}
                                </div>
                                <div className="tx-date">{formatDate(tx.createdAt)}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;