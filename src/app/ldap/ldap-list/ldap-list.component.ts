import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {UserLdap} from '../../model/userldap';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {ExportToCsv} from 'export-to-csv';

import {UsersService} from '../../service/users-service.service';
import {CLASSES} from '../../model/classes';
import {UserReport} from '../../model/UserReport';
import {ConfirmValidParentMatcher, passwordValidator} from '../ldap-detail/passwords-validator.directive';
import {UserImport} from '../../model/UserImport';
import {UserExport} from '../../model/UserExport';

@Component({
  selector: 'app-ldap-list',
  templateUrl: './ldap-list.component.html',
  styleUrls: ['./ldap-list.component.scss']
})
export class LdapListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['select', 'active', 'classe', 'nomComplet', 'mail', 'bts', 'action'];
  dataSource = new MatTableDataSource<UserLdap>([]);
  selection = new SelectionModel<UserLdap>(true, []);

  classes: string[];
  classeSelected: string;
  btsSelected: boolean;
  errorMessage = '';

  private snackTypeClass = {
    success: 'snackbarColorSuccess',
    danger: 'snackbarColorDanger',
    info: 'snackbarColorInfo',
    warning: 'snackbarColorWarning'
  };

  /********** MATERIAL **********/

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.classes = CLASSES;
    this.classeSelected = '';
    this.btsSelected = false;
  }


  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: UserLdap, filter: string) => this.filterPredicate(data, filter);

    this.getUsers();
  }

  ngAfterViewInit() {
    /*console.log('Values on ngAfterViewInit():');
    console.log('Mat Paginator:', this.paginator);*/
  }

  /********** SERVICE **********/

  getUsers(): void {
    this.usersService.getUsers().subscribe(
      users => {
        if (this.classeSelected.length === 0) {
          this.dataSource.data = users;
        } else {
          this.dataSource.data = users.filter( user => user.classe === this.classeSelected );
        }

        if (this.btsSelected) {
          this.dataSource.data = this.dataSource.data.filter( user => user.bts === true );
        }
      }
    );
  }

  filterPredicate(data, filter) {
    return  !filter || data.nomComplet.toLowerCase().startsWith(filter);
  }

  /*toggleSelect(row: UserLdap, $event: MouseEvent) {
    $event.stopPropagation();
    this.selection.toggle(row);
  }*/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserLdap): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  reload() {
    this.getUsers();
  }

  addUser() {
    this.router.navigate(['/ldap/add']).then( (e) => {
      if (! e) {
        console.log('Navigation has failed!');
      }
    });
  }

  edit(login: string) {
    this.router.navigate(['/ldap', login]).then( (e) => {
      if (! e) {
        console.log('Navigation has failed!');
      }
    });
  }

  deactivateAll() {
    this._activateList(false);
  }

  activateAll() {
    this._activateList(true);

  }

  deactivate(login: string) {
    this.usersService.deactivate(login).subscribe(
      data => {
        this._updateActiveUser(login, false);
        this.showSnakbar('Utilisateur désactivé !', this.snackTypeClass.success);
      },
      error => {
        this.errorMessage = 'Impossible de désactiver l\'utilisateur';
        this.showSnakbar('Désactivation impossible !', this.snackTypeClass.danger);
      }
    );
  }

  activate(login: string) {
    this.usersService.activate(login).subscribe(
      data => {
        this._updateActiveUser(login, true);
        this.showSnakbar('Utilisateur activé !', this.snackTypeClass.success);
      },
      error => {
        this.errorMessage = 'Impossible d\'activer l\'utilisateur';
        this.showSnakbar('Activation impossible !', this.snackTypeClass.danger);
      }
    );
  }

  modifyPassword(nomComplet: string, login: string) {
    const dialogRef = this.dialog.open(DialogUserPasswordComponent, {
      width: '320px',
      data: {nomComplet}
    });

    dialogRef.afterClosed().subscribe( (newPassword: string) => {
      if (newPassword.length > 0) {
        this.usersService.changePassword(login, newPassword).subscribe(
            data => {
              this.showSnakbar('Modification effectuée !', 'X');
            },
            error => {
              this.errorMessage = 'Impossible de modifier le mot de passe';
              this.showSnakbar('Modification impossible !', 'X');
            }
        );
      }
    });
  }

  deleteAll() {
    const list: string[] = this._getUsersLoginSelected();

    if (list.length > 0) {
      // si il y a des utilisateurs
      this.usersService.deleteUsers(list).subscribe(
          data => {
            this._removeUsersFromList(list);
            this.showSnakbar('Utilisateurs supprimé !', this.snackTypeClass.success);
          },
          error => {
            this.errorMessage = 'Impossible de supprimer les utilisateurs';
            this.showSnakbar('Suppression impossible !', this.snackTypeClass.danger);
          }
      );
      // On vide la liste
      this.selection.clear();
    }
  }

  modifyBTSOptionAll() {
    const dialogRef = this.dialog.open(DialogUsersBTSComponent, {
      width: '300px',
      data: {bts: true, parcours: 'SLAM'}
    });

    dialogRef.afterClosed().subscribe(result => {
        // Obtention des utilsateurss sélectionnés
        const list: string[] = this._getUsersLoginSelected();
        if (list.length > 0) {
          // si il y a des utilisateurs
          this.usersService.changeUsersBts(list, result.bts, result.parcours).subscribe(
              (data: UserReport[]) => {
                this._updateBtsOptionUsersList(data, result.bts, result.parcours);
                this.showSnakbar('Changement d\'options BTS effectué !', this.snackTypeClass.success);
              },
              error => {
                this.errorMessage = 'Impossible de changer les options BTS';
                this.showSnakbar('Changement d\'options BTS  impossible !', this.snackTypeClass.danger);
              }
          );
          // On vide la liste
          this.selection.clear();
        }
    });
  }

  deleteForEver(login: string) {
    if (confirm('Supprimer l\'utilisateur "' + login + '"')) {
      this.usersService.deleteUser(login).subscribe(
          data => {
            this.showSnakbar('L\'utilisateur a été supprimé', 'X');
            this._removeUserFromList(login);
            this.showSnakbar('Utilisateur supprimé !', this.snackTypeClass.success);
          },
          error => {
            this.errorMessage = 'Impossible de supprimer l\'utilisateur';
            this.showSnakbar('Suppression impossible !', this.snackTypeClass.danger);
          }
      );
    }
  }

  classeChanged($event) {
    this.classeSelected = $event.value;
    this.getUsers();
  }

  btsChanged($event) {
    this.btsSelected = $event.checked;
    this.getUsers();
  }

  exportCSV() {
    // Librairie export-to-csv
    //  https://www.npmjs.com/package/export-to-csv
    const options = {
      filename: this.classeSelected + '_export',
      fieldSeparator: ',',
      quoteStrings: '',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const list: UserExport[] = [];
    this.selection.selected.forEach( user =>
        list.push(new UserExport(user.login, user.nom, user.prenom, user.classe, user.mail,
                                 user.bts, user.btsParcours, user.btsNumero))
    );

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(list);
  }

  /** PRIVATE METHODS */

  private _getUsersLoginSelected(): string[] {
    const list: string[] = [];
    this.selection.selected.forEach( user =>
        list.push(user.login)
    );
    return list;
  }

  private _removeUsersFromList(list: string[]) {
    let users: UserLdap[] = this.dataSource.data;
    list.forEach(login =>
        users = users.filter(user => user.login !== login)
    );
    this.dataSource.data = users;
  }

  _removeUserFromList(login) {
    this.dataSource.data.filter(user => user.login !== login);
  }

  _updateActiveUser(login, active) {
    // Recherche
    const userFind = this.dataSource.data.find(u => u.login === login);
    if (userFind) {
      // Etat activé/désactivé de l'utilisateur
      userFind.active = active;
    }
  }

  private _activateList(active: boolean) {
    const list: string[] = this._getUsersLoginSelected();

    if (list.length > 0) {
      // si il y a des utilisateurs
      if (active) {
        this.usersService.activateUsers(list).subscribe(
            data => {
              list.forEach(login => {
                this._updateActiveUser(login, true);
              });
            },
            error => {
              this.errorMessage = 'Impossible d\'activer les utilisateurs';
              this.showSnakbar('Suppression impossible !', 'X');
            }
        );
      } else {
        this.usersService.deactivateUsers(list).subscribe(
            data => {
              list.forEach(login => {
                this._updateActiveUser(login, false);
              });
            },
            error => {
              this.errorMessage = 'Impossible de désactiver les utilisateurs';
              this.showSnakbar('Suppression impossible !', 'X');
            }
        );
      }
      // On vide la liste
      this.selection.clear();
    }
  }

  private _updateBtsOptionUsersList(userReports: UserReport[], bts: boolean, parcours: string) {
    // Parcours de la liste résultat
    userReports.forEach( (userReport) => {
      if (userReport.status > 0) { // La modif a réussi
        // Recherche du login
        const userFound = this.dataSource.data.find(user => user.login === userReport.login);
        if (userFound) {
          // Option BTS de l'utilsateur
          userFound.bts = bts;
          userFound.btsParcours = parcours;
        }
      }
    });
}

  private showSnakbar(message: string, type: string) {
    console.log(type);
    this.snackBar.open(message, '', {
      panelClass: [type]
    });
  }
}

export interface DialogBtsData {
  bts: boolean;
  parcours: string;
}

@Component({
  selector: 'app-dialog-users-bts',
  templateUrl: 'dialog-users-bts.html',
})
export class DialogUsersBTSComponent {
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: DialogBtsData) {}

}




export interface DialogPasswordData {
  nomComplet: string;
}

@Component({
  selector: 'app-dialog-user-password',
  templateUrl: 'dialog-user-password.html',
})
export class DialogUserPasswordComponent {

  processValidateRunning = false;
  // Formulaire pour les données Utilisateurs
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  passwordForm = this.fb.group({
      password: [''],
      confirmPassword: [''],
    },
    { validators: passwordValidator}
  );

  get password() {
    return this.passwordForm.get('password').value;
  }

  constructor(
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: DialogPasswordData
) {}

  isFormValid() {
    return this.passwordForm.valid;
  }
}
