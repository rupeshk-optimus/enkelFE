import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AvatarModule } from 'ngx-avatar';

import { SharedModule } from '../shared/shared.module';

import { SupportTicketListComponent } from './support-ticket-list/support-ticket-list.component';
import { SupportTicketDetailComponent } from './support-ticket-detail/support-ticket-detail.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketComponent } from './support-ticket-detail/ticket/ticket.component';
import { TicketAttachmentsComponent } from './support-ticket-detail/ticket-attachments/ticket-attachments.component';
import { TicketResponseComponent } from './support-ticket-detail/ticket-response/ticket-response.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

const routes: Routes = [
    { path: '', component: SupportTicketListComponent },
    { path: ':guid/:id/edit', component: SupportTicketDetailComponent },
];

@NgModule({
    declarations: [
        SupportTicketListComponent,
        SupportTicketDetailComponent,
        TicketComponent,
        TicketAttachmentsComponent,
        TicketResponseComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SharedModule,
        MaterialModule,
        AvatarModule,
        AngularEditorModule
    ]
})
export class SupportModule { }
