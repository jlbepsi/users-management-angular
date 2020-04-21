import { Component, OnInit } from '@angular/core';
import {LdapDetailComponent} from '../ldap-detail/ldap-detail.component';
import {UsersService} from '../../service/users-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-ldap-add',
  templateUrl: '../ldap-detail/ldap-detail.component.html',
  styleUrls: ['../ldap-detail/ldap-detail.component.scss']
})
export class LdapAddComponent extends LdapDetailComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    route: ActivatedRoute,
    fb: FormBuilder,
    router: Router,
    private snackBar: MatSnackBar) {
    super(true, route, fb, router);
  }

  ngOnInit(): void {
    super.onInit();
  }

  validateForm(values: any[]): void {
    console.log('LdapAddComponent');
    console.log(values);

    this.processValidateRunning = true;
    this.usersService.addUser(this.getUserFromFormControl()).subscribe(
      data => {
        this.processValidateRunning = false;
        this.snackBar.open('Utilisateur ajouté !', 'X');
      },
      error => {
        this.processValidateRunning = false;
        this.errorMessage = 'L\'utilisateur n\'a pas pu être ajouté !';
        this.snackBar.open('Erreur dans l\'ajout de l\'utilisateur!', 'X');
      }
    );
  }

}
