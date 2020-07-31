export interface ICardAccount {
    id: number;
    accountNo: string;
    accountBalance: string;
    displayName: string;
    accountType: number;
    blocked: boolean;
}

export class CardAccount implements ICardAccount {
    id: number;
    accountNo: string;
    accountBalance: string;
    displayName: string;
    accountType: number;
    blocked: boolean;

    constructor(pId: number, pAccountNo: string, pAccountBalance: string, pDisplayName: string, pAccountType: number, pBlocked: boolean) {
        this.id = pId;
        this.accountNo = pAccountNo;
        this.accountBalance = pAccountBalance;
        this.displayName = pDisplayName;
        this.accountType = pAccountType;
        this.blocked = pBlocked;
    }
}