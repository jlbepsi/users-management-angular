import {FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export const passwordValidator: ValidatorFn = (form: FormGroup): ValidationErrors | null => {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value ?
      null :
      { passwordValidator: true };
};

/**
 * Custom ErrorStateMatcher which returns true (error exists) when the parent form group is invalid and the control has been touched
 */
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    if ( control.parent.invalid && control.touched) {
          console.log('ConfirmValidParentMatcher true');
      } else {
          console.log('ConfirmValidParentMatcher false');
      }

    return control.parent.invalid && control.touched;
  }
}
