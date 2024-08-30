import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SharedService } from 'src/app/services/shared.service';
import { TaskManagementService } from 'src/app/services/task-management.service';
import { Constants } from 'src/app/shared/constants';
import { AddWorkItemsService } from '../add-work-items/add-work-items.service';

@Component({
    selector: 'app-work-items-list',
    templateUrl: './work-items-list.component.html',
    styleUrls: ['./work-items-list.component.scss']
})
export class WorkItemsListComponent implements OnInit, OnDestroy {
    Constants = Constants;
    workItemMetaData;
    protected onDestroy = new Subject<boolean>();

    constructor(
        public sharedService: SharedService,
        private addWorkItemsService: AddWorkItemsService,
        private taskManagementService: TaskManagementService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.sharedService.pageHeading.next(Constants.appConstants.WORK_ITEM);
        this.sharedService.imgHeading.next(Constants.appConstants.WORK_ITEM_IMG);
        // this.getMetaDataForWorkItems();

        this.addWorkItemsService.updateWorkItemMetaData.pipe(takeUntil(this.onDestroy)).subscribe(value => {
            if (value) {
                this.getMetaDataForWorkItems();
                this.addWorkItemsService.updateWorkItemMetaData.next(false);
            }
        });
    }

    getMetaDataForWorkItems() {
        this.sharedService.updateSideNav.next(true);
        this.taskManagementService.getMetaDataForWorkItem().subscribe(metaData => {
            this.workItemMetaData = metaData;
        });
    }

    ngOnDestroy() {
        this.onDestroy.next(false);
        // localStorage.removeItem(Constants.localStorageData.WORK_ITEM_TEMPLATE);
        // localStorage.removeItem(Constants.localStorageData.WORK_ITEM_EXISTING_TEMPLATE);
        // localStorage.removeItem(Constants.localStorageData.WORK_ITEM_FROM_SUPPORT_TICKET);
        // this.addWorkItemsService.workItemTemplateToBeFilled.next(null);
    }

}
