import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

import { PaginationModel } from 'src/app/models/pagination.model';
import { Constants } from 'src/app/shared/constants';

@Component({
    selector: 'app-ticket-attachments',
    templateUrl: './ticket-attachments.component.html',
    styleUrls: ['./ticket-attachments.component.scss']
})
export class TicketAttachmentsComponent implements OnInit {
    @Input() supportTicketAttachments: PaginationModel;
    @Input() totalAttachments: number;
    attachments = [];
    Constants = Constants;


    constructor() { }

    ngOnInit() {
        this.attachments = this.supportTicketAttachments.data;
    }

    /**
     * @description Downloads attachment
     * @param element to be downloaded
     */
    downloadAttachment(element) {
        saveAs(element.url);
    }

}
