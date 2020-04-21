import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

import {CLASSES} from '../model/classes';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {

  constructor() { }

  getClasses(): Observable<string[]> {
    return of(CLASSES);
  }
}
