export interface ICardAccount {
    accountNo: string;
    accountBalance: string;
    displayName: string;
    cardNumber?: string;
    [prop: string]: string;
}

export class CardAccount implements ICardAccount {
    accountNo: string;
    accountBalance: string;
    displayName: string;
    cardNumber?: string;
    [prop: string]: string;
    constructor(pAccountNo: string, pAccountBalance: string, pDisplayName: string, pCardNumber?: string) {
        this.accountNo = pAccountNo;
        this.accountBalance = pAccountBalance;
        this.displayName = pDisplayName;
        this.cardNumber = pCardNumber;
    }
}