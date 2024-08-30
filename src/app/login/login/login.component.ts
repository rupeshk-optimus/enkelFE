import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { tenantConfig, forgotPasswordAuthority, loginAuthority } from '../../../environments/msConfig';

import { Constants } from 'src/app/shared/constants';

import { MsalService, BroadcastService } from '@azure/msal-angular';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    Constants = Constants;
    loginInProgress = false;
    returnUrl: string;

    constructor(
        public msalService: MsalService,
        private broadcastService: BroadcastService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private sharedService: SharedService,
        private loginService: LoginService
    ) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams.returnUrl || Constants.navigations.WELCOME;
        if (this.authService.isAuthenticated()) {
            this.router.navigateByUrl(this.returnUrl);
        } else {
            this.employeeToClientPortalLogin();
            this.msalLoginFailure();
            this.msalLoginSuccess();
            this.msalTokenAcquireSuccess();
            this.msalTokenAcquireFailure();
        }
    }

    employeeToClientPortalLogin() {
        const currentURL = new URL(window.location.href);
        const oktaToken = currentURL.searchParams.get('token');
        const clientGuid = currentURL.searchParams.get('clientGuid');
        if (oktaToken) {
            this.loginInProgress = true;
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem(Constants.localstorageKeys.EP_USER_AS_CLIENT, 'true');
            this.getUserDetails(oktaToken, clientGuid);
            // this.loginService.getUserDetails(oktaToken, this.returnUrl, clientGuid);
            this.loginInProgress = false;
        }
    }

    msalLoginFailure() {
        this.subscription = this.broadcastService.subscribe(Constants.msal.LOGIN_FAILURE, (payload) => {
            if (payload.errorDesc.includes(Constants.loginConstants.FORGOT_PASSWORD_ERROR_CODE)) {
                this.forgotPassword();
            } else if (payload.error.includes(Constants.loginConstants.CLOSED_POPUP)) {
                this.msalService.authority = loginAuthority;
                this.loginInProgress = false;
            }
        });
    }

    msalLoginSuccess() {
        this.subscription = this.broadcastService.subscribe(Constants.msal.LOGIN_SUCCESS, (payload) => {
            this.getToken();
        });
    }

    msalTokenAcquireSuccess() {
        this.subscription = this.broadcastService.subscribe(Constants.msal.GET_TOKEN_SUCCESS, (payload) => {
            this.getUserDetails(payload.token);
            // this.loginInProgress = false;
        });
    }

    msalTokenAcquireFailure() {
        this.subscription = this.broadcastService.subscribe(Constants.msal.GET_TOKEN_FAILURE, (payload) => {
            this.loginToPortal();
            this.loginInProgress = false;
        });
    }

    getUserDetails(token, guid?: string) {
        this.authService.getUserDetails(token, guid).subscribe(res => {
            this.loginService.setUserDetails(res);
            this.router.navigateByUrl(this.returnUrl);
            this.sharedService.loggedInUser.next(true);
            this.loginInProgress = false;
        }, errorResponse => {
            this.loginInProgress = false;
            localStorage.removeItem(Constants.localstorageKeys.EP_USER_AS_CLIENT);
        });
    }

    loginToPortal() {
        localStorage.removeItem(Constants.localstorageKeys.EP_USER_AS_CLIENT);
        this.msalService.loginPopup(tenantConfig.scopes);
        this.loginInProgress = true;
    }

    forgotPassword() {
        this.msalService.authority = forgotPasswordAuthority;
        this.msalService.loginRedirect(tenantConfig.scopes);
    }

    getToken() {
        this.msalService.acquireTokenSilent(tenantConfig.scopes);
    }

    ngOnDestroy() {
        this.broadcastService.getMSALSubject().next('');
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
