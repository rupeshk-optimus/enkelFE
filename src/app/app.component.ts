import { Component, OnInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';

import { Constants } from 'src/app/shared/constants';

import * as signalR from '@aspnet/signalr';

import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { RolesEnum } from './enum/roles.enum';
import { filter } from 'rxjs/operators';
import { DialogComponent } from './shared/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { LoggingService } from './services/logging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentChecked, OnInit {
    Constants = Constants;
    title = Constants.appConstants.APP_NAME;
    connection;
    toggleLeftSideButton = false;
    toggleRightSideButton = false;
    verifiedUser = '';
    currentPageHeading = '';
    imgSrc = '';
    hubConnection: any;
    cpUserOnly;
    backgroundImage = Constants.appConstants.LOGIN_BACKGROUND_IMG;
    mainWidth: boolean;

    constructor(
        private authService: AuthService,
        private sharedService: SharedService,
        private router: Router,
        public dialog: MatDialog,
        private cdref: ChangeDetectorRef,
        private loggingService: LoggingService,
    ) {
        router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            if (event.url.includes('/login') || event.urlAfterRedirects === '/login') {
                this.backgroundImage = Constants.appConstants.LOGIN_BACKGROUND_IMG;
            } else {
                this.backgroundImage = Constants.appConstants.HOME_BACKGROUND_IMG;
                this.mainWidth = event.url.includes('/welcome') ? true : false;
            }
        });
     }

    ngOnInit() {
        this.sharedService.loggedInUser.subscribe(data => {
            if (data) {
                const initialsOnLogIn = localStorage.getItem(Constants.localstorageKeys.NAME).split(' ');
                this.verifiedUser = initialsOnLogIn[0].charAt(0) + initialsOnLogIn[initialsOnLogIn.length - 1].charAt(0);
                this.signalRConnectionEstablish();
            }
        });
        this.sharedService.pageHeading.subscribe(heading => {
            this.currentPageHeading = heading;
        });
        this.sharedService.imgHeading.subscribe(img => {
            this.imgSrc = img;
        });
        this.cpUserOnly = this.sharedService.getCpUserOnly();
        const initials = localStorage.getItem(Constants.localstorageKeys.NAME).split(' ');
        this.verifiedUser = initials[0].charAt(0) + initials[initials.length - 1].charAt(0);
        this.signalRConnectionEstablish();
    }

    // SignalR functionality

    signalRConnectionEstablish() {
        this.connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(environment.serverBaseUrl + 'notifications?accessToken=' + localStorage.getItem('token'), {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();
        this.connect();
    }

    public connect() {
        this.connection.start().catch(err => console.log(err));
        this.connection.on('ReceiveFileUploadedPercentage', (fileName, percentage) => {
            console.log('CONNECTED', fileName, percentage);
            if (percentage.includes('CSL') && this.cpUserOnly) {
                this.sharedService.openSnackBar(
                    percentage, Constants.notifications.SUCCESS
                );
            }
            if (!percentage.includes('CSL')) {
                this.sharedService.uploadPercent.next({ fileName, percentage });
            }
        }, err => {
            console.log(err);
        });
    }

    public disconnect() {
        this.connection.stop();
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    isLoggedIn() {
        return this.authService.isAuthenticated();
    }

    toggleLeftSideNav() {
        this.toggleLeftSideButton = !this.toggleLeftSideButton;
        this.sharedService.toggleleftSideNav.next(this.toggleLeftSideButton);
        if ((this.toggleRightSideButton) && (this.toggleRightSideButton)) {
            this.toggleRightSideButton = false;
        }
    }

    toggleRightSideNav() {
        this.toggleRightSideButton = !this.toggleRightSideButton;
        this.toggleLeftSideButton = false;
        this.sharedService.toggleleftSideNav.next(false);
    }

    logOut() {
        this.sharedService.logout();
        this.disconnect();
    }

    onDone() {
        this.dialog.open(DialogComponent, {
            disableClose: true,
            width: Constants.DialogConstants.DEFAULT_WIDTH,
            data: {
                passwordReset: true
            }
        });
    }

    openArtifact() {
        const url = 'https://enkelconnectwp.azurewebsites.net/?page_id=8';
        window.open(url, Constants.WindowActions.blank);
    }
}


