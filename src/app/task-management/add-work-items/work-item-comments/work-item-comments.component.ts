import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { WorkItemCommentModel } from 'src/app/models/work-item-comment.model';
import { SharedService } from 'src/app/services/shared.service';
import { TaskManagementService } from 'src/app/services/task-management.service';
import { Constants } from 'src/app/shared/constants';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { AddWorkItemsService } from '../add-work-items.service';

@Component({
    selector: 'app-work-item-comments',
    templateUrl: './work-item-comments.component.html',
    styleUrls: ['./work-item-comments.component.scss']
})
export class WorkItemCommentsComponent implements OnInit {
    currentWorkItemId: string;
    currentWorkItemGuid: string;
    newComment = '';
    comments = [];
    Constants = Constants;
    loggedInUser = +localStorage.getItem(Constants.localStorageData.ID);
    totalComments: number;

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        toolbarPosition: 'bottom',
        height: '8rem',
        minHeight: '5rem',
        maxHeight: '15rem',
        placeholder: 'Description',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        outline: true,
        toolbarHiddenButtons: [
            [
                'fontSize',
                'textColor',
                'backgroundColor',
                'customClasses',
                'link',
                'unlink',
                'insertImage',
                'insertVideo',
                'insertHorizontalRule',
                'removeFormat',
                'toggleEditorMode']
        ]
    };

    constructor(
        public dialog: MatDialog,
        private addWorkItemsService: AddWorkItemsService,
        private taskManagementService: TaskManagementService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.addWorkItemsService.currentWorkItemId.subscribe(id => this.currentWorkItemId = id);
        this.addWorkItemsService.currentWorkItemGuid.subscribe(guid => this.currentWorkItemGuid = guid);
        this.getCommentsForCurrentWorkItem();
        this.getMetaDataForWorkItems();
    }

    getCommentsForCurrentWorkItem() {
        this.taskManagementService.getCommentsForWorkItem(+this.currentWorkItemId, this.currentWorkItemGuid).subscribe(
            comments => {
                comments.data.map(response => {
                    response.createdAt = new Date(response.createdAt + 'Z');
                });
                this.comments = comments.data;
            }
        );
    }

    /**
     * @description Gets meta data for work item by id
     */
    getMetaDataForWorkItems() {
        this.taskManagementService.getMetaDataForWorkItem(+this.currentWorkItemId, this.currentWorkItemGuid).subscribe(metaData => {
            this.totalComments = metaData.totalComments;
        });
    }

    /**
     * @description Posts new comment
     */
    postNewComment() {
        const newComment = new WorkItemCommentModel();
        newComment.cpUserId = this.loggedInUser;
        newComment.description = this.newComment;
        newComment.workItemId = +this.currentWorkItemId;
        const { UPDATE_SUCCESS, SUCCESS } = Constants.notifications;
        this.taskManagementService.addCommentForWorkItem(newComment).subscribe(addedComment => {
            this.sharedService.openSnackBar(
                UPDATE_SUCCESS, SUCCESS
            );
            this.newComment = '';
            this.getCommentsForCurrentWorkItem();
            this.getMetaDataForWorkItems();
        });
        // TO DO
        // const { SUBMIT_SUPPORT_TICKET_RESPONSE_HEADER, SUBMIT_SUPPORT_TICKET_RESPONSE_BODY } = Constants.helpTextMessages;
        // this.dialog.open(DialogComponent, {
        //     width: Constants.DialogConstants.DEFAULT_WIDTH,
        //     data: {
        //         postSupportTicketRespose: {
        //             header: SUBMIT_SUPPORT_TICKET_RESPONSE_HEADER,
        //             supportTicketMessage: SUBMIT_SUPPORT_TICKET_RESPONSE_BODY
        //         }
        //     }
        // }).componentInstance.submitClicked.subscribe(value => {
        //     if (value) {
        //         const newComment = new WorkItemCommentModel();
        //         newComment.cpUserId = this.loggedInUser;
        //         newComment.description = this.newComment;
        //         newComment.workItemId = +this.currentWorkItemId;
        //         const { UPDATE_SUCCESS, SUCCESS } = Constants.notifications;
        //         this.taskManagementService.addCommentForWorkItem(newComment).subscribe(addedComment => {
        //             this.sharedService.openSnackBar(
        //                 UPDATE_SUCCESS, SUCCESS
        //             );
        //             this.newComment = '';
        //             this.getCommentsForCurrentWorkItem();
        //         });
        //     }
        // });
    }

    /**
     * @description Deletes comment
     * @param comment to be added
     */
    deleteComment(comment: WorkItemCommentModel) {
        this.dialog.open(DialogComponent, {
            width: Constants.DialogConstants.DEFAULT_WIDTH,
            data: {
                removeWorkItemComment: {
                    header: Constants.helpTextMessages.DELETE_HEADING,
                    commentBody: 'comment'
                }
            }
        }).componentInstance.submitClicked.subscribe(value => {
            if (value) {
                this.taskManagementService.deleteComment(comment.id, comment.guid).subscribe(commentDeleted => {
                    this.getCommentsForCurrentWorkItem();
                    this.getMetaDataForWorkItems();
                });
            }
        });
    }

}
