import { AbstractControl, FormGroup } from '@angular/forms';

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