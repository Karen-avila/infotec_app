export class AccountType {
    id: number;
    code: string;
    value: string;
}

export class Beneficiarie {
    id: number;
    name: string;
    alias: string;
    accountId: number;
    accountNumber: string;
    accountType: AccountType;
    clientId: number;
    clientName: string;
    officeId: number;
    officeName: string;
    transferLimit: number;

    bankEntity: number;

    color: '' | 'light';
    selected: boolean;
}