import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Constants } from 'src/app/shared/constants';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: Constants.navigations.LOGIN, pathMatch: 'full'
  },
  {
    path: Constants.navigations.LOGIN,
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: Constants.navigations.WELCOME,
    loadChildren: './welcome-page/welcome-page.module#WelcomePageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: Constants.navigations.REPORTS,
    loadChildren: './reports/reports.module#ReportsModule',
    canActivate: [AuthGuardService]

  },
  {
    path: Constants.navigations.FILES,
    loadChildren: './file-uploader/file-uploader.module#FileUploaderModule',
    canActivate: [AuthGuardService]
  },
  {
    path: Constants.navigations.DASHBOARD,
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuardService]
  },
  {
    path: Constants.navigations.SETTINGS,
    loadChildren: './user-settings/settings.module#SettingsModule',
    canActivate: [AuthGuardService]
  },
  {
    path: Constants.navigations.CSL_CONNECT,
    loadChildren: './csl-connect/csl-connect.module#CSLConnectModule',
    canActivate: [AuthGuardService]
  },
  {
    path: Constants.navigations.SUPPORT,
    loadChildren: './support/support.module#SupportModule',
    canActivate: [AuthGuardService]
  },
  {
    path: Constants.navigations.WORK_ITEM,
    loadChildren: './task-management/task-management.module#TaskManagementModule',
    canActivate: [AuthGuardService]
  },
  {
    path: Constants.navigations.USER_GUIDE,
    loadChildren: './help-section/help-section.module#HelpSectionModule',
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
