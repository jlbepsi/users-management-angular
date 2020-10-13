import {UserImport} from '../../model/UserImport';

export class UsersImportation {

  static map = null;

  static createUsersFromCSV(content: string): UserImport[] {
    const listUsers: UserImport[] = [];

    const lines = content.split('\n');
    let headers = [];
    let cpt = 0;
    lines.forEach((line: string) => {

      if (line !== '') {
        // On ne lit pas la première ligne (en-tête) mais on la conserve
        if (cpt === 0) {
          cpt++;
          // Lecture de l'en-tête
          headers = line.split(',');
          UsersImportation.setHeadersFromCSV(headers);
        } else {
          listUsers.push(UsersImportation.createUserImportFromCSV(line));
        }
      }
    });

    return listUsers;
  }

  private static setHeadersFromCSV(headers: string[]) {
    UsersImportation.map = new Map();

    headers.forEach( (entry, index) => {
      switch (entry.toLowerCase()) {
        case 'loginperso':
          UsersImportation.map.set('login', index);
          break;
        case 'nom':
          UsersImportation.map.set('nom', index);
          break;
        case 'prenom':
          UsersImportation.map.set('prenom', index);
          break;
        case 'motdepasse':
          UsersImportation.map.set('mdp', index);
          break;
        case 'mailetudiant':
          UsersImportation.map.set('mail', index);
          break;
        default:
          break;
      }
    });
  }

  private static createUserImportFromCSV(line) {
    // line: DUPONT;Jean;jean.dupont;123ABC;jean.dupont@gmail.com
    const userInfo: string[] = line.split(',');

    return new UserImport(
      userInfo[UsersImportation.map.get('login')].toLowerCase(),
      userInfo[UsersImportation.map.get('nom')].toUpperCase(),
      userInfo[UsersImportation.map.get('prenom')],
      userInfo[UsersImportation.map.get('mdp')],
      '',
      userInfo[UsersImportation.map.get('mail')].toLowerCase()
    );
  }
}
