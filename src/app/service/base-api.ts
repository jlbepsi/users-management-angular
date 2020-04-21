import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserLdap} from '../model/userldap';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {AuthenticationService} from '../security/authentication.service';

export default class BaseApi<T> {


    constructor(private httpClient: HttpClient, private domain: string) {
    }

    apiGetAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(this.domain);
    }

    /*apiGetAllWithOption(urlOption: string): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.domain}/${urlOption}`);
    }*/

    apiGetAllWithOption(idOrUrl: string) {
        return this.apiMethodWithData(idOrUrl, 'GET', null);
    }

    apiGetId(id: string): Observable<T> {
        return this.httpClient.get<T>(`${this.domain}/${id}`);
    }

    apiPost(data: any) {
        return this.apiMethodWithData(null, 'POST', data);
    }
    apiPostWithURL(idOrUrl: string, data: any) {
        return this.apiMethodWithData(idOrUrl, 'POST', data);
    }
    apiPut(idOrUrl: string, data: any) {
        return this.apiMethodWithData(idOrUrl, 'PUT', data);
    }
    apiDelete(id: string) {
        return this.apiMethodWithData(id, 'DELETE', null);
    }
    apiDeleteWithURL(idOrUrl: string, data: any) {
        return this.apiMethodWithData(idOrUrl, 'DELETE', data);
    }

    private apiMethodWithData(idOrUrl: string, method: string, data: any) {
        console.log('apiMethodWithData:');

        const url = this.domain + (idOrUrl == null ? '' : '/' + idOrUrl);
        console.log(url);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + AuthenticationService.getToken()
            })
        };
        data = (data == null ? '' : JSON.stringify(data));
        console.log(data);

        return this.httpClient.request<T>(method, url, {
            body: data,
            headers: httpOptions.headers
        })/*.pipe(
            tap(res => BaseApi.log(res.toString()))
        )*/;
    }
}
