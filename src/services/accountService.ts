import type { Account } from "../types/account";
import axiosInstance from "../api/axiosInstance";

const accountService = {
    getAccounts: async (): Promise <Account[]> => {
        const response = await axiosInstance.get<Account[]>('/accounts');
        return response.data;
    },
};

export default accountService;