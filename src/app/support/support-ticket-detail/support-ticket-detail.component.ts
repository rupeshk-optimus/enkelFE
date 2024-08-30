import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Constants } from 'src/app/shared/constants';
import { SharedService } from 'src/app/services/shared.service';
import { SupportService } from 'src/app/services/support.service';
import { SupportTicketModel } from 'src/app/models/support-ticket.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { SupportTicketMetaDataModel } from 'src/app/models/support-ticket-metadata.model';

@Component({
    selector: 'app-support-ticket-detail',
    templateUrl: './support-ticket-detail.component.html',
    styleUrls: ['./support-ticket-detail.component.scss']
})
export class SupportTicketDetailComponent implements OnInit {
    supportTicketGuid: string;
    supportTicketId: string;
    supportTicketDetails: SupportTicketModel;
    supportTicketAttachments: PaginationModel;
    supportTicketComments: PaginationModel;
    supportTicketMetaData: SupportTicketMetaDataModel;
    showAttachmentComponent = false;
    showCommentComponent = false;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        public sharedService: SharedService,
        private supportService: SupportService
    ) { }

    ngOnInit() {
        this.sharedService.pageHeading.next(Constants.appConstants.SUPPORT);
        this.sharedService.imgHeading.next(Constants.appConstants.SUPPORT_IMG);
        this.route.paramMap.subscribe(params => {
            this.supportTicketGuid = params.get(Constants.routingParameters.GUID);
            this.supportTicketId = params.get(Constants.routingParameters.id);
        });
        this.getSupportTicketById(this.supportTicketId, this.supportTicketGuid);
        this.getSupportTicketMetaDataById(this.supportTicketId, this.supportTicketGuid);
        this.getAttachmentList(this.supportTicketId, this.supportTicketGuid);
        this.getSupportTicketThread(this.supportTicketId, this.supportTicketGuid);
        this.sharedService.uploadPercent.subscribe(value => {
            const progress = Math.round(Number.parseInt(value.percentage, 10));
            if (progress > Constants.fileUploadPercentage.FINAL) {
                this.updateSupportTicket();
            }
        });
    }

    getSupportTicketById(id: string, guid: string) {
        this.supportService.getSupportTicketById(+id, guid)
            .subscribe(supportTicket => {
                this.supportTicketDetails = supportTicket;
            });
    }

    /**
     * @description Gets attachment list
     */
    getAttachmentList(supportTicketId: string, supportTicketGuid: string) {
        this.supportService.getAttachmentsForSupportTicket(+supportTicketId, supportTicketGuid).subscribe(attachments => {
            attachments.data.map(attachment => {
                attachment.type = attachment.type.split('.')[1];
            });
            this.supportTicketAttachments = attachments;
            this.showAttachmentComponent = true;
        });
    }

    /**
     * @description Gets support ticket thread
     * @param supportTicketId of the support ticket
     * @param supportTicketGuid of the support ticket
     */
    getSupportTicketThread(supportTicketId: string, supportTicketGuid: string) {
        this.supportService.getResponsesForSupportTicket(+supportTicketId, supportTicketGuid)
            .subscribe(comments => {
                comments.data.forEach(response => {
                    response.createdAt = new Date(response.createdAt + 'Z');
                    response.description = response.description.trim().replace(/\n/g, '<br>');
                });
                this.supportTicketComments = comments;
                this.showCommentComponent = true;
            });
    }

    /**
     * @description Gets support ticket meta data by id
     * @param supportTicketId of the support ticket
     * @param supportTicketGuid of the support ticket
     */
    getSupportTicketMetaDataById(supportTicketId: string, supportTicketGuid: string) {
        this.supportService.getMetaDataForSupportTicket(+supportTicketId, supportTicketGuid)
            .subscribe(metaData => {
                this.supportTicketMetaData = metaData;
            });
    }

    /**
     * @description Go back
     */
    goBack() {
        this.location.back();
    }

    updateSupportTicket() {
        this.showAttachmentComponent = false;
        this.showCommentComponent = false;
        this.getSupportTicketMetaDataById(this.supportTicketId, this.supportTicketGuid);
        this.getAttachmentList(this.supportTicketId, this.supportTicketGuid);
        this.getSupportTicketThread(this.supportTicketId, this.supportTicketGuid);
    }

}
