import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { ReportService } from 'src/app/services/report.service';

import { ClientListModel } from 'src/app/models/client-list.model';

import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit, OnDestroy {
  clientList: Array<ClientListModel>;
  selectedClient;
  private subscription: ISubscription;
  constants = Constants;

  constructor(
    public reportService: ReportService,
    public router: Router
  ) { }

  ngOnInit() {
    const subscription = this.reportService.clientList.subscribe(res => {
      if (res) {
        this.clientList = res;
      }
    });
    this.subscription = subscription;
  }

  selectClient(value: ClientListModel) {
    this.selectedClient = value;
    this.reportService.openClientList.next(false);
    this.reportService.selectedClient.next(this.selectedClient);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
