import { environment } from '@env';

let baseUrl: string = `${environment.baseUrl}${environment.production ? '/fineract-protected-movil' : '' }`;
let totpUrl: string = `${environment.baseUrl}/banbi`;
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
  totp: `${totpUrl}/otp`,
  validateTotp: `${baseUrl}/totp`,
}
