import { useState, type ReactNode} from "react";
import type { LoginRequest, RegisterRequest } from "../types/auth";
import { AuthContext } from './AuthContext';
import authService from "../api/authService";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>{
        const token = localStorage.getItem('accessToken');
        return !!token;
    });

    const login = async (data: LoginRequest) => {
        const response = await authService.login(data);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        setIsAuthenticated(true);
    };

    const register = async (data: RegisterRequest) => {
        const response = await authService.register(data);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
