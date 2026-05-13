import type { Account } from "../types/account";
import type { Category } from "../types/category";
import type { Transaction } from "../types/transaction";

export type DashboardState = {
    accounts: Account[];
    transactions: Transaction[];
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    isModalOpen: boolean;
    isTransactionModalOpen: boolean;
};

export type DashboardAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload:{ accounts: Account[]; transactions: Transaction[];}}
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'TOGGLE_MODAL'; payload: boolean }
    | { type: 'SET_CATEGORIES'; payload: Category[] }
    | { type: 'TOGGLE_TRANSACTION_MODAL'; payload: boolean }

export const initialState: DashboardState = {
    accounts: [],
    transactions: [],
    categories: [],
    isLoading: true,
    error: null,
    isModalOpen: false,
    isTransactionModalOpen: false,
};

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                accounts: action.payload.accounts,
                transactions: action.payload.transactions,
                isLoading: false,
                error: null
            };
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload };
        case 'TOGGLE_MODAL':
            return { ...state, isModalOpen: action.payload };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload };
        case 'TOGGLE_TRANSACTION_MODAL':
            return { ...state, isTransactionModalOpen: action.payload };
        default:
            return state;
    }
}