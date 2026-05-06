import type { Account } from "./account";

export interface SidebarProps {
    accounts: Account[];
    error: string | null;
    logout: () => void;
}