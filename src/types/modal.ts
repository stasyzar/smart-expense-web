import type { AccountType, CurrencyType } from "./account";

export interface AddAccountModalProps{
    isOpen : boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export interface CreateAccountData {
    name: string;
    type: AccountType;
    currency: CurrencyType;
    balance: number;
}
