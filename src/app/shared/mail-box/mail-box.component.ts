import { Component, OnInit, Input, Inject, Optional } from '@angular/core';
import { Constants } from '../constants';
import { UserAccountModel } from 'src/app/models/user-account.model';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { MailModel } from 'src/app/models/mail.model';
import { ConnectToCslService } from 'src/app/services/connect-to-csl.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/services/shared.service';

export interface DialogData {
    sendEmail: string;
    subject: string;
    clientName: string;
    clientEmail: string;
    header: string;
    period: Date;
    expiryDate: Date;
    queryParamName: string;
    queryParamId: string;
    queryParamGuid: string;
}

@Component({
    selector: 'app-mail-box',
    templateUrl: './mail-box.component.html',
    styleUrls: ['./mail-box.component.scss']
})
export class MailBoxComponent implements OnInit {
    @Input() dataFromParentComponent: any;

    constants = Constants;
    cslMaildetails: UserAccountModel;
    mailForm: FormGroup;
    loggedInUserName = '';
    loggedInUserEmail = '';
    sendCopy = false;
    mailBodyLength = '';
    mailSubjectLength = '';
    mailCcParticipantsCount;
    noCSL: boolean;
    errorMessage: string;
    headerTitle = '';
    downloadFileLink: string;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<MailBoxComponent>,
        private connectToCslService: ConnectToCslService,
        private sharedService: SharedService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }

    ngOnInit() {
        this.headerTitle = this.data.header;
        this.loggedInUserName = localStorage.getItem(Constants.localstorageKeys.NAME);
        this.loggedInUserEmail = localStorage.getItem(Constants.localstorageKeys.EMAIL);
        this.createMailForm();
        if (this.dataFromParentComponent) {
            this.cslMaildetails = this.dataFromParentComponent;
        }
        if (this.cslMaildetails) {
            this.setMailFormDetails(this.cslMaildetails);
        }
        if (this.data && this.data.sendEmail === 'send-mail') {
            this.downloadFileLink = environment.clientBaseUrl + 'reports/report-upload/?id='
             + this.data.queryParamId + '&guid=' + this.data.queryParamGuid + '&name=' + this.data.queryParamName;
            this.setMailDetailsFordownload();
        }
        this.onChangeInMailBody();
    }

    getCslInformation() {
        this.connectToCslService.getCslInfo().subscribe((data) => {
            this.cslMaildetails = data;
            this.setMailDetailsFordownload();
        }, err => {
            this.noCSL = true;
            this.errorMessage = err.error;
        });
    }

    createMailForm() {
        this.mailForm = this.fb.group({
            sendMailTo: ['', Validators.required],
            mailCC: ['', this.commaSeperatedEmail],
            mailSubject: '',
            mailBody: ['', [Validators.required]]
        });
    }

    setMailDetailsFordownload() {
        // this.setMailFormDetails(this.cslMaildetails);
        this.mailForm.patchValue({
            sendMailTo: this.data.clientEmail,
            mailSubject: this.data.subject,
            mailBody: Constants.helpTextMessages.MAIL_BODY_SALUTATION_FOR_CSL +
                this.data.clientName + '\n\n' + 'Your CSL has uploaded a new report for '
                 + this.sharedService.modifyDate(this.data.period, Constants.DateFormats.DD_MMMM_YYYY)
                 + ' on the client portal.\n\n' +
                Constants.helpTextMessages.MAIL_BODY_FOR_CLIENT +
                this.sharedService.modifyDate(this.data.expiryDate, Constants.DateFormats.DD_MMMM_YYYY) + '.' +
                Constants.helpTextMessages.MAIL_BODY_GREETINGS_FOR_CSL + Constants.helpTextMessages.SENDER_CSL
        });
        this.mailBodyLength = this.mailForm.controls.mailBody.value.length;
        this.mailSubjectLength = this.mailForm.controls.mailSubject.value.length;
    }

    setMailFormDetails(obj: UserAccountModel) {
        this.mailForm.patchValue({
            sendMailTo: obj.primaryEmail
        });
        this.mailBodyLength = this.mailForm.controls.mailBody.value.length;
        this.mailSubjectLength = this.mailForm.controls.mailSubject.value.length;
    }

    onChangeInMailBody() {
        this.mailForm.controls.mailBody.valueChanges.subscribe(data => {
            this.mailBodyLength = data.length;
        });
        this.mailForm.controls.mailSubject.valueChanges.subscribe(data => {
            this.mailSubjectLength = data.length;
        });
    }

    commaSeperatedEmail = (control: AbstractControl): { [key: string]: any } | null => {
        const test = control.value.replace(/ /g, ',');
        const emails = test.split(',');
        const arrWithOutEmptyElements = emails.filter(item => item !== '');
        this.mailCcParticipantsCount = arrWithOutEmptyElements.length;
        const forbidden = emails.some(email => Validators.email(new FormControl(email)));
        return forbidden ? { mailCC: { value: control.value } } : null;
    }

    toggleMailCopy() {
        this.sendCopy = !this.sendCopy;
    }

    resetForm() {
        this.createMailForm();
        if (this.data && this.data.sendEmail === 'send-mail') {
            this.setMailDetailsFordownload();
        } else {
            this.setMailFormDetails(this.cslMaildetails);
        }
    }

    sendMail() {
        const mailToCsl = this.assignFormValueToCslMailModel(this.mailForm.value);
        this.connectToCslService.sendMailToCsl(mailToCsl).subscribe(data => {
            this.resetForm();
            this.snackBar.open(Constants.notifications.MAIL_SUCCESS, Constants.notifications.SUCCESS, {
                duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                panelClass: 'mail-success'
            });
        });
        this.dialogRef.close();
    }

    assignFormValueToCslMailModel(obj: any) {
        const loggedInUserEmail = localStorage.getItem(Constants.localstorageKeys.EMAIL);
        const mail = new MailModel();
        mail.tos = new Array();
        mail.tos.push(obj.sendMailTo);
        if (obj.mailCC || this.sendCopy) {
            mail.ccs = new Array();
        }
        if (obj.mailCC) {
            const removeTrailingSpace = obj.mailCC.trim();
            const test = removeTrailingSpace.replace(/ /g, ',');
            const arr = test.split(',');
            const arrWithOutEmptyElements = arr.filter(item => item !== '');
            mail.ccs = arrWithOutEmptyElements;
        }
        if (this.sendCopy) {
            mail.ccs.push(loggedInUserEmail);
        }
        mail.subject = obj.mailSubject.trim();
        const newSub = obj.mailBody.trim().replace(/\n/g, '<br>')
        .replace('link', '<a target="_blank" href=' + this.downloadFileLink + '>link</a>');
        mail.body = newSub;
        return mail;
    }

}
