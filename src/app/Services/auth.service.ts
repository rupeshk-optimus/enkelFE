import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';

import { Constants } from 'src/app/shared/constants';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(
        private http: HttpClient
    ) { }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem(Constants.localstorageKeys.ACCESS_TOKEN);
        return !this.jwtHelper.isTokenExpired(token);
    }

    getUserDetails(token, guid?: string): Observable<any> {
        const parameters = {
            accessToken: token
        };
        if (guid) {
            Object.assign(parameters, {
                clientGuid: guid
            });
        }
        return this.http.get(`${Constants.endPoints.LOGIN}`, {
            params: parameters
        });
    }
}
