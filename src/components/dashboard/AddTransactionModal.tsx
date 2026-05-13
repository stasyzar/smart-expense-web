import { useState } from "react";
import transactionService from "../../services/transactionService";
import type { AddTransactionModalProps } from "../../types/transaction";

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, accounts, categories, onSuccess }) => {
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        accountId: '',
        categoryId: '',
        type: 'EXPENSE'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await transactionService.createTransaction({
                ...formData,
                amount: Number(formData.amount),
                transactionDate: new Date().toISOString()
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Деталі помилки з сервера:", err);
            alert("Помилка при створенні транзакції");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Додати транзакцію</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type='number'
                        placeholder="Сума"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        required />

                    <select
                        value={formData.accountId}
                        onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                        required
                    ><option value="">Виберіть рахунок</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>

                    <select
                        value={formData.categoryId}
                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                    ><option value="">Виберіть категорію</option>
                        {categories.filter(c => c.type === formData.type).map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                    </select>

                    <input
                        type="text"
                        placeholder="Опис"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>Скасувати</button>
                        <button type="submit" className="btn-primary">Зберегти</button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default AddTransactionModal;