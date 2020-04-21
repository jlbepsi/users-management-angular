import {ActivatedRoute, Router} from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Location } from '@angular/common';

import {UserLdap} from '../../model/userldap';
import {validBtsNumero} from './btsnumero-validator.directive';
import {ConfirmValidParentMatcher, passwordValidator} from './passwords-validator.directive';
import {CLASSES} from '../../model/classes';
import {UserldapImpl} from '../../model/UserldapImpl';

/*
Il faut supprimer @Component
 */
export abstract class LdapDetailComponent {

  errorMessage = '';
  processLoadRunning = false;
  processValidateRunning = false;
  btsDisabled = true;
  user: UserLdap;
  classes: string[];
  passwordPlaceHolder: string;

  // https://angular.io/guide/form-validation#cross-field-validation
  // https://material.angular.io/components/form-field/overview#error-messages
  // https://code-maze.com/angular-material-form-validation
  // https://itnext.io/materror-cross-field-validators-in-angular-material-7-97053b2ed0cf

  // Formulaire pour les données Utilisateurs
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  userForm = this.fb.group({
    login: [''],
    nom: [''],
    prenom: [''],
    passwordGroup: this.fb.group({
      password: [''],
      confirmPassword: ['']
    }, { validators: passwordValidator}),
    classe: [''],
    mail: {value: '', disabled: true},
    bts: [false],
    btsParcours: {value: '', disabled: true},
    btsNumero: [{value: '', disabled: true}, validBtsNumero],
    active: [false],
  });


  protected constructor(
    public addForm: boolean,
    protected route: ActivatedRoute,
    private fb: FormBuilder,
    /*private location: Location*/
    private router: Router,
  ) {
    this.classes = CLASSES;
    this.passwordPlaceHolder = 'Mot de passe' + (this.addForm ? '' : ' (vide si inchangé)');
  }

  onInit(): void {
    // Formulaire
    this.onChanges();
  }

  public hasError(controlName: string, errorName: string): boolean {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  updateLogin(): void {
    this.userForm.get('login').setValue((this.formGetValue('prenom') + '.' + this.formGetValue('nom')).toLowerCase());
    this.updateMail();
  }

  updateMail(): void {
    this.userForm.get('mail').setValue(this.formGetValue('login').toLowerCase() + '@' + this.getMailDomain());
  }

  isFormValid(): boolean {
    return this.userForm.valid
      &&  (this.formGetValue('bts') === false || (this.formGetValue('btsParcours') !== '' && this.formGetValue('btsNumero') !== ''));
  }

  abstract validateForm(values: any[]): void;

  onSubmitForm() {
    this.validateForm(this.userForm.value);
  }

  goToLdap() {
    this.router.navigate(['/ldap/list']);
  }

  protected copyUserToFormControl(): void {
    this.userForm.get('login').setValue(this.user.login);
    this.userForm.get('nom').setValue(this.user.nom);
    this.userForm.get('prenom').setValue(this.user.prenom);
    this.userForm.get('classe').setValue(this.user.classe);
    this.userForm.get('mail').setValue(this.user.mail);
    this.userForm.get('bts').setValue(this.user.bts);
    this.userForm.get('btsParcours').setValue(this.user.btsParcours);
    this.userForm.get('btsNumero').setValue(this.user.btsNumero);
    this.userForm.get('active').setValue(this.user.active);
  }

  protected getUserFromFormControl(): UserLdap {
    const user: UserLdap = new UserldapImpl();
    user.login = this.userForm.get('login').value;
    user.motDePasse = this.userForm.get('passwordGroup.password').value;
    user.nom = this.userForm.get('nom').value;
    user.prenom = this.userForm.get('prenom').value;
    user.classe = this.userForm.get('classe').value;
    user.mail = this.userForm.get('mail').value;
    user.bts = this.userForm.get('bts').value;
    user.btsParcours = this.userForm.get('btsParcours').value;
    user.btsNumero = this.userForm.get('btsNumero').value;

    return user;
  }

  private formGetValue(name: string): any {
    return this.userForm.get(name).value;
  }

  private onChanges(): void {
    this.userForm.get('bts').valueChanges
        .subscribe(bts => {
              if (bts) {
                this.userForm.get('btsParcours').enable();
                this.userForm.get('btsNumero').enable();
              } else {
                this.userForm.get('btsParcours').disable();
                this.userForm.get('btsNumero').disable();
              }
            }
        );
    this.userForm.get('classe').valueChanges
        .subscribe(classe => {
              if (classe === 'B1' || classe === 'B2') {
                this.userForm.get('bts').enable();
              } else {
                this.userForm.get('bts').disable();
              }
            }
        );
  }

  private getMailDomain(): string {
    if (this.formGetValue('classe').startsWith('W')) {
      return 'ecoles-wis.fr';
    }
    return 'epsi.fr';
  }
}
