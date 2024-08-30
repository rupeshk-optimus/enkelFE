import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WorkItemModel } from 'src/app/models/work-item.model';
import { SharedService } from 'src/app/services/shared.service';
import { TaskManagementService } from 'src/app/services/task-management.service';
import { Constants } from 'src/app/shared/constants';
import { AddWorkItemsService } from '../add-work-items.service';

@Component({
    selector: 'app-work-item-details',
    templateUrl: './work-item-details.component.html',
    styleUrls: ['./work-item-details.component.scss']
})
export class WorkItemDetailsComponent implements OnInit, OnDestroy {
    workItemForm: FormGroup;
    currentWorkItemId: string;
    currentWorkItemGuid: string;
    workItemStatusColor: string;
    workItemStatusViewValue: string;
    workItemPriorityColor: string;
    watchers = [];
    showWatchButton = true;
    workItemStatusList = Constants.workListStatus;
    protected onDestroy = new Subject<boolean>();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private addWorkItemsService: AddWorkItemsService,
        private sharedService: SharedService,
        private taskManagementService: TaskManagementService,
    ) { }

    ngOnInit() {
        this.createWorkItemForm();
        this.addWorkItemsService.currentWorkItemId.subscribe(id => this.currentWorkItemId = id);
        this.addWorkItemsService.currentWorkItemGuid.subscribe(guid => this.currentWorkItemGuid = guid);
        this.getWorkItemById();
        this.getWatchers();
        this.workItemForm.controls.workItemStatus.valueChanges.subscribe(value => {
            this.workItemStatusColor = Constants.workListStatus.find(status => status.value === value).color;
            this.workItemStatusViewValue = Constants.workListStatus.find(status => status.value === value).viewValue;
        });
        this.addWorkItemsService.saveWorkItem.pipe(takeUntil(this.onDestroy)).subscribe(saveWorkItem => {
            if (saveWorkItem) {
                this.updateStatusOfWorkItem();
            }
        });
    }

    /**
     * @description Gets work item by id
     * @param workItemId of the work item to be fetched
     * @param workItemGuid of the work item to be fetched
     * @returns work item by id from the server
     */
    getWorkItemById() {
        this.taskManagementService.getWorkItemById(+this.currentWorkItemId, this.currentWorkItemGuid).subscribe(workItem => {
            this.setWorkItemDetails(workItem);
        });
    }

    /**
     * @description Gets watchers for a work item
     */
    getWatchers() {
        this.taskManagementService.getWatchersForWorkItem(+this.currentWorkItemId, this.currentWorkItemGuid).subscribe(watchers => {
            this.showWatchButton =
                !watchers.data.find(watcher => watcher.cpUserId === +localStorage.getItem(Constants.localStorageData.ID));
            this.watchers = watchers.data;
        });
    }

    /**
     * @description Creates work item form
     */
    createWorkItemForm() {
        this.workItemForm = this.fb.group({
            workItemParentName: '',
            workItemName: [''],
            workItemStatus: [],
            workItemPriority: [''],
            workItemProposalName: '',
            workItemClient: '',
            workItemStartDate: [''],
            workItemDueDate: [''],
            workItemDescription: '',
            workItemAssignees: ''
        });
    }

    setWorkItemDetails(workItem: any) {
        const { assigneeName, clientName, description, dueDate,
            endDate, guid, id, name, parentWorkItemGuid, parentWorkItemId,
            parentWorkItemName, proposalName, startDate, updatedAt,
            workItemPriorityId, workItemStatusId, workItemTypeId, workItemVisibilityId, } = workItem;
        this.workItemForm.patchValue({
            workItemParentName: parentWorkItemName,
            workItemName: name,
            workItemStatus: workItemStatusId,
            workItemPriority: Constants.workListPriority.find(priority => priority.value === workItemPriorityId).viewValue,
            workItemProposalName: proposalName,
            workItemClient: clientName,
            workItemStartDate: startDate,
            workItemDueDate: endDate,
            workItemDescription: description,
            workItemAssignees: assigneeName
        });
        this.workItemStatusColor = Constants.workListStatus.find(status => status.value === workItemStatusId).color;
        this.workItemStatusViewValue = Constants.workListStatus.find(status => status.value === workItemStatusId).viewValue;
        this.workItemPriorityColor = Constants.workListPriority.find(priority => priority.value === workItemPriorityId).color;

    }

    watchWorkItem() {
        const watchersToBeAdded = {
            cpUserId: +localStorage.getItem(Constants.localStorageData.ID),
            workItemId: +this.currentWorkItemId
        };
        const { UPDATE_SUCCESS, SUCCESS } = Constants.notifications;
        this.taskManagementService.addWatchersForWorkItem(watchersToBeAdded).subscribe(watchersAdded => {
            this.getWatchers();
            this.sharedService.openSnackBar(
                UPDATE_SUCCESS, SUCCESS
            );
        });
    }

    unWatchWorkItem() {
        const { UPDATE_SUCCESS, SUCCESS } = Constants.notifications;
        const watcherToBeRemoved = this.watchers.find(watcher => watcher.cpUserId === +localStorage.getItem(Constants.localStorageData.ID));
        const { id, guid } = watcherToBeRemoved;
        this.taskManagementService.deleteWorkItemWatcher(id, guid).subscribe(watchersUpdated => {
            this.getWatchers();
            this.sharedService.openSnackBar(
                UPDATE_SUCCESS, SUCCESS
            );
        });
    }

    updateStatusOfWorkItem() {
        const workItem = new WorkItemModel();
        workItem.id = +this.currentWorkItemId;
        workItem.guid = this.currentWorkItemGuid;
        workItem.workItemStatusId = this.workItemForm.controls.workItemStatus.value;
        const { UPDATE_SUCCESS, SUCCESS } = Constants.notifications;

        this.taskManagementService.updateWorkItem(workItem).subscribe(updatedWorkItem => {
            this.sharedService.openSnackBar(
                UPDATE_SUCCESS, SUCCESS
            );
            this.router.navigate([Constants.navigations.WORK_ITEM]);
        });
    }

    ngOnDestroy() {
        this.onDestroy.next(false);
        this.addWorkItemsService.saveWorkItem.next(false);
    }

}
