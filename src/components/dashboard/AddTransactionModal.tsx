import { useState } from "react";
import transactionService from "../../services/transactionService";
import type { AddTransactionModalProps } from "../../types/transaction";

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, accounts, categories, onSuccess }) => {
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        accountId: '',
        categoryId: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    // Derive type from amount sign: negative = EXPENSE, positive = INCOME
    const numericAmount = Number(formData.amount);
    const derivedType: 'INCOME' | 'EXPENSE' = numericAmount >= 0 ? 'INCOME' : 'EXPENSE';

    const handleAmountChange = (value: string) => {
        // When amount changes, reset category since type may flip
        const prev = Number(formData.amount);
        const next = Number(value);
        const typeFlipped = (prev >= 0) !== (next >= 0);
        setFormData(f => ({ ...f, amount: value, categoryId: typeFlipped ? '' : f.categoryId }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (numericAmount === 0) {
            alert("Сума не може бути нулем");
            return;
        }
        setIsSubmitting(true);
        try {
            await transactionService.createTransaction({
                ...formData,
                amount: Math.abs(numericAmount),
                type: derivedType,
                transactionDate: new Date().toISOString(),
            });
            setFormData({ amount: '', description: '', accountId: '', categoryId: '' });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Деталі помилки з сервера:", err);
            alert("Помилка при створенні транзакції");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCategories = categories.filter(c => c.type === derivedType);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Додати транзакцію</h2>
                <form onSubmit={handleSubmit}>

                    <div className="modal-amount-wrap">
                        <input
                            type="number"
                            placeholder="Сума (− витрата, + дохід)"
                            value={formData.amount}
                            step="1"
                            onChange={e => handleAmountChange(e.target.value)}
                            required
                        />
                        {formData.amount !== '' && numericAmount !== 0 && (
                            <span className={`modal-type-hint ${derivedType === 'INCOME' ? 'modal-type-hint--income' : 'modal-type-hint--expense'}`}>
                                {derivedType === 'INCOME' ? '+ Дохід' : '− Витрата'}
                            </span>
                        )}
                    </div>

                    <select
                        value={formData.accountId}
                        onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                        required
                    >
                        <option value="">Виберіть рахунок</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>

                    <select
                        value={formData.categoryId}
                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                    >
                        <option value="">Виберіть категорію</option>
                        {filteredCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Опис (необов'язково)"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} disabled={isSubmitting}>
                            Скасувати
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Збереження...' : 'Зберегти'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;