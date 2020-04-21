import {UserLdap} from './userldap';


export class UserldapImpl implements UserLdap {
  active: boolean;
  bts: boolean;
  btsNumero: string;
  btsParcours: string;
  classe: string;
  groupe: string;
  login: string;
  mail: string;
  motDePasse: string;
  nom: string;
  get nomComplet(): string {
    return this.nom + ' ' + this.prenom;
  }
  prenom: string;
  role: string;

  constructor() {
    this.active = true;
    this.role = 'ROLE_USER';
  }
}
