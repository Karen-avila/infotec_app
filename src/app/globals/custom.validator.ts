import { AbstractControl, FormGroup } from '@angular/forms';

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

export function ValidateAccountNumber(control: AbstractControl) {
    if (!(/^[0-9]{9}$/.test(control.value))) {
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