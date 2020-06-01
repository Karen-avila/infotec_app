export interface AccountType {
    id: number;
    code: string;
    value: string;
}

export interface BeneficiarieTPT {
    id: number;
    name: string;
    accountId: number;
    accountNumber: string;
    accountType: AccountType;
    clientId: string;
    clientName: string;
    officeId: number;
    officeName: string;
    transferLimit: number;
}
