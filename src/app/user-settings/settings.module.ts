import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { Constants } from '../shared/constants';
import { SharedModule } from '../shared/shared.module';

import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserAccountComponent } from './user-settings/user-account/user-account.component';
import { PortalUsersComponent } from './user-settings/portal-users/portal-users.component';
import { AddNewUserComponent } from './user-settings/portal-users/add-new-user/add-new-user.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { UiSwitchModule } from 'ngx-toggle-switch';

const routes: Routes = [
    {
        path: '',
        component: UserSettingsComponent,
        children: [
            { path: Constants.navigations.ACCOUNT_DETAILS, component: UserAccountComponent, },
            {
                path: Constants.navigations.USERS, component: PortalUsersComponent,
                canActivate: [AuthGuardService]
            },
            { path: '', redirectTo: Constants.navigations.ACCOUNT_DETAILS, pathMatch: 'full' },
        ]
    }
];

@NgModule({
    declarations: [UserSettingsComponent, UserAccountComponent, PortalUsersComponent, AddNewUserComponent],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        UiSwitchModule,
        RouterModule.forChild(routes),
    ],
})
export class SettingsModule { }
