import type { Account } from "../types/account";
import axiosInstance from "../api/axiosInstance";

const accountService = {
    getAccounts: async (): Promise <Account[]> => {
        const response = await axiosInstance.get<Account[]>('/accounts');
        return response.data;
    },

    createAccount: async (accountData: Omit<Account, 'id'>): Promise <Account> => {
        const response = await axiosInstance.post<Account>('/accounts', accountData);
        return response.data;
    },

    deleteAccount: async(id: string): Promise<void> =>{
        await axiosInstance.delete(`/accounts/${id}`)
    }

};

export default accountService;