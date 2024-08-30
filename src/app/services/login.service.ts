import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Constants } from '../shared/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(
        private authService: AuthService,
        private router: Router,
        private sharedService: SharedService,
        private route: ActivatedRoute,
        private httpClient: HttpClient
    ) { }

    setUserDetails(accountInfo) {
        localStorage.clear();
        localStorage.setItem(Constants.localstorageKeys.ID, accountInfo.id);
        localStorage.setItem(Constants.localstorageKeys.GUID, accountInfo.guid);
        localStorage.setItem(Constants.localstorageKeys.CLIENT_GUID, accountInfo.clientGuid);
        localStorage.setItem(Constants.localstorageKeys.ACCESS_TOKEN, accountInfo.jwt);
        localStorage.setItem(Constants.localstorageKeys.NAME, accountInfo.firstName + ' ' + accountInfo.lastName);
        localStorage.setItem(Constants.localstorageKeys.EMAIL, accountInfo.email);
        localStorage.setItem(Constants.localstorageKeys.EP_USER_ID, accountInfo.epUserId);
        localStorage.setItem(Constants.localstorageKeys.CLIENT_ID, accountInfo.clientId);
        localStorage.setItem(Constants.localstorageKeys.ROLE_ID, accountInfo.roleId);
        localStorage.setItem(Constants.localstorageKeys.IS_INITIAL_LOGIN_COMPLETED, accountInfo.isInitialLoginCompleted);
        localStorage.setItem(Constants.localstorageKeys.ACCOUNT_GUID, accountInfo.accountGuid);
        localStorage.setItem(Constants.localstorageKeys.ACCOUNT_ID, accountInfo.accountId);
        this.sharedService.loggedInUser.next(true);
    }

    changeAccount(id: number, guid: string): Observable<any> {
        return this.httpClient.get<any>(Constants.endPoints.ACCOUNT_CHANGE +
            Constants.symbols.pathVariableSymbol + id + Constants.symbols.pathVariableSymbol + guid);
    }
}
