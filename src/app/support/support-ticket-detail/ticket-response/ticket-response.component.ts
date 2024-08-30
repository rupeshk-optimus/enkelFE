import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PaginationModel } from 'src/app/models/pagination.model';
import { SharedService } from 'src/app/services/shared.service';
import { SupportService } from 'src/app/services/support.service';
import { Constants } from 'src/app/shared/constants';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
    selector: 'app-ticket-response',
    templateUrl: './ticket-response.component.html',
    styleUrls: ['./ticket-response.component.scss']
})
export class TicketResponseComponent implements OnInit {
    @Input() supportTicketComments: PaginationModel;
    @Input() totalResponse: number;
    @Output() updateComponent = new EventEmitter<boolean>(false);

    newComment = '';
    selectedAttachments = [];
    comments = [];
    Constants = Constants;
    supportTicketId: string;
    supportTicketGuid: string;
    loggedInUser = +localStorage.getItem(Constants.localStorageData.ID);

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
        private route: ActivatedRoute,
        private sharedService: SharedService,
        private supportService: SupportService
    ) { }

    ngOnInit() {
        this.comments = this.supportTicketComments.data;
        this.route.paramMap.subscribe(params => {
            this.supportTicketGuid = params.get(Constants.routingParameters.GUID);
            this.supportTicketId = params.get(Constants.routingParameters.id);
        });
    }

    /**
     * @description Posts new comment
     */
    postNewComment() {
        const { SUBMIT_SUPPORT_TICKET_RESPONSE_HEADER, SUBMIT_SUPPORT_TICKET_RESPONSE_BODY } = Constants.helpTextMessages;
        this.dialog.open(DialogComponent, {
            width: Constants.DialogConstants.DEFAULT_WIDTH,
            data: {
                postSupportTicketRespose: {
                    header: SUBMIT_SUPPORT_TICKET_RESPONSE_HEADER,
                    supportTicketMessage: SUBMIT_SUPPORT_TICKET_RESPONSE_BODY
                }
            }
        }).componentInstance.submitClicked.subscribe(value => {
            if (value) {
                const responseFormData = this.convertResponseIntoFormData();
                const {UPDATE_SUCCESS, SUCCESS} = Constants.notifications;
                this.supportService.addResponseForSupportTicket(responseFormData).subscribe(addedComment => {
                    this.sharedService.openSnackBar(
                        UPDATE_SUCCESS, SUCCESS
                    );
                    this.updateComponent.emit(true);
                    this.newComment = '';
                    this.selectedAttachments = [];
                });
            }
        });
    }

    /**
     * @description Determines selected attachments
     * @param $event contains selected attachments
     */
    onAttachmentSelect($event) {
        const attachments = $event.target.files;
        for (const item of attachments) {
            if (item.size < Constants.appConstants.MAX_SIZE_FOR_SUPPORT_TICKET_ATTACHMENT) {
                this.selectedAttachments.push(item);
            } else {
                this.sharedService.openSnackBar(
                    Constants.errorMessages.SUPPORT_TICKET_ATTACHMENT_SIZE, Constants.notifications.SUCCESS
                );
            }
        }
    }

    removeAttachment(index: number) {
        this.selectedAttachments.splice(index, 1);
    }

    /**
     * @description Downloads attachment
     * @param element to be downloaded
     */
    downloadAttachment(element) {
        saveAs(element.url);
    }

    /**
     * @description Converts response into form data for sending to the server
     * @returns  created formData
     */
    convertResponseIntoFormData() {
        const response = new FormData();
        const attachments = this.selectedAttachments;

        const { ATTACHMENTS, DESCRIPTION, CP_USER_ID, SUPPORT_TICKET_ID } = Constants.workItemFormData;

        response.append(CP_USER_ID, localStorage.getItem(Constants.localStorageData.ID));
        response.append(SUPPORT_TICKET_ID, this.supportTicketId);
        response.append(DESCRIPTION, this.newComment);

        attachments.forEach((attachment) => {
            response.append(ATTACHMENTS, attachment);
        });

        return response;
    }

}
