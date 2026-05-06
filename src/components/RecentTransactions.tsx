const RecentTransactions = () => {
    const mockTransactions = [
        { icon: '🍔', name: "McDonald's", cat: '🍕 Їжа', account: 'Monobank', amount: -189, date: 'Сьогодні' },
        { icon: '💼', name: 'Зарплата',   cat: '💼 Дохід', account: 'Monobank', amount: 42000, date: '26 квіт' },
        { icon: '🚇', name: 'Uber',       cat: '🚗 Транспорт', account: 'Готівка', amount: -320, date: '25 квіт' },
        { icon: '🎬', name: 'Netflix',    cat: '🎬 Розваги', account: 'Monobank', amount: -299, date: '24 квіт' },
    ];

    return(
        <div className="card">
            <div className="card-header">
                <div className="card-tittle">Останні транзакції</div>
                <div className="card-link">Всі →</div>
            </div>
            <div className="tx-list">
                {mockTransactions.map((tx,i) =>(
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
    );
};

export default RecentTransactions;