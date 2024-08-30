import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Constants } from 'src/app/shared/constants';

import { UserAccountModel } from '../models/user-account.model';

@Injectable({
    providedIn: 'root'
})
export class AccountSettingsService {

    constructor(
        private http: HttpClient
    ) { }

    getAccountDetails(): Observable<any> {
        return this.http.get(
            Constants.endPoints.USERS + Constants.symbols.pathVariableSymbol +
            localStorage.getItem(Constants.localstorageKeys.ID) + Constants.symbols.pathVariableSymbol +
            localStorage.getItem(Constants.localstorageKeys.GUID));
    }

    updateAccountDetails(accountModel: UserAccountModel): Observable<any> {
        return this.http.put(`${Constants.endPoints.USERS}`, accountModel);
    }
}
