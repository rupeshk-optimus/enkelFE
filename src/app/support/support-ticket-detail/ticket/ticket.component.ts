import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupportTicketModel } from 'src/app/models/support-ticket.model';
import { Constants } from 'src/app/shared/constants';

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.component.html',
    styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
    @Input() supportTicketDetails: SupportTicketModel;

    supportTicketForm: FormGroup;
    currentSupportTicketSentDate: Date;
    supportTicketStatus;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.createSupportTicketForm();
        this.setSupportTicketDetails(this.supportTicketDetails);
    }

    /**
     * @description Creates work item form
     */
    createSupportTicketForm() {
        this.supportTicketForm = this.fb.group({
            supportTicketStatus: ['', Validators.required],
            supportTicketSubject: '',
            supportTicketBody: ['', Validators.required],
            supportTicketSenderName: ['', Validators.required],
            supportTicketSenderEmail: ['', Validators.required]
        });
    }

    setSupportTicketDetails(supportTicket: SupportTicketModel) {
        const { body, senderEmail, sender, receivedAt, subject, supportTicketStatusId } = supportTicket;
        this.supportTicketForm.patchValue({
            supportTicketStatus: supportTicketStatusId,
            supportTicketSubject: subject,
            supportTicketBody: body,
            supportTicketSenderName: sender,
            supportTicketSenderEmail: senderEmail
        });
        this.currentSupportTicketSentDate = new Date(receivedAt + 'Z');
        this.supportTicketStatus = Constants.supportTicketOptions.TICKET_STATUS
        .find(status => status.id === supportTicketStatusId);
    }

}
