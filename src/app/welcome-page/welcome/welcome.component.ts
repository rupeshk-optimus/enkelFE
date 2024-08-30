import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { WelcomePageService } from 'src/app/services/welcome-page.service';
import { SharedService } from 'src/app/services/shared.service';

import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

import { Constants } from 'src/app/shared/constants';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
    public response = {};
    index = 0;
    timer;
    changingText = '';
    userName: string;

    constructor(
        public dialog: MatDialog,
        public sharedService: SharedService
    ) { }

    ngOnInit() {
        this.userName = localStorage.getItem(Constants.localstorageKeys.NAME);
        const isInitialLoginCompleted = JSON.parse(localStorage.getItem(Constants.localstorageKeys.IS_INITIAL_LOGIN_COMPLETED));
        const name = localStorage.getItem(Constants.localstorageKeys.NAME);
        if (!isInitialLoginCompleted) {
            this.openWelcomeDialogBox(name);
        }
        this.sharedService.pageHeading.next(Constants.appConstants.WELCOME);
    }

    openWelcomeDialogBox(name: string) {
        this.dialog.open(DialogComponent, {
            width: Constants.DialogConstants.DEFAULT_WIDTH,
            data: {
                name
            }
        }).componentInstance.submitClicked.subscribe((data) => {
            if (!data) {
            this.resetPasswordPromptForFirstSignIn();
            }
            this.sharedService.startTour.next(data);
        });
    }

    resetPasswordPromptForFirstSignIn() {
        this.dialog.open(DialogComponent, {
            disableClose: true,
            width: Constants.DialogConstants.DEFAULT_WIDTH,
            data: {
                passwordReset: true
            }
        });
    }

}
