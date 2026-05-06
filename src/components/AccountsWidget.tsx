import type { AccountsWidgetProps } from '../types/dashboard';

const AccountsWidget = ({ accounts }: AccountsWidgetProps) => {
    return (
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
    );
};

export default AccountsWidget;