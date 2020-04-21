// https://users.ws.montpellier.epsi.fr/api/users

export interface UserLdap {
  login: string;
  nom: string;
  prenom: string;
  nomComplet: string;
  motDePasse: string;
  classe: string;
  groupe: string;
  mail: string;
  role: string;
  bts: boolean;
  btsParcours: string;
  btsNumero: string;
  active: boolean;
}
