import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { UserGuideComponent } from './user-guide/user-guide.component';

const routes: Routes = [
  { path: '', component: UserGuideComponent }
];

@NgModule({
  declarations: [UserGuideComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HelpSectionModule { }
