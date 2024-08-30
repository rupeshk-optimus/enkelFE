import { Component, OnInit } from '@angular/core';

import { JoyrideService } from 'ngx-joyride';

import { Constants } from 'src/app/shared/constants';
import { SharedService } from 'src/app/services/shared.service';
import { RolesEnum } from 'src/app/enum/roles.enum';
import { CpUserService } from 'src/app/services/cp-user.service';
import { ClientListModel } from 'src/app/models/client-list.model';
import { AccountSettingsService } from 'src/app/services/account-settings.service';
import { CpUserAccountModel } from 'src/app/models/cp-user-account.model';
import { LoginService } from 'src/app/services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SupportService } from 'src/app/services/support.service';
import { SupportTicketMetaDataModel } from 'src/app/models/support-ticket-metadata.model';
import { TaskManagementService } from 'src/app/services/task-management.service';

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
    Constants = Constants;
    showMenu: boolean;
    loggedInUserRole;
    isEpUser = false;
    showDashBoardTab = false;
    showReportsTab = false;
    showFilesTab = false;
    showMailsTab = false;
    accounts: Array<CpUserAccountModel>;
    currentAccount: CpUserAccountModel;
    tourSteps: Array<string>;
    supportTicketMetaData: SupportTicketMetaDataModel;
    workItemMetaData: number;

    constructor(
        private joyride: JoyrideService,
        private accountSettingsService: AccountSettingsService,
        private sharedService: SharedService,
        private loginService: LoginService,
        private router: Router,
        private taskManagementService: TaskManagementService,
        private supportService: SupportService
    ) { }

    ngOnInit() {
        this.loggedInUserRole = Number.parseInt(localStorage.getItem(Constants.localstorageKeys.ROLE_ID), 10);
        this.showMailsTab = Number.parseInt(localStorage.getItem(Constants.localstorageKeys.EP_USER_ID), 10) ? false : true;
        this.tourSteps = [
            Constants.StartTour.FIRST_STEP,
            Constants.StartTour.SECOND_STEP,
            Constants.StartTour.THIRD_STEP,
            Constants.StartTour.FOURTH_STEP,
            Constants.StartTour.FIFTH_STEP,
            // TO_DO
            Constants.StartTour.SIXTH_STEP,
            Constants.StartTour.SEVENTH_STEP,
            Constants.StartTour.EIGHTH_STEP,
        ];
        this.getAccountDetails();
        this.getSupportTicketMetaData();
        this.getMetaDataForWorkItems();
        this.allowRoleBasedAccess(this.loggedInUserRole);
        this.sharedService.startTour.subscribe(data => {
            if (data) {
                this.tour();
            }
        });
        this.sharedService.toggleleftSideNav.subscribe(data => {
            this.showMenu = data;
        });
        this.sharedService.updateSideNav.subscribe(value => {
            if (value) {
                this.getSupportTicketMetaData();
                this.getMetaDataForWorkItems();
                this.sharedService.updateSideNav.next(false);
            }
        });
    }

    allowRoleBasedAccess(roleID) {
        if (roleID === RolesEnum.Submitter) {
            this.showDashBoardTab = false;
            this.showReportsTab = false;
            this.showFilesTab = true;
            this.tourSteps.splice(1, 2);
        }
        if (roleID === RolesEnum.User) {
            this.showDashBoardTab = true;
            this.showReportsTab = true;
            this.showFilesTab = true;
        }
    }

    tour() {
        this.joyride.startTour(
            {
                steps: this.tourSteps
            }
        );
    }

    getAccountDetails() {
        this.accountSettingsService.getAccountDetails().subscribe(contact => {
            this.accounts = contact.cpUserAccounts;
            this.currentAccount = this.accounts.find(account =>
                 account.id === +localStorage.getItem(Constants.localstorageKeys.ACCOUNT_ID));
        });
    }

    changeAccount() {
        const {id, guid} = {...this.currentAccount};
        this.loginService.changeAccount(id, guid).subscribe( accountInfo => {
            this.loginService.setUserDetails(accountInfo);
            this.loggedInUserRole = Number.parseInt(localStorage.getItem(Constants.localstorageKeys.ROLE_ID), 10);
            this.router.navigate([Constants.navigations.WELCOME]);
            this.allowRoleBasedAccess(this.loggedInUserRole);
            // window.location.reload();
        });
    }

    closeLeftSideNav() {
        if (window.innerWidth < 768 ) {
            this.sharedService.toggleleftSideNav.next(false);
        }
    }

    /**
     * @description Gets support ticket meta data by id
     */
    getSupportTicketMetaData() {
        this.supportService.getMetaDataForSupportTicket()
            .subscribe(metaData => {
                this.supportTicketMetaData = metaData;
            });
    }

    getMetaDataForWorkItems() {
        this.taskManagementService.getMetaDataForWorkItem().subscribe(metaData => {
            this.workItemMetaData = metaData.totalAssignedActive + metaData.totalWatchedActive;
        });
    }
}
