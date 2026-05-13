import type { Category } from "../types/category";
import axiosInstance from "../api/axiosInstance";

const categoryService = {
    getCategories: async () : Promise<Category[]> => {
        const response= await axiosInstance.get<Category[]>('/categories');
        return response.data;
    }
}

export default categoryService;