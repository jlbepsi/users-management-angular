import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LdapListComponent} from './ldap-list/ldap-list.component';
import {LdapAddComponent} from './ldap-add/ldap-add.component';
import {LdapEditComponent} from './ldap-edit/ldap-edit.component';
import {ImportComponent} from './import/import.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LdapComponent} from './ldap/ldap.component';
import {AuthGuard} from '../security/auth.guard';
import {InfoComponent} from './info/info.component';


const adminRoutes: Routes = [
  {
    path: 'ldap',
    component: LdapComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: 'info', component: InfoComponent },
          { path: 'dashboard', component: DashboardComponent },
          { path: 'import', component: ImportComponent },
          { path: 'list', component: LdapListComponent },
          { path: 'add', component: LdapAddComponent },
          { path: ':id', component: LdapEditComponent },
          { path: '', redirectTo: '/ldap/dashboard', pathMatch: 'full' },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class LdapManagementRoutingModule { }
