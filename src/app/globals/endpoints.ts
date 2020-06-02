import { environment } from '@env';

export const ENDPOINTS = {
    authentication: `${environment.baseUrl}/authentication`,
    clients: `${environment.baseUrl}/clients`,
    beneficiarytpt: `${environment.baseUrl}/beneficiaries/tpt`,
    beneficiaryext: `${environment.baseUrl}/beneficiaries/ext`,
    codes: `${environment.commonUrl}/codes/{catalogo}/codevalues`,
    accounts: `${environment.baseUrl}/clients/{clientId}/accounts`,
    changeData: `${environment.baseUrl}/user`,
    savingsAccountsTransactions: `${environment.baseUrl}/savingsaccounts/{savingAccount}?associations=transactions`,
    accountTransfers: `${environment.baseUrl}/accounttransfers?type="tpt"`,
    banks: `${environment.baseUrl}/codes/BANKS/options`,
    beneficiaryAccountTypes: `${environment.baseUrl}/codes/BENEFICIARY_ACCOUNT_TYPE/options`,
    registration: `${environment.baseUrl}/registration`,
    office: `${environment.baseUrl}/office`,
    codesOptions: `${environment.baseUrl}/codes`,
}
