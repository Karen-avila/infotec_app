import { environment } from '@env';

export const ENDPOINTS = {
  authentication: `${environment.baseUrl}/authentication`,
  clients: `${environment.baseUrl}/clients`,
  beneficiarytpt: `${environment.baseUrl}/beneficiaries/tpt`,
  beneficiaryext: `${environment.baseUrl}/beneficiaries/ext`,
  accounts: `${environment.baseUrl}/clients/{clientId}/accounts`,
  changeData: `${environment.baseUrl}/user`,
  savingsAccountsTransactions: `${environment.baseUrl}/savingsaccounts/{savingAccount}?associations=transactions`,
  accountTransfers: `${environment.baseUrl}/accounttransfers`,
  registration: `${environment.baseUrl}/registration`,
  office: `${environment.baseUrl}/office`,
  codesOptions: `${environment.baseUrl}/codes`,
  socialPrograms: `${environment.baseUrl}/socialprogram`,
  savingsAccounts: `${environment.baseUrl}/savingsaccounts`,
  password: `${environment.baseUrl}/password`,
}
