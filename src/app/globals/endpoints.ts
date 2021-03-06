import { environment } from '@env';

let baseUrl: string = `${environment.baseUrl}${environment.graviteeEndpoints ? '/fineract-protected-movil' : '' }`;
let banbiUrl: string = `${environment.baseUrl}/banbi`;

export let ENDPOINTS = {
  authentication: `${baseUrl}/authentication`,
  clients: `${baseUrl}/clients`,
  beneficiarytpt: `${baseUrl}/beneficiaries/tpt`,
  beneficiaryext: `${baseUrl}/beneficiaries/ext`,
  accounts: `${baseUrl}/clients/{clientId}/accounts`,
  changeData: `${baseUrl}/user`,
  savingsAccountsTransactions: `${baseUrl}/savingsaccounts/{savingAccount}?associations=transactions`,
  accountTransfers: `${baseUrl}/accounttransfers`,
  registration: `${baseUrl}/registration`,
  office: `${baseUrl}/office`,
  codesOptions: `${baseUrl}/codes`,
  socialPrograms: `${baseUrl}/socialprogram`,
  savingsAccounts: `${baseUrl}/savingsaccounts`,
  password: `${baseUrl}/password`,
  totp: `${banbiUrl}/otp`,
  validateTotp: `${baseUrl}/totp`,
  notification: `${banbiUrl}/email`
}
