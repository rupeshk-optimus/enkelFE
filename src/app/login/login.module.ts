import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BroadcastService } from '@azure/msal-angular';

import { LoginComponent } from './login/login.component';

import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    { path: '', component: LoginComponent }
];

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    providers: [BroadcastService]
})

export class LoginModule { }
