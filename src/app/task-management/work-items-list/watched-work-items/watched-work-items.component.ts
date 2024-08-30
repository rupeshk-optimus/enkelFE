import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';

import { WorkItemTypeEnum } from 'src/app/enum/work-item-type.enum';
import { PaginationModel } from 'src/app/models/pagination.model';
import { WorkItemFilterModel } from 'src/app/models/work-item-filter-model';
import { TaskManagementService } from 'src/app/services/task-management.service';
import { Constants } from 'src/app/shared/constants';
import { SharedService } from 'src/app/services/shared.service';
import { AddWorkItemsService } from '../../add-work-items/add-work-items.service';

@Component({
    selector: 'app-watched-work-items',
    templateUrl: './watched-work-items.component.html',
    styleUrls: ['./watched-work-items.component.scss']
})
export class WatchedWorkItemsComponent implements OnInit {
    tableHeader = ['Name', 'Assigned To', 'State', 'Due Date', 'Updated', ''];
    Constants = Constants;
    filterWorkItemForm: FormGroup;
    workItemType = [];
    workItems = [];
    workItemFilters: WorkItemFilterModel;
    paginationTools = new PaginationModel();
    totalPages = [];
    workItemStatus = Constants.workListStatus;

    constructor(
        private fb: FormBuilder,
        private sharedService: SharedService,
        private addWorkItemsService: AddWorkItemsService,
        private taskManagementService: TaskManagementService,
        private router: Router
    ) { }

    ngOnInit() {
        this.createWorkItemFilterForm();
        this.getWorkItemListForLoggedInUser();
        const workItemTypesArray = Object.keys(WorkItemTypeEnum).map(key => ({ name: WorkItemTypeEnum[key], id: +key }));
        this.workItemType = workItemTypesArray.slice(0, workItemTypesArray.length / 2);
        this.workItemType.forEach(type => {
            type.name = type.name.replace(/([A-Z])/g, ' $1').trim();
        });
        Observable.combineLatest(
            this.filterWorkItemForm.controls.searchWorkItem.valueChanges.debounceTime(1000).startWith(''),
            this.filterWorkItemForm.controls.workItemStatus.valueChanges.startWith(''),
            this.filterWorkItemForm.controls.workItemType.valueChanges.startWith(''),
            this.filterWorkItemForm.controls.workItemUpdatedAt.valueChanges.startWith(''),
            (searchWorkItem, workItemStatus, workItemType, workItemUpdatedAt) => ({
                searchWorkItem, workItemStatus, workItemType, workItemUpdatedAt
            })
        ).subscribe(criteria => {
            if (criteria) {
                this.workItemFilters = this.assignFiltersToFilterObject(criteria);
                this.getWorkItemListForLoggedInUser();
            }
        });
    }

    /**
     * @description Creates work item filter form
     */
    createWorkItemFilterForm() {
        this.filterWorkItemForm = this.fb.group({
            workItemStatus: '',
            workItemType: '',
            workItemUpdatedAt: '',
            searchWorkItem: ''
        });
    }

    /**
     * @description Gets all work item list
     */
    getWorkItemListForLoggedInUser() {
        const pageEvent = new PageEvent();
        pageEvent.pageIndex = 0;
        pageEvent.pageSize = 25;
        this.taskManagementService.getWorkItemsForUser(true, this.workItemFilters, pageEvent).subscribe(workItems => {
            this.setWorkItemListDataSource(workItems);
            this.addWorkItemsService.updateWorkItemMetaData.next(true);
        });
    }

