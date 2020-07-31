import { AbstractControl, FormGroup } from '@angular/forms';
import { Beneficiarie } from './interfaces/beneficiarie';

export function ValidatePhoneNumber(control: AbstractControl) {
    if (!(/^[0-9]{10}$/.test(control.value))) {
        return { phoneNumber: true };
    }
    return null;
}

export function ValidateCurp(control: AbstractControl) {
    if (!(/^[a-zA-Z]{4}[\d]{6}(H|h|M|m)[a-zA-Z]{5}[a-zA-Z0-9]{2}$/.test(control.value))) {
        return { curp: true };
    }
    return null;
}

export function ValidateRfc(control: AbstractControl) {
    if (!(/^[a-zA-Z]{4}[\d]{6}[0-9]{2}[a-zA-Z]{1}$/.test(control.value))) {
        return { rfc: true };
    }
    return null;
}

export function ValidateAccountNumber(control: AbstractControl) {
    if (!(/^([0-9]{8,9}|[0-9]{11})$/.test(control.value))) {
        return { accountNumber: true };
    }
    return null;
}

export function ValidateEmail(control: AbstractControl) {
    if  (control.value && !(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(control.value))) {
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

export function ValidateInteger(control: AbstractControl) {
    if (!(/^[1-9]\d*$/.test(control.value))) {
        return { integer: true };
    }
    return null;
}


export function ValidateText(control: AbstractControl) {
    if (!(/^[A-Za-znÑäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙ\s]*$/.test(control.value))) {
        return { text: true };
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

export function ValidateNameBeneficiary(controlName: string, beneficiaries: Beneficiarie[]) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        if (!control.value) { return null }
        for (var i = 0; i < (beneficiaries || []).length; i++) {
            if (beneficiaries[i].name.toLowerCase() == control.value.toLowerCase()) {
                control.setErrors({ beneficiaryAlreadyRegistered: true });
            }
        }
        return null;
    }
}

export function ValidateTransferAmountLimit(controlName: string, transferLimit: number) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        if (!control.value) { return null }
        if (control.value > transferLimit)
            control.setErrors({ transferAmountLimit: true });
        return null;
    }
}