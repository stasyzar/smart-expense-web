import type { Account } from "./account";

export interface StatCardProps {
    label: string;
    value: string;
    change?: string;
    type?: 'income' | 'expense' | 'savings' | 'default';
}

export interface TopBarProps {
    title: string;
    onAddClick: () => void;
}

export interface AccountsWidgetProps{
    accounts: Account[];
}