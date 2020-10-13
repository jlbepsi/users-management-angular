import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialModule} from '../app-material.module';
import {ChartsModule} from 'ng2-charts';

import { LdapManagementRoutingModule } from './ldap-management-routing.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DialogUsersNAComponent, ImportComponent} from './import/import.component';
import {DialogUserPasswordComponent, DialogUsersBTSComponent, LdapListComponent} from './ldap-list/ldap-list.component';
import {LdapAddComponent} from './ldap-add/ldap-add.component';
import {LdapEditComponent} from './ldap-edit/ldap-edit.component';
import {AlertComponent} from './share/alert/alert.component';
import {ClasseComponent} from './share/classe/classe.component';
import {LdapComponent} from './ldap/ldap.component';
import {NavbarComponent} from './navbar/navbar.component';
import { OverlayLoadingDirective } from './share/overlay/overlay-loading.directive';
import { LoaderComponent } from './share/loader/loader.component';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [
    NavbarComponent,
    ClasseComponent,
    DashboardComponent,
    DialogUsersNAComponent,
    ImportComponent,
    LdapComponent,
    DialogUsersBTSComponent,
    DialogUserPasswordComponent,
    LdapListComponent,
    LdapAddComponent,
    LdapEditComponent,
    AlertComponent,
    OverlayLoadingDirective,
    LoaderComponent,
    InfoComponent,
  ],
  exports: [
    LdapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    AppMaterialModule,
    LdapManagementRoutingModule
  ]
})
export class LdapManagementModule { }
