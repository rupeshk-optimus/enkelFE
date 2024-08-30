import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { CslConnectMailBoxComponent } from './csl-connect-mail-box/csl-connect-mail-box.component';

import { SharedModule } from '../shared/shared.module';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: CslConnectMailBoxComponent,
    canActivate: [AuthGuardService]
  },
];

@NgModule({
  declarations: [CslConnectMailBoxComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CSLConnectModule { }
