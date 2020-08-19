import { environment } from '@env';

const MOBILE = 'fineract-protected-movil';
const TOTP = 'banbi';

export const ENDPOINTS = {
  authentication: `${environment.baseUrl}/${MOBILE}/authentication`,
  clients: `${environment.baseUrl}/${MOBILE}/clients`,
  beneficiarytpt: `${environment.baseUrl}/${MOBILE}/beneficiaries/tpt`,
  beneficiaryext: `${environment.baseUrl}/${MOBILE}/beneficiaries/ext`,
  accounts: `${environment.baseUrl}/${MOBILE}/clients/{clientId}/accounts`,
  changeData: `${environment.baseUrl}/${MOBILE}/user`,
  savingsAccountsTransactions: `${environment.baseUrl}/${MOBILE}/savingsaccounts/{savingAccount}?associations=transactions`,
  accountTransfers: `${environment.baseUrl}/${MOBILE}/accounttransfers`,
  registration: `${environment.baseUrl}/${MOBILE}/registration`,
  office: `${environment.baseUrl}/${MOBILE}/office`,
  codesOptions: `${environment.baseUrl}/${MOBILE}/codes`,
  socialPrograms: `${environment.baseUrl}/${MOBILE}/socialprogram`,
  savingsAccounts: `${environment.baseUrl}/${MOBILE}/savingsaccounts`,
  password: `${environment.baseUrl}/${MOBILE}/password`,
  totp: `${environment.baseUrl}/${TOTP}/otp`,
}
