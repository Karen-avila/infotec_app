export interface AccountType {
    id: number;
    code: string;
    value: string;
}

export interface BeneficiarieTPT {
    id: number;
    name: string;
    officeName: string;
    clientName: string;
    accountType: AccountType;
    accountNumber: string;
    transferLimit: number;
}
