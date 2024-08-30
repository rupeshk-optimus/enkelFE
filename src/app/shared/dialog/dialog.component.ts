import { Component, Inject, EventEmitter, Output, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MsalService } from '@azure/msal-angular';

import { ClientListModel } from 'src/app/models/client-list.model';
import { ReportService } from 'src/app/services/report.service';
import { Constants } from '../constants';
import { DialogService } from 'src/app/services/dialog.service';
import { SharedService } from 'src/app/services/shared.service';
import { element } from 'protractor';
import { DirectoriesModel } from 'src/app/models/directories.model';

import { forgotPasswordAuthority, tenantConfig } from 'src/environments/msConfig';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploaderService } from 'src/app/services/file-uploader.service';

export interface DialogData {
    clientListArray: Array<ClientListModel>;
    name: string;
    fileUpload: boolean;
    files: FileList;
    componentName: string;
    isPutRequest: any;
    createFolder: boolean;
    createFolderMetaData: DirectoriesModel;
    delete: {
        heading: string;
        body: string;
        fileName: string
    };
    passwordReset?: boolean;
    preview: {
        name: string;
        id: string;
        guid: string;
    };
    postSupportTicketRespose: {
        header: string;
        supportTicketMessage: string;
    };
    removeWorkItemComment: {
        header: string;
        commentBody: string;
    };
}

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements AfterContentChecked, OnInit {
    @Output() submitClicked = new EventEmitter<boolean>();
    fileUploadForm: FormGroup;
    selectedFiles: FileList;
    clients;
    months = Constants.appConstants.MONTHS;
    expiryDateList = Array();
    currentYear = new Date().getFullYear();
    uploadPercent = Array<any>();
    fileUploadClicked = false;
    showProgressBar = Array<boolean>();
    convertedFileArray = [];
    constants = Constants;
    putRequestObj: any;
    month = ('0' + (new Date().getMonth() + 1)).slice(-2);
    year = new Date().getFullYear();
    today = `${this.year}-${this.month}`;
    minPeriodDate = `${this.year - 10}-${this.month}`;
    expiryDateMonths = ('0' + (new Date().getMonth() + 7)).slice(-2);
    maxExpiryDate = `${this.year + 1}-${this.expiryDateMonths}`;
    invalidExpiryDate = false;
    folderName = '';
    disableUploadFileButton = false;
    previewContent;
    directoryTreeDropdown = [];
    viewer = Constants.previewer.GOOGLE_VIEWER;
    contentLoader = true;
    isPdfLoaded = false;

    get fileToBeUploaded(): FormArray {
        return this.fileUploadForm.get(Constants.FormControlNames.FILE_TO_BE_UPLOAD) as FormArray;
    }

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        public dialogRef: MatDialogRef<DialogComponent>,
        private snackBar: MatSnackBar,
        private cdref: ChangeDetectorRef,
        private fb: FormBuilder,
        private reportService: ReportService,
        private dialogService: DialogService,
        private msalService: MsalService,
        private sharedService: SharedService,
        private sanitizer: DomSanitizer,
        private fileUploaderService: FileUploaderService
    ) { }

    ngOnInit() {
        this.selectedFiles = this.data.files;
        this.putRequestObj = this.data.isPutRequest;
        if (this.selectedFiles) {
            this.convertedFileArray = Object.values(this.selectedFiles);
            this.convertedFileArray.forEach(file => {
                if (file.size > Constants.allowedFileFormat.MAX_SIZE) {
                    this.snackBar.open(Constants.errorMessages.FILE_SIZE, Constants.notifications.ERROR_LABEL, {
                        duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                        panelClass: 'mail-success'
                    });
                    this.onNoClick();
                }
            });
        }
        if (this.data.componentName === Constants.appConstants.REPORTS) {
            this.getClientList();
            this.convertedFileArray.forEach(file => {
                if (file.type !== Constants.allowedFileFormat.PDF) {
                    this.snackBar.open(Constants.errorMessages.FILE_FORMAT, Constants.notifications.ERROR_LABEL, {
                        duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                        panelClass: 'mail-success'
                    });
                    this.onNoClick();
                }
            });
        }
        if (this.data.files) {
            this.getDirectoryTree();
            this.createFileUploadForm();
            this.sharedService.uploadPercent.next(0);
            this.formChange();
        }
        if (this.data.preview) {
            this.showPreviewFile(this.data.preview.id, this.data.preview.guid);
        }
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    onNoClick(): void {
        this.submitClicked.emit(false);
        this.dialogRef.close();
    }

    startTour() {
        this.submitClicked.emit(true);
        this.dialogRef.close();
    }

    trackByMethod(item) {
        return item.id;
    }

    formatBytes(bytes, decimals) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    getClientList() {
        this.dialogService.getClients().subscribe(clientList => {
            this.clients = clientList.data;
        });
    }

    getDirectoryTree() {
        this.fileUploaderService.getReportsforTable(false).subscribe(list => {
            this.directoryTreeDropdown.push(list);
        });
    }

    createFileUploadForm() {
        this.fileUploadForm = this.fb.group({
            fileToBeUploaded: this.fb.array([this.buildFileForm()])
        });
        const convertedFileArray = Object.values(this.selectedFiles);
        this.fileUploadForm.setControl(Constants.FormControlNames.FILE_TO_BE_UPLOAD,
            this.setExistingFiles(convertedFileArray));
    }

    buildFileForm(): FormGroup {
        return this.fb.group({
            fileName: '',
            clientName: '',
            fileType: '',
            period: '',
            expiryDate: '',
            description: '',
            purpose: '',
            actionRequired: '',
            DirectoryId: this.data.createFolderMetaData.id
        });
    }

    setExistingFiles(filesArray): FormArray {
        const formArray = new FormArray([]);
        if (!this.putRequestObj) {
            filesArray.forEach(file => {
                formArray.push(
                    this.fb.group({
                        fileName: file,
                        clientName: '',
                        fileType: '',
                        period: '',
                        expiryDate: this.maxExpiryDate,
                        description: '',
                        purpose: '',
                        actionRequired: '',
                        DirectoryId: this.data.createFolderMetaData.id
                    })
                );
            });
        } else {
            filesArray.forEach(file => {
                formArray.push(
                    this.fb.group({
                        fileName: file,
                        clientName: '',
                        fileType: '',
                        period: '',
                        expiryDate: '',
                        description: this.putRequestObj.description,
                        purpose: this.putRequestObj.purpose,
                        actionRequired: this.putRequestObj.action,
                        DirectoryId: this.data.createFolderMetaData.id
                    })
                );
            });
        }
        return formArray;
    }

    formChange() {
        this.fileUploadForm.controls.fileToBeUploaded.valueChanges.subscribe(data => {
            let condition;
            condition = data.filter(formRow => new Date(formRow.expiryDate) > new Date(this.maxExpiryDate) ||
                new Date(formRow.expiryDate) < new Date(this.today)
            );
            condition = data.filter(formRow => new Date(formRow.period) > new Date(this.today) ||
                new Date(formRow.period) < new Date(this.minPeriodDate)
            );
            if (condition) {
                this.invalidExpiryDate = (condition.length > 0);
            } else {
                this.invalidExpiryDate = false;
            }
        });
    }

    addFile(file): void {
        const fileUploads = this.fileUploadForm.controls.fileToBeUploaded as FormArray;
        fileUploads.push(
            this.fb.group({
                fileName: file,
                clientName: '',
                fileType: '',
                period: '',
                expiryDate: this.maxExpiryDate,
                description: '',
                purpose: '',
                actionRequired: '',
                DirectoryId: this.data.createFolderMetaData.id
            })
        );
    }

    removeFile(index: number) {
        const fileUploads = this.fileUploadForm.controls.fileToBeUploaded as FormArray;
        fileUploads.removeAt(index);
        this.fileUploadForm.updateValueAndValidity();
    }

    addMoreFiles(addedFiles) {
        for (const item of addedFiles) {
            item.progress = 0;
            if (!this.convertedFileArray.find(file => file.name === item.name)) {
                this.convertedFileArray.push(item);
                this.addFile(item);
            }
        }
        this.putRequestObj = this.data.isPutRequest;
        this.convertedFileArray.forEach(file => {
            if (file.size > Constants.allowedFileFormat.MAX_SIZE) {
                this.snackBar.open(Constants.errorMessages.FILE_SIZE, Constants.notifications.ERROR_LABEL, {
                    duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                    panelClass: 'mail-success'
                });
                this.onNoClick();
            }
        });
    }

    onSubmit() {
        this.fileUploadClicked = true;
        this.data.componentName = Constants.appConstants.FILES;
        this.fileUploadForm.value.fileToBeUploaded.forEach((el, index) => {
            this.dialogService.uploadFileFormData(el, this.putRequestObj, this.data.componentName).subscribe(event => {
                this.sharedService.uploadPercent.subscribe(value => {
                    this.convertedFileArray.map(item => {
                        if (item.name === value.fileName) {
                            item.progress = Math.round(Number.parseInt(value.percentage, 10));
                            if (Number.isNaN(item.progress)) {
                                item.progress = 'error';
                            }
                        }
                    });
                });
            }, err => {
                this.onNoClick();
                this.snackBar.open(err.error, Constants.notifications.ERROR_LABEL, {
                    duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                    panelClass: 'mail-success'
                });
            });
        });
    }

    createFolder() {
        const id = localStorage.getItem(Constants.localstorageKeys.ID);
        const clientId = localStorage.getItem(Constants.localstorageKeys.CLIENT_ID);
        const newFolder = new DirectoriesModel();
        newFolder.childDirectories = null;
        newFolder.clientId = Number.parseInt(clientId, 10);
        newFolder.createdBy = Number.parseInt(id, 10);
        newFolder.directoryTypeId = 1;
        newFolder.fileMetaData = null;
        newFolder.name = this.folderName;
        newFolder.parentDirectoryId = this.data.createFolderMetaData.id;
        newFolder.parentDirectoryGuid = this.data.createFolderMetaData.guid;
        newFolder.updatedBy = Number.parseInt(id, 10);
        this.dialogService.createFolder(newFolder).subscribe(folder => {
            this.startTour();
        }, err => {
            this.onNoClick();
            this.snackBar.open(err.error, Constants.notifications.ERROR_LABEL, {
                duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                panelClass: 'mail-success'
            });
        });
    }

    resetPassword() {
        localStorage.setItem(Constants.localstorageKeys.IS_INITIAL_LOGIN_COMPLETED, 'true');
        this.msalService.authority = forgotPasswordAuthority;
        this.msalService.loginRedirect(tenantConfig.scopes);
    }

    showPreviewFile(fileId: string, fileGuid: string) {
        this.reportService.downloadBlob(fileId, fileGuid).subscribe(file => {
            this.previewContent = file.url;
            if (!file.url.includes('pdf')) {
                this.viewer = Constants.previewer.OFFICE_VIEWER;
                this.contentLoader = false;
            }
        }, err => {
            console.log(err);
        });
    }

    pdfLoaded() {
        this.isPdfLoaded = true;
    }

}
