import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ReportService } from 'src/app/services/report.service';
import { NgxPowerBiService } from 'ngx-powerbi';

import { ReportModel } from 'src/app/models/report.model';
import { ClientListModel } from 'src/app/models/client-list.model';

import { Constants } from 'src/app/shared/constants';
import { reportConfig } from 'src/environments/msConfig';
import { SharedService } from 'src/app/services/shared.service';
import { ISubscription } from 'rxjs/Subscription';
// import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs-compat/operator/filter';


@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
    reportTabs = Constants.appConstants.REPORT_TABS;
    selected = new FormControl(0);
    reportModel: ReportModel;
    clientList: Array<ClientListModel>;
    reportLoadFailed = false;
    showClients;
    reportContainer;
    disableLinks = false;
    private subscription: ISubscription[] = [];
    constants = Constants;

    constructor(
        public reportService: ReportService,
        private powerbi: NgxPowerBiService,
        public sharedService: SharedService,
        public router: Router
    ) {
        router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            if (event.url === '/reports/report-sheet-income' || event.url === '/reports/report-sheet-balance') {
                const RouteId = (event.url === '/reports/report-sheet-income') ? 0 : 1;
                this.handleReportRoute(RouteId);
            }
        });
     }

    ngOnInit() {
        this.showClients = false;
        this.getReportsData(localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID));
        this.sharedService.pageHeading.next(Constants.appConstants.REPORTS);
        this.sharedService.imgHeading.next(Constants.appConstants.REPORTS_IMG);
    }

    handleReportRoute(index) {
        this.selected.setValue(index);
        this.getReportsData(
            (localStorage.getItem(Constants.localstorageKeys.EP_USER_ID) &&
            localStorage.getItem(Constants.localstorageKeys.EP_USER_ID) !== '0') ?
            this.reportService.selectedClient.value.guid :
            localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID)
        );
    }

    getReportsData(guid, reportId?) {
        this.disableLinks = true;
        if (reportId) {
            this.reportModel = new ReportModel();
        }
        const subscription = this.reportService.getReports(this.selected.value + 2, guid, reportId).subscribe(res => {
            this.reportModel = res;
            this.reportLoadFailed = false;
            if (this.reportContainer) {
                this.resetPowerbiContainer();
            }
            this.reportContainer = document.getElementById('reportContainer') as HTMLElement;
            const pageViewType = window.innerWidth > 850 ? 'fitToWidth' : 'oneColumn';
            reportConfig.accessToken = this.reportModel.embedToken;
            reportConfig.embedUrl = this.reportModel.embedURL;
            reportConfig.id = this.reportModel.id;
            reportConfig.type = this.reportModel.reportType;
            reportConfig.pageView = pageViewType;
            const report = this.powerbi.embed(this.reportContainer, reportConfig);
            report.on('loaded', () => {
                this.disableLinks = false;
                report.off('loaded');
            });
        }, err => {
            this.reportLoadFailed = true;
            this.disableLinks = false;
            this.resetPowerbiContainer();
        });
        this.subscription.push(subscription);
    }

    resetPowerbiContainer() {
        this.powerbi.reset(this.reportContainer);
    }

    selectClient(value) {
        this.reportService.selectedClient.next(value);
        this.getReportsData(this.reportService.selectedClient.value.guid);
    }

    ngOnDestroy() {
        this.resetPowerbiContainer();
        this.subscription.forEach(s => {
            s.unsubscribe();
        });
    }
}
