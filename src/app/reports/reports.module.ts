import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ReportComponent } from './report/report.component';
import { ReportUploadComponent } from './report-upload/report-upload.component';

import { SharedModule } from '../shared/shared.module';

import { Constants } from '../shared/constants';
import { ReportNavigatorComponent } from './report-navigator/report-navigator.component';

const routes: Routes = [
  { path: '', component: ReportNavigatorComponent,
  children: [
      { path: '', redirectTo: Constants.navigations.REPORT_UPLOAD, pathMatch: 'full' },
      { path: Constants.navigations.REPORT_UPLOAD, component: ReportUploadComponent }
  ] },
  { path: Constants.navigations.REPORT_UPLOAD, component: ReportUploadComponent}
];

@NgModule({
  declarations: [ReportComponent, ReportUploadComponent, ReportNavigatorComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ReportsModule { }
