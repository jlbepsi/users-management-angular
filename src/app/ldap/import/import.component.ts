import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Status, UserImport} from '../../model/UserImport';
import {UsersImportation} from './UsersImportation';
import {MatSort} from '@angular/material/sort';
import {CLASSES} from '../../model/classes';
import {MatDialog} from '@angular/material/dialog';
import {UsersService} from '../../service/users-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  displayedColumns: string[] = ['status', 'login', 'nom', 'prenom', 'motDePasse', 'mail'];
  dataSource = new MatTableDataSource<UserImport>([]);
  classes: string[];
  classeToImport = '';
  processImportRunning = false;
  processUsersToNARunning = false;
  errorMessage = '';
  importRunning = false;
  csvFileName = 'Choisissez un fichier csv';

  private fileReader: FileReader;
  private snackTypeClass = {
    success: 'snackbarColorSuccess',
    danger: 'snackbarColorDanger',
    info: 'snackbarColorInfo',
    warning: 'snackbarColorWarning'
  };

  get nodata(): boolean {
    return this.dataSource.data.length === 0;
  }
  get cannotImport(): boolean {
    return this.processImportRunning || this.classeToImport.length === 0 || this.dataSource.data.length === 0;
  }

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.classes = CLASSES;
  }

  selectFile() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected() {
    const csvFile = this.fileInput.nativeElement as HTMLInputElement;
    const file: File = csvFile.files[0];

    this.csvFileName = file.name;
    this.classeToImport = file.name.substring(0, file.name.indexOf('.')).toUpperCase();
    this.importRunning = true;

    this.fileReader = new FileReader();
    this.fileReader.onload = (e: any) => {
      const content: string = this.fileReader.result.toString(); // la liste à construire
      this.dataSource.data = UsersImportation.createUsersFromCSV(content);
      this.importRunning = false;
    };

    this.fileReader.readAsText(file);

  }

  doImport() {
    // L'import est démarré
    this.processImportRunning = true;
    // Fixe la classe
    this.dataSource.data.forEach( (user) => {
      user.classe = this.classeToImport;
    });
    // Importe les utilisateurs
    this.usersService.imports(this.dataSource.data).subscribe(
        (data: UserImport[]) => {

        this.dataSource.data.forEach( user => {
          const userFound = data.find(u => u.login === user.login);
          if (userFound) {
            user.status = (userFound.status > 0 ? Status.Success : Status.Error);
          } else {
            user.status = Status.Error;
          }
        });
        this.processImportRunning = false;
        this.showSnakbar('Importation réussie !', this.snackTypeClass.success);
      },
      error => {
        this.errorMessage = 'Impossible d\'importer les utilisateurs';
        this.processImportRunning = false;
        this.showSnakbar('Importation impossible !', this.snackTypeClass.danger);
      }
    );
  }

  setUsersToNA() {
    this.processUsersToNARunning = true;
    const dialogRef = this.dialog.open(DialogUsersNAComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.setUsersToNA().subscribe(
          data => {
            this.processUsersToNARunning = false;
            this.showSnakbar('Réinitialisation des utilisateurs réussie !', this.snackTypeClass.success);
          },
            (error: HttpErrorResponse) => {
            this.errorMessage = 'Impossible de réinitialiser les utilisateurs';
            this.processUsersToNARunning = false;
            this.showSnakbar('Opération impossible !', this.snackTypeClass.danger);

            console.log(error.error);
          }
        );
      } else {
        this.processUsersToNARunning = false;
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

@Component({
  selector: 'app-dialog-users-na',
  templateUrl: 'dialog-users-na.html',
})
export class DialogUsersNAComponent {}
