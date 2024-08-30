import { Component, OnInit } from '@angular/core';

import { SharedService } from 'src/app/services/shared.service';
import { ConnectToCslService } from 'src/app/services/connect-to-csl.service';

import { Constants } from 'src/app/shared/constants';
import { UserAccountModel } from 'src/app/models/user-account.model';

@Component({
  selector: 'app-csl-connect-mail-box',
  templateUrl: './csl-connect-mail-box.component.html',
  styleUrls: ['./csl-connect-mail-box.component.scss']
})
export class CslConnectMailBoxComponent implements OnInit {
  cslDetails: UserAccountModel;
  showMailComponent = false;
  errorMeassage = '';

  constructor(
    public sharedService: SharedService,
    private connectToCslService: ConnectToCslService
  ) { }

  ngOnInit() {
    this.sharedService.pageHeading.next(Constants.appConstants.CSL_CONNECT);
    this.sharedService.imgHeading.next(Constants.appConstants.CSL_IMG);
    this.getCslInformation();
  }

  getCslInformation() {
    this.connectToCslService.getCslInfo().subscribe( data => {
      this.cslDetails = data;
      this.showMailComponent = true;
    },
    err => {
      this.errorMeassage = err.error;
    });
  }

}
