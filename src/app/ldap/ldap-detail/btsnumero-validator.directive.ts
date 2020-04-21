import { ValidatorFn} from '@angular/forms';


/** BtsNumero doit être un nombe au format chaine de caractère */

export const validBtsNumero: ValidatorFn = (control) => {
  const reg = new RegExp('^[0-9]{10}$', 'i');
  if (reg.test(control.value)) {
    return null; // valide
  }

  return { validBtsNumero : { value: control.value }};
};

/*export function validBtsNumero(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const reg = new RegExp('^\d{10}$', 'i');
    const valid = reg.test(control.value);
    console.log('validBtsNumero=' + valid)
    return valid ? null : {validBtsNumero: {value: control.value}};
  };
}*/
