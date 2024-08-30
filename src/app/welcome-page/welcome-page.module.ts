import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';

import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    { path: '', component: WelcomeComponent }
];

@NgModule({
    declarations: [WelcomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule
    ]
})
export class WelcomePageModule { }
