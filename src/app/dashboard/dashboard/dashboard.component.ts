import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

import { Constants } from 'src/app/shared/constants';
import { reportConfig } from 'src/environments/msConfig';

import { ReportModel } from 'src/app/models/report.model';
import { ClientListModel } from 'src/app/models/client-list.model';
import * as ReportEnum from '../../enum/reports.enum';

import { ReportService } from 'src/app/services/report.service';
import { NgxPowerBiService } from 'ngx-powerbi';
import { SharedService } from 'src/app/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  Constants = Constants;
  reportModel: ReportModel;
  clientList: Array<ClientListModel>;
  reportLoadFailed = false;
  dashboardContainer;
  showClients;
  disableLinks = false;
  dashboard;
  private subscription: ISubscription[] = [];
  mailText: string;
  adminMail: string;
  isSuccessLeadMailPresent = false;
  isFullWidth: boolean;
  errGeneralMsg: string;
  errNameValue: string;
  dataReceivedFromServer = false;
  errEmailValue: string;
    constructor(
    public reportService: ReportService,
    public sharedService: SharedService,
    private powerbi: NgxPowerBiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sharedService.pageHeading.next(Constants.appConstants.DASHBOARD);
    this.sharedService.imgHeading.next(Constants.appConstants.DASHBOARD_IMG);
    this.showClients = false;
    this.getDashboardData(localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID));
    // if (JSON.parse(localStorage.getItem(Constants.localstorageKeys.EP_USER_ID))) {
    //   this.getClients();
    // } else {
    //   this.showClients = false;
    //   this.getDashboardData(localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID));
    // }
  }

  // To get the list of clients from server
  // private getClients() {
  //   const subscription = this.reportService.getClients().subscribe(res => {
  //     this.clientList = res.data;
  //     this.showClients = this.clientList.length > 0 ? true : false;
  //     this.reportService.clientList.next(this.clientList);

  //     // Selecting the first client in the list by default
  //     this.reportService.selectedClient.next(this.clientList[0]);
  //     if (this.reportService.selectedClient.value) {
  //       const clientSubscription = this.reportService.selectedClient.subscribe(response => {
  //         this.getDashboardData(response.guid);
  //       });
  //       this.subscription.push(clientSubscription);
  //     }
  //     this.subscription.push(subscription);
  //   });
  // }

  getDashboardData(guid, reportId?) {
    if (guid && reportId && (localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID))) {
      this.disableLinks = false;
    } else {
      this.disableLinks = true;
    }
    this.dashboardContainer = document.getElementById('dashboardContainer') as HTMLElement;
    if (reportId) {
      this.reportModel = new ReportModel();
    }
    const subscription = this.reportService.getReports(ReportEnum.Reports.Dashboard, guid, reportId).subscribe(res => {
      this.reportModel = res;
      this.reportLoadFailed = false;
      if (this.dashboardContainer) {
      this.resetPowerbiContainer();
      }
      // Configuration for report embedding
      const pageViewType = window.innerWidth > 850 ? 'fitToWidth' : 'oneColumn';
      reportConfig.accessToken = this.reportModel.embedToken;
      reportConfig.embedUrl = this.reportModel.embedURL;
      reportConfig.id = this.reportModel.id;
      reportConfig.type = this.reportModel.reportType;
      reportConfig.pageView = pageViewType;
      const report = this.powerbi.embed(this.dashboardContainer, reportConfig);

      // Embedded report events
      report.on('loaded', () => {
        report.off('loaded');
      });
      report.on('tileClicked', (event) => {
        if (this.reportService.selectedClient && this.reportService.selectedClient.value) {
          this.handleTileClick(event, (this.reportService.selectedClient.value.guid));
        } else {
          this.handleTileClick(event, localStorage.getItem('client_guid'));
        }
        report.on('loaded', () => {
          report.off('loaded');
        });
        report.off('tileClicked');
      });
    }, err => {
      this.reportLoadFailed = true;
      if (err.status === Constants.errorCodes.NOT_FOUND) {
        const errorMessage = err.error;
        const lastIndex = errorMessage.lastIndexOf(' ');
        this.adminMail = errorMessage.split(' ').pop();
        if (!this.adminMail) {
          const errMsgs = errorMessage.split('Name');
          this.errGeneralMsg = errMsgs[0];
          this.isSuccessLeadMailPresent = false;
        } else {
          const errMsgs = errorMessage.split('Name');
          this.errGeneralMsg = errMsgs[0];
          const splitByEmail = errMsgs[1].split('Email');
          this.errNameValue = splitByEmail[0];
          this.errEmailValue = splitByEmail[1];
          this.isSuccessLeadMailPresent = true;
        }
        this.mailText = 'mailto:' + this.adminMail;
      } else {
        this.isSuccessLeadMailPresent = false;
        this.errGeneralMsg = err.error;
      }
      this.resetPowerbiContainer();
    });
    this.subscription.push(subscription);
  }

  private resetPowerbiContainer() {
    this.powerbi.reset(this.dashboardContainer);
  }

  // Dashobard tiles click event handler
  private handleTileClick(event, guid) {
    this.isFullWidth = true;
    this.sharedService.title.next(Constants.appConstants.REPORT_DETAILS);
    const eventDetails: any = event.detail;
    // const id = new URL(eventDetails.reportEmbedUrl).searchParams.get('reportId');
    this.getDashboardData(guid, eventDetails.reportEmbedUrl);
  }

  backToDashboard() {
    this.sharedService.title.next(Constants.appConstants.DASHBOARD);
    this.isFullWidth = false;
    this.getDashboardData(localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID));
  }

  ngOnDestroy() {
    this.resetPowerbiContainer();
    this.subscription.forEach(s => {
      s.unsubscribe();
    });
  }

  getClientGuid() {
    if (localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID) === 'null') {
      return true;
    } else {
      return false;
    }
  }
}
