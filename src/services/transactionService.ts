import axiosInstance from "../api/axiosInstance";
import type { CreateTransactionData, Transaction } from "../types/transaction";

const transactionService = {
    getRecentTransactions: async (): Promise<Transaction[]> => {
        const response = await axiosInstance.get<Transaction[]>('/transactions');
        return response.data;
    },

    createTransaction: async (data: CreateTransactionData) =>{
        const response = await axiosInstance.post('/transactions', data);
        return response.data;
    }
}

export default transactionService;