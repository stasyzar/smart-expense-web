import type { Account } from "../types/account";

export type DashboardState = {
    accounts: Account[];
    isLoading: boolean;
    error: string | null;
    isModalOpen: boolean;
};

export type DashboardAction =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: Account[] }
    | { type: 'FETCH_ERROR'; payload: string }
    | { type: 'TOGGLE_MODAL'; payload: boolean };

export const  initialState: DashboardState = {
    accounts: [],
    isLoading: true,
    error: null,
    isModalOpen: false
};

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, accounts: action.payload, isLoading: false, error: null };
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, error: action.payload };
        case 'TOGGLE_MODAL':
            return { ...state, isModalOpen: action.payload };
        default:
            return state;
    }
}