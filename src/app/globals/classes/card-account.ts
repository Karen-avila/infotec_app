export interface ICardAccount {
    id: number;
    accountNo: string;
    accountBalance: string;
    displayName: string;
    accountType: number;
}

export class CardAccount implements ICardAccount {
    id: number;
    accountNo: string;
    accountBalance: string;
    displayName: string;
    accountType: number;
    
    constructor(pId: number, pAccountNo: string, pAccountBalance: string, pDisplayName: string, pAccountType: number) {
        this.id = pId;
        this.accountNo = pAccountNo;
        this.accountBalance = pAccountBalance;
        this.displayName = pDisplayName;
        this.accountType = pAccountType;
    }
}