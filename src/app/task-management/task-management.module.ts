import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AvatarModule } from 'ngx-avatar';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { WorkItemsListComponent } from './work-items-list/work-items-list.component';
import { WatchedWorkItemsComponent } from './work-items-list/watched-work-items/watched-work-items.component';
import { UserWorkItemsComponent } from './work-items-list/user-work-items/user-work-items.component';
import { AddWorkItemsComponent } from './add-work-items/add-work-items.component';
import { WorkItemDetailsComponent } from './add-work-items/work-item-details/work-item-details.component';
import { WorkItemCommentsComponent } from './add-work-items/work-item-comments/work-item-comments.component';
import { WorkItemAttachmentsComponent } from './add-work-items/work-item-attachments/work-item-attachments.component';
import { WorkItemChildrenComponent } from './add-work-items/work-item-children/work-item-children.component';

const routes: Routes = [
    {
        path: '', component: WorkItemsListComponent,
        children: [
            {
                path: '',
                redirectTo: 'my-work-items',
                pathMatch: 'full'
            },
            {
                path: 'my-work-items',
                component: UserWorkItemsComponent
            },
            {
                path: 'watched-work-items',
                component: WatchedWorkItemsComponent
            }
        ]
    },
    { path: ':workItemType/:parentWorkItemGuid/:guid/:id/edit', component: AddWorkItemsComponent },
];

@NgModule({
    declarations: [
        WorkItemsListComponent,
        WatchedWorkItemsComponent,
        UserWorkItemsComponent,
        AddWorkItemsComponent,
        WorkItemDetailsComponent,
        WorkItemCommentsComponent,
        WorkItemAttachmentsComponent,
        WorkItemChildrenComponent
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
export class TaskManagementModule { }