    /**
     * @description Sets work item list data source
     * @param workItems from the server
     */
    private setWorkItemListDataSource(workItems: PaginationModel) {
        workItems.data.map(workItem => {
            workItem.iconColor = Constants.workItemType.find(type => type.id === workItem.workItemTypeId).color;
            if (workItem.workItemStatusId) {
                workItem.state = Constants.workListStatus.find(status => status.value === workItem.workItemStatusId).viewValue;
                workItem.color = Constants.workListStatus.find(status => status.value === workItem.workItemStatusId).color;
            }
            if (workItem.workItemWatchers) {
                workItem.allowWatchItem = (workItem.workItemWatchers.find(watcher =>
                    watcher.cpUserId === +localStorage.getItem(Constants.localStorageData.ID))) ? false : true;
            }
        });
        this.workItems = workItems.data;
        this.paginationTools.hasNext = workItems.hasNext;
        this.paginationTools.currentPage = workItems.currentPage;
        this.paginationTools.hasPrevious = workItems.hasPrevious;
        this.paginationTools.totalCount = workItems.totalCount;
        this.paginationTools.totalPages = workItems.totalPages;
        this.totalPages = Array(this.paginationTools.totalPages + 1).fill(0).map((x, i) => i);
        this.totalPages.shift();
    }

    /**
     * @description Gets next
     * @param pageNumber contains the pagination pageNumber
     */
    getNext(pageNumber: number) {
        const pageEvent = new PageEvent();
        pageEvent.pageIndex = pageNumber;
        pageEvent.pageSize = 25;
        this.taskManagementService.getWorkItemsForUser(false, this.workItemFilters, pageEvent).subscribe(supportTickets => {
            this.setWorkItemListDataSource(supportTickets);
        });
    }

    /**
     * @description Assigns filters to filter object
     * @returns  work item filter object
     */
    assignFiltersToFilterObject(filters) {
        const formValue = filters;
        const workItemFilter = new WorkItemFilterModel();
        workItemFilter.workItemStatusId = formValue.workItemStatus;
        workItemFilter.workItemTypeId = formValue.workItemType;
        workItemFilter.statusId = formValue.workItemTemplateStatus;
        workItemFilter.searchKeyWord = formValue.searchWorkItem;
        if (formValue.workItemUpdatedAt) {
            workItemFilter.updatedAt = new Date(formValue.workItemUpdatedAt).toDateString();
        }

        return workItemFilter;
    }

    resetFilter() {
        this.filterWorkItemForm.reset();
        this.workItemFilters = new WorkItemFilterModel();
        this.getWorkItemListForLoggedInUser();
    }

    /**
     * @description Copys work item link
     * @param element to be copied
     */
    copyWorkItemLink(element) {
        const parentId = element.parentWorkItemGuid ? element.parentWorkItemGuid : 0;
        // tslint:disable-next-line: max-line-length
        const urlElement = `${document.location.origin}/work-list/${element.workItemTypeId}/${parentId}/${element.guid}/${element.id}/edit`;
        const fullLink = document.createElement('input');
        const { LINK_COPIED, SUCCESS } = Constants.notifications;

        document.body.appendChild(fullLink);
        fullLink.value = urlElement;
        fullLink.select();
        document.execCommand('copy', false);
        fullLink.remove();
        this.sharedService.openSnackBar(
            LINK_COPIED, SUCCESS
        );
    }

    /**
     * @description Edits work item
     * @param element to be edited
     */
    editWorkItem(element) {
        const { WORK_ITEM, EDIT } = Constants.navigations;
        this.router.navigate([WORK_ITEM, element.workItemTypeId,
            (element.parentWorkItemGuid) ? element.parentWorkItemGuid : 0,
            element.guid, element.id, EDIT]);
    }

    unWatchWorkItem(element) {
        const { UPDATE_SUCCESS, SUCCESS } = Constants.notifications;
        const watcherToBeRemoved = element.workItemWatchers.find(
            watcher => watcher.cpUserId === +localStorage.getItem(Constants.localStorageData.ID));
        const { id, guid } = watcherToBeRemoved;
        this.taskManagementService.deleteWorkItemWatcher(id, guid).subscribe(watchersUpdated => {
            this.getWorkItemListForLoggedInUser();
            this.sharedService.openSnackBar(
                UPDATE_SUCCESS, SUCCESS
            );
        });
    }
}
