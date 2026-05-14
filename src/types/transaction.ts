import type { Account } from "./account";
import type { Category } from "./category";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Transaction {
    id: number;
    amount: number;
    description: string;
    categoryName: string;
    accountName: string;
    categoryId: string;
    accountId: string;
    type?: 'INCOME' | 'EXPENSE';
    transactionType: 'INCOME' | 'EXPENSE';
    createdAt: string;
}

export const CATEGORY_ICONS: Record<string, string> = {
    "Продукти": "🛒",
    "Транспорт": "🚗",
    "Житло та комуналка": "🏠",
    "Розваги": "🎬",
    "Здоров'я": "🏥",
    "Зарплата": "💼",
    "Подарунки": "🎁",
    "Їжа": "🍔",
    "Дохід": "💼",
    "Покупки": "🛍️",
    "Комунальні": "🏠",
    "Інше": "📦",
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

// Basic normalize: maps backend "type" field -> "transactionType"
export const normalizeTransaction = (tx: any): Transaction => ({
    ...tx,
    transactionType: (tx.transactionType || tx.type || 'EXPENSE').toUpperCase() as 'INCOME' | 'EXPENSE',
    categoryName: tx.categoryName || '',
    accountName: tx.accountName || '',
});

// Enrich: fills in categoryName and accountName from local lookup maps
export const enrichTransactions = (
    transactions: Transaction[],
    accounts: Account[],
    categories: Category[],
): Transaction[] => {
    const accountMap = new Map(accounts.map(a => [a.id, a.name]));
    const categoryMap = new Map(categories.map(c => [c.id, c.name]));

    return transactions.map(tx => ({
        ...tx,
        accountName: accountMap.get(tx.accountId) || tx.accountName || '—',
        categoryName: categoryMap.get(tx.categoryId) || tx.categoryName || '—',
    }));
};