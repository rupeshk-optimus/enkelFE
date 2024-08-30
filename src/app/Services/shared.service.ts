import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MsalService } from '@azure/msal-angular';
import { Constants } from '../shared/constants';
import { RolesEnum } from '../enum/roles.enum';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    title: BehaviorSubject<any> = new BehaviorSubject<any>('');
    backToDashboard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    openOptionsPanel: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    updateSideNav: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    startTour: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    toggleleftSideNav: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    loggedInUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    pageHeading = new BehaviorSubject<string>(Constants.appConstants.WELCOME);
    imgHeading = new BehaviorSubject<string>(Constants.appConstants.DASHBOARD);
    uploadPercent = new BehaviorSubject<any>({fileName : '', percent: ''});
    applyNavCss = false;
    constructor(
        private msalService: MsalService,
        public datepipe: DatePipe,
        public snackBar: MatSnackBar
    ) { }

    logout() {
        this.msalService.logout();
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = Constants.appConstants.ENKEL_URL;
    }

    getRoleIdOfUser() {
        return Number(localStorage.getItem(Constants.localstorageKeys.ROLE_ID));
    }

    getCpUserOnly() {
        return Number(localStorage.getItem(Constants.localstorageKeys.CLIENT_ID));
    }

    isMasterAdmin() {
        return Number(localStorage.getItem(Constants.localstorageKeys.ROLE_ID)) === RolesEnum.User ? true : false;
    }

    isAdmin() {
        return Number(localStorage.getItem(Constants.localstorageKeys.ROLE_ID)) === RolesEnum.User ? true : false;
    }

    isEpUserAsClient() {
        return JSON.parse(localStorage.getItem(Constants.localstorageKeys.EP_USER_ID)) ? true : false;
    }

    modifyDate(date: Date, dateFormat: string) {
        return this.datepipe.transform(date, dateFormat);
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 5000,
            panelClass: 'mail-success'
        });
    }
}
