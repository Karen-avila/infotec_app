import { environment } from '@env';

let baseUrl: string = environment.baseUrl;
let totpUrl: string = `${baseUrl}/banbi`;

if (environment.production) { 
  baseUrl = `${baseUrl}/fineract-protected-movil`;
}

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
}
