import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/shared/constants';

import { SharedService } from 'src/app/services/shared.service';
import { TaskManagementService } from 'src/app/services/task-management.service';
import { AddWorkItemsService } from '../add-work-items.service';

@Component({
    selector: 'app-work-item-attachments',
    templateUrl: './work-item-attachments.component.html',
    styleUrls: ['./work-item-attachments.component.scss']
})
export class WorkItemAttachmentsComponent implements OnInit {
    currentWorkItemId: string;
    currentWorkItemGuid: string;
    totalAttachments: number;
    attachments = [];
    attachmentsToBeUploaded = [];
    Constants = Constants;

    constructor(
        private addWorkItemsService: AddWorkItemsService,
        private taskManagementService: TaskManagementService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.addWorkItemsService.currentWorkItemId.subscribe(id => this.currentWorkItemId = id);
        this.addWorkItemsService.currentWorkItemGuid.subscribe(guid => this.currentWorkItemGuid = guid);
        this.getWorkItemAttachments();
        this.getMetaDataForWorkItems();
        this.sharedService.uploadPercent.subscribe(value => {
            if (Math.round(Number.parseInt(value.percentage, 10)) > 99) {
                this.getWorkItemAttachments();
                this.getMetaDataForWorkItems();
            }
        });
    }

    getWorkItemAttachments() {
        this.taskManagementService.getAttachmentsForWorkItem(+this.currentWorkItemId, this.currentWorkItemGuid).subscribe(
            workItemAttachments => {
                workItemAttachments.data.map(attachment => {
                    attachment.type = attachment.type.split('.')[1];
                });
                this.attachments = workItemAttachments.data;
            });
    }

    /**
     * @description Downloads attachment
     * @param element to be downloaded
     */
    downloadAttachment(element) {
        saveAs(element.url);
    }

    /**
     * @description Adds selected attachments to the datasource and file list for uploading on server
     * @param $event contains the selected attachments
     */
    onAttachmentSelect($event) {
        const attachments = $event.target.files;
        for (const item of attachments) {
            item.progress = 0;
            item.fileName = item.name;
            item.fileType = item.name.split('.')[1];
            item.uploadedAt = new Date(item.lastModifiedDate);
            item.uploaderName = localStorage.getItem(Constants.localstorageKeys.NAME);
            this.attachmentsToBeUploaded.push(item);
            // this.attachments.push(item);
        }
        // this.attachments.push(...attachments);
        this.uploadAttachments();
    }

    /**
     * @description Converts from value to form data
     * @returns form data from form value
     */
    convertFromValueToFormData(): FormData {
        const workItem: FormData = new FormData();

        const { ATTACHMENTS, CP_USER_ID, WORK_ITEM_ID } = Constants.workItemFormData;

        workItem.append(CP_USER_ID, localStorage.getItem(Constants.localStorageData.ID));
        workItem.append(WORK_ITEM_ID, this.currentWorkItemId);
        this.attachmentsToBeUploaded.forEach((attachment) => {
            workItem.append(ATTACHMENTS, attachment);
        });

        return workItem;
    }

    uploadAttachments() {
        const formDataToBeUploaded = this.convertFromValueToFormData();
        this.taskManagementService.uploadWorkItemAttachments(formDataToBeUploaded).subscribe(uploaded => {
            this.attachmentsToBeUploaded = [];
        });
    }

    /**
     * @description Gets meta data for work item by id
     */
     getMetaDataForWorkItems() {
        this.taskManagementService.getMetaDataForWorkItem(+this.currentWorkItemId, this.currentWorkItemGuid).subscribe(metaData => {
            this.totalAttachments = metaData.totalAttachments;
        });
    }

}
