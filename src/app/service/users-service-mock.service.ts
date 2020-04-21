import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';

import {UserLdap} from '../model/userldap';
import {LDAP_USERS} from '../model/mock-ldap';
import {ClassesInfo} from '../model/ClasseInfo';
import {CLASSES_INFO} from '../model/mock-classeinfos';
import {UserImport} from '../model/UserImport';
import {UserldapImpl} from '../model/UserldapImpl';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users: UserLdap[] = LDAP_USERS;
  private classesInfo: ClassesInfo = CLASSES_INFO;

  constructor() { }

  getUsers(): Observable<UserLdap[]> {
    return of(this.users);
  }

  getUsersOfClass(classe: string): Observable<UserLdap[]> {
    return of(this.users.filter( user => user.classe === classe));
  }

  getUser(login: string): Observable<UserLdap> {
    const userFound = this.users.find(user => user.login === login);
    if (userFound == null) {
      return throwError(
        'Something bad happened; please try again later.'
      );
    }

    return of (userFound);
  }

  addUser(user: UserLdap): Observable<UserLdap> {
    this.users.push(user);

    return of(user);
  }

  updateUser(userToUpdate: UserLdap): Observable<UserLdap> {
    this.users = this.users.filter(user => user.login !== userToUpdate.login);
    console.log(userToUpdate);
    this.users.push(userToUpdate);

    return of(userToUpdate);
  }

  deleteUser(login: string): Observable<string> {
    this.users = this.users.filter(user => user.login === login);
    return of(login);
  }
  deleteUsers(list: string[]): Observable<string> {
    list.forEach( login =>
      this.users = this.users.filter(user => user.login === login)
    );
    return of('200');
  }

  imports(list: UserImport[]): Observable<string> {
    return of('200');
  }

  setusersToNA(): Observable<string> {
    this.users.forEach(
      user => user.classe = 'NA'
    );
    return of('200');
  }


  // CLASSES

  getClassInfos(): Observable<ClassesInfo> {
    return of(this.classesInfo);
  }

  activate(login: string): Observable<string> {
    return of('200');
  }

  deactivate(login: string): Observable<string> {
    return of('200');
  }

  deactivateUsers(list: string[]): Observable<string> {
    return of('200');
  }

  activateUsers(list: string[]): Observable<string> {
    return of('200');
  }
}
