export interface ICardAccount {
    accountNo: string;
    accountBalance: string;
    displayName: string;
    accountType: number;
}

export class CardAccount implements ICardAccount {
    accountNo: string;
    accountBalance: string;
    displayName: string;
    accountType: number;
    
    constructor(pAccountNo: string, pAccountBalance: string, pDisplayName: string, pAccountType: number) {
        this.accountNo = pAccountNo;
        this.accountBalance = pAccountBalance;
        this.displayName = pDisplayName;
        this.accountType = pAccountType;
    }
}