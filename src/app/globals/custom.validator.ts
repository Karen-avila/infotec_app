import { AbstractControl, FormGroup } from '@angular/forms';
import { BeneficiarieTPT } from './interfaces/beneficiarie-tpt';

export function ValidatePhoneNumber(control: AbstractControl) {
    if (!(/[0-9]{10,10}$/.test(control.value)) || (`${control.value}` || '').length !== 10) {
        return { phoneNumber: true };
    }
    return null;
}

export function ValidateCurp(control: AbstractControl) {
    if (!(/[a-z0-9]{18,18}$/gi.test(control.value)) || (`${control.value}` || '').length !== 18) {
        return { curp: true };
    }
    return null;
}

export function ValidateAccountNumber(control: AbstractControl) {
    if (!(/[0-9]{9,9}$/gi.test(control.value)) || (`${control.value}` || '').length !== 9) {
        return { accountNumber: true };
    }
    return null;
}

export function ValidateEmail(control: AbstractControl) {
    if (!(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(control.value))) {
        return { email: true };
    }
    return null;
}

export function ValidateMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function ValidatePassword(control: AbstractControl) {
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,50})/.test(control.value))) {
        return { password: true };
    }
    return null;
}

export function ValidateAccountNumberBeneficiaries(control: AbstractControl) {
    // TODO borrar el de parametro 9 porque las cuentas del banco siempre van a ser de 11, se dejo asi para las pruebas en un comienzo
    if ((`${control.value}`).length === 9 || (`${control.value}`).length === 11 || (`${control.value}`).length === 16 || (`${control.value}`).length === 18) {
        return null;
    }
    return { accountNumber: true };
}


export function ValidateBeneficiarieName(control: AbstractControl) {
    // TODO borrar el de parametro 9 porque las cuentas del banco siempre van a ser de 11, se dejo asi para las pruebas en un comienzo
    if ((`${control.value}`).length === 9 || (`${control.value}`).length === 11 || (`${control.value}`).length === 16 || (`${control.value}`).length === 18) {
        return null;
    }
    return { accountNumber: true };
}

export function ValidateNameBeneficiary(controlName: string, beneficiaries: BeneficiarieTPT[]) {

    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        for (var i = 0; i < beneficiaries.length; i++) {
            if (beneficiaries[i].name.toLowerCase() == control.value.toLowerCase()) {
                control.setErrors({ beneficiaryAlreadyRegistered: true });
            }
        }
        return null;
    }


}