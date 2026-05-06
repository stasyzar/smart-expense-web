import axios from "axios";
import accountService from "../../services/accountService";
import type { AddAccountModalProps } from "../../types/modal";
import type { AccountType } from "../../types/account";
import { useState } from "react";

const AddAccountModal = ({ isOpen, onClose, onSuccess }: AddAccountModalProps) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<AccountType>('CARD'); 
    const [currency, setCurrency] = useState('UAH');
    const [balance, setBalance] = useState(0);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await accountService.createAccount({ name, type, currency, balance });

            onSuccess();
            onClose();

            setName('');
            setBalance(0);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Не вдалося створити рахунок");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h3>Додати новий рахунок</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Назва" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    
                    <select 
                        value={type} 
                        onChange={e => setType(e.target.value as AccountType)}
                    >
                        <option value="CARD">💳 Картка</option>
                        <option value="CASH">💵 Готівка</option>
                        <option value="SAVINGS">🏦 Заощадження</option>
                    </select>

                    <select value={currency} onChange={e => setCurrency(e.target.value)}>
                        <option value="UAH">UAH</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>

                    <input 
                        type="number" 
                        value={balance}
                        onChange={e => setBalance(Number(e.target.value))}
                        required
                    />

                    {error && <p className="error-message">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Скасувати</button>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Збереження..." : "Створити"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAccountModal;