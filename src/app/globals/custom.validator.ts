import { AbstractControl, FormGroup } from '@angular/forms';

export function ValidatePhoneNumber(control: AbstractControl) {
    if (!(/[0-9]{10,10}$/.test(control.value)) || (`${control.value}` || '').length !== 10) {
        return { phoneNumber: true };
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
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,50})/.test(control.value)) || (`${control.value}` || '').length !== 10) {
        return { password: true };
    }
    return null;
}