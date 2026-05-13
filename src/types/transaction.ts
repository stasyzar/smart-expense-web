import type { Account } from "./account";
import type { Category } from "./category";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Transaction{
    id: number;
    amount: number;
    description: string;
    categoryName: string;
    accountName: string;
    transactionType: 'INCOME' | 'EXPENSE';
    createdAt: string;
}

export const CATEGORY_ICONS: Record<string, string> = {
    "Їжа": "🍔",
    "Транспорт": "🚗",
    "Розваги": "🎬",
    "Дохід": "💼",
    "Здоров'я": "🏥",
    "Покупки": "🛍️",
    "Комунальні": "🏠",
    "Інше": "📦"
};

export interface CreateTransactionData {
    amount: number;
    type: string;
    accountId: string;
    categoryId: string;
    description?: string;
    transactionDate: string;
}

export interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: Account[];
    categories: Category[];
    onSuccess: () => void;
}