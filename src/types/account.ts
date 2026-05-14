export interface Account{
    type: string;
    id: string;
    name: string;
    balance: number;
    currency: string;
}

export type AccountType = 'CARD' | 'CASH' | 'SAVINGS';

export type CurrencyType = 'UAH' | 'USD' | 'EUR';