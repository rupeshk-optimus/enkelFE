import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginationModel } from 'src/app/models/pagination.model';
import { SharedService } from 'src/app/services/shared.service';
import { TaskManagementService } from 'src/app/services/task-management.service';
import { Constants } from 'src/app/shared/constants';
import { AddWorkItemsService } from '../add-work-items.service';

@Component({
    selector: 'app-work-item-children',
    templateUrl: './work-item-children.component.html',
    styleUrls: ['./work-item-children.component.scss']
})
export class WorkItemChildrenComponent implements OnInit {
    currentWorkItemId: string;
    currentWorkItemGuid: string;
    children = [];
    totalPages = [];
    paginationTools = new PaginationModel();
    totalChildren;
    Constants = Constants;

    constructor(
        private addWorkItemsService: AddWorkItemsService,
        private taskManagementService: TaskManagementService,
        private sharedService: SharedService,
        private router: Router
    ) { }

    ngOnInit() {
        this.addWorkItemsService.currentWorkItemId.subscribe(id => this.currentWorkItemId = id);
        this.addWorkItemsService.currentWorkItemGuid.subscribe(guid => this.currentWorkItemGuid = guid);
        this.getChildList();
        this.getMetaDataForWorkItems();
    }

    getChildList() {
        this.taskManagementService.getChildrenForWorkItem(+this.currentWorkItemId, this.currentWorkItemGuid).subscribe(workItemChildren => {
            this.setChildrenDataSource(workItemChildren);
        });
    }

    /**
     * @description Gets meta data for work item by id
     */
     getMetaDataForWorkItems() {
        this.taskManagementService.getMetaDataForWorkItem(+this.currentWorkItemId, this.currentWorkItemGuid).subscribe(metaData => {
            this.totalChildren = metaData.totalChildWorItems;
        });
    }

    /**
     * @description Sets children of a work item in data source
     * @param children contains the object of children for a work item from the server
     */
    private setChildrenDataSource(children: PaginationModel) {
        children.data.map(child => {
            child.state = Constants.workListStatus.find(status => status.value === child.workItemStatusId).viewValue;
            child.color = Constants.workListStatus.find(status => status.value === child.workItemStatusId).color;
            child.iconColor = Constants.workItemType.find(type => type.id === child.workItemTypeId).color;
            if (child.workItemWatchers) {
                child.allowWatchItem = (child.workItemWatchers.find(watcher =>
                    watcher.cpUserId === +localStorage.getItem(Constants.localStorageData.ID))) ? false : true;
            }
        });
        this.children = children.data;
        this.paginationTools.hasNext = children.hasNext;
        this.paginationTools.currentPage = children.currentPage;
        this.paginationTools.hasPrevious = children.hasPrevious;
        this.paginationTools.totalCount = children.totalCount;
        this.paginationTools.totalPages = children.totalPages + 1;
        this.totalPages = Array(this.paginationTools.totalPages + 1).fill(0).map((x, i) => i);
        this.totalPages.shift();
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
        let url = '';
        url = this.router.serializeUrl(
            this.router.createUrlTree([WORK_ITEM, element.workItemTypeId,
                (element.parentWorkItemGuid) ? element.parentWorkItemGuid : 0,
                element.guid, element.id, EDIT])
        );

        window.open(url, Constants.WindowActions.blank);
    }

    watchWorkItem(element) {
        const watchersToBeAdded = {
            cpUserId: +localStorage.getItem(Constants.localStorageData.ID),
            workItemId: element.id
        };
        const { UPDATE_SUCCESS, SUCCESS } = Constants.notifications;
        this.taskManagementService.addWatchersForWorkItem(watchersToBeAdded).subscribe(watchersAdded => {
            this.getChildList();
            this.sharedService.openSnackBar(
                UPDATE_SUCCESS, SUCCESS
            );
        });
    }

    /**
     * @description watch work item
     * @param element to be unwatched
     */
    unWatchWorkItem(element) {
        const watcherToBeRemoved = element.workItemWatchers.find(watcher =>
            watcher.cpUserId === +localStorage.getItem(Constants.localStorageData.ID));
        const { UPDATE_SUCCESS, SUCCESS } = Constants.notifications;
        const { id, guid } = watcherToBeRemoved;
        this.taskManagementService.deleteWorkItemWatcher(id, guid).subscribe(watchersUpdated => {
            this.getChildList();
            this.sharedService.openSnackBar(
                UPDATE_SUCCESS, SUCCESS
            );
        });
    }

}
