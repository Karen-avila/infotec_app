import { environment } from '@env';

export const ENDPOINTS = {
    authentication: `${environment.baseUrl}/authentication`,
    clients: `${environment.baseUrl}/clients`,
    tptBeneficiary: `${environment.baseUrl}/beneficiaries/tpt`,
    beneficiary: `${environment.baseUrl}/datatable/beneficiaries`,
    codes: `${environment.commonUrl}/codes/{catalogo}/codevalues`,
    accounts: `${environment.baseUrl}/clients/{clientId}/accounts`,
    resetPassword: `${environment.baseUrl}/user`
}
