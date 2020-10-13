/*export enum Status {
  Error = -1,
  Waiting,
  Success,
}*/

export class UserImport {

  constructor(public login: string, public nom: string, public prenom: string, public motDePasse: string,
              public classe: string, public mail: string) {
  }

  public status = 0;
  public role = 'ROLE_USER';

  get isPasswordValid() {
    const regex = new RegExp('^[0-9]{3}[A-Z]{3}$');
    return regex.test(this.motDePasse);
  }
}
