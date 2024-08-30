import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Constants } from '../shared/constants';

import { AuthService } from './auth.service';
import { RolesEnum } from '../enum/roles.enum';
import { SharedService } from './shared.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuardService {

    constructor(
        public authService: AuthService,
        public router: Router,
        private sharedService: SharedService
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.authService.isAuthenticated()) {
            localStorage.clear();
            this.router.navigate([Constants.navigations.LOGIN], { queryParams: { returnUrl: state.url } });
            return false;
        }
        if (this.authService.isAuthenticated()) {
            const userIsClient = this.sharedService.getCpUserOnly();
            const userRole = this.sharedService.getRoleIdOfUser();
            if (state.url === (Constants.symbols.pathVariableSymbol + Constants.navigations.WELCOME) ||
            state.url === (Constants.symbols.pathVariableSymbol + Constants.navigations.SETTINGS +
                Constants.symbols.pathVariableSymbol + Constants.navigations.ACCOUNT_DETAILS)) {
                return true;
            }
            if (!userIsClient) {
                if (state.url === (Constants.symbols.pathVariableSymbol + Constants.navigations.CSL_CONNECT)) {
                    return false;
                }
                if (userRole === RolesEnum.User) {
                    return true;
                }
            }

            if (userIsClient) {
                if (userRole === RolesEnum.User) {
                    return true;
                }
                if (userRole === RolesEnum.Submitter &&
                    (state.url === (Constants.symbols.pathVariableSymbol + Constants.navigations.FILES) ||
                    state.url === (Constants.symbols.pathVariableSymbol + Constants.navigations.CSL_CONNECT))) {
                    return true;
                }
            }
            return false;
        }
    }
}
