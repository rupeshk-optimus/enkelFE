import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { Constants } from 'src/app/shared/constants';

@Component({
  selector: 'app-report-navigator',
  templateUrl: './report-navigator.component.html',
  styleUrls: ['./report-navigator.component.scss']
})
export class ReportNavigatorComponent implements OnInit {
  constants = Constants;

  constructor(
    public sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.sharedService.pageHeading.next(Constants.appConstants.REPORTS);
    this.sharedService.imgHeading.next(Constants.appConstants.REPORTS_IMG);
  }

}
