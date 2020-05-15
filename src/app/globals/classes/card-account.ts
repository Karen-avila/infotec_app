import { ICardAccount } from '@components/card-account/card-account.component';

export class CardAccount implements ICardAccount {
    account: string;
    balance: string;
    clientName: string;
    cardNumber?: string;
    [prop: string]: string;
    constructor(pAccount: string, pBalance: string, pClientName: string, pCardNumber?: string) {
        this.account = pAccount;
        this.balance = pBalance;
        this.clientName = pClientName;
        this.cardNumber = pCardNumber;
    }
}