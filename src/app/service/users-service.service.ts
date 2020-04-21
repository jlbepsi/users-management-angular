import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';

import {UserLdap} from '../model/userldap';
import {ClassesInfo} from '../model/ClasseInfo';
import {UserImport} from '../model/UserImport';
import {HttpClient} from '@angular/common/http';
import BaseApi from './base-api';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseApi<UserLdap> {

  private static usersUrl = 'http://localhost:8081/api/users';

  constructor(httpClient: HttpClient) {
    super(httpClient, UsersService.usersUrl);
  }

  getUsers(): Observable<UserLdap[]> {
    return super.apiGetAll();
  }

  getUsersOfClass(classe: string): Observable<object> {
    return super.apiGetAllWithOption(classe);
  }

  getUser(login: string): Observable<UserLdap> {
    return super.apiGetId(login);
  }

  addUser(user: UserLdap): Observable<UserLdap> {
    return super.apiPost(user);
  }

  updateUser(userToUpdate: UserLdap): Observable<UserLdap> {
    return super.apiPut(userToUpdate.login, userToUpdate);
  }

  deleteUser(login: string): Observable<object> {
    return super.apiDelete(login);
  }
  deleteUsers(list: string[]): Observable<object> {
    return super.apiDeleteWithURL('list', list);
  }

  changePassword(login, password): Observable<object> {
    return super.apiPut('password/' + login, {
      login,
      motDePasse: password
    });
  }

  imports(list: UserImport[]): Observable<object> {
    return super.apiPostWithURL('imports', list);
  }

  changeUsersBts(list, bts, btsParcours): Observable<object> {
    return super.apiPut('changebts',
        {
          logins: list,
          bts,
          btsparcours: btsParcours
        });
  }

  setUsersToNA(): Observable<object> {
    return super.apiPut('setuserstona', null);
  }


  // CLASSES

  getClassInfos(): Observable<object> {
    return super.apiGetAllWithOption('classesinfo');
  }

  activate(login: string): Observable<object> {
    return super.apiPut('activate/' + login, null);
  }

  deactivate(login: string): Observable<object> {
    return super.apiPut('deactivate/' + login, null);
  }

  deactivateUsers(list: string[]): Observable<object> {
    return super.apiPut('deactivatelist', list);
  }

  activateUsers(list: string[]): Observable<object> {
    return super.apiPut('activatelist', list);
  }

}
