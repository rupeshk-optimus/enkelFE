import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from 'src/app/shared/constants';
import { SharedService } from 'src/app/services/shared.service';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
    Constants = Constants;
    showUserTab = false;
    isEpUserAsClient;

    constructor(
        public router: Router,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        if (this.sharedService.isMasterAdmin() || this.sharedService.isAdmin()) {
            this.showUserTab = true;
        } else {
            this.showUserTab = false;
        }
        this.sharedService.pageHeading.next(Constants.appConstants.USER_SETTINGS);
        this.sharedService.imgHeading.next(Constants.appConstants.USER_IMG);
    }
}
