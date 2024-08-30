import { Component, OnInit, ViewChild, ElementRef, Input, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { saveAs } from 'file-saver';

import { FileUploaderService } from '../../services/file-uploader.service';
import { SharedService } from 'src/app/services/shared.service';

import { Constants } from '../constants';

import { DialogComponent } from '../dialog/dialog.component';
import { MailBoxComponent } from '../mail-box/mail-box.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FileOnGrid } from 'src/app/models/file-on-grid.model';
import { DirectoriesModel } from 'src/app/models/directories.model';


@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})

export class FileUploaderComponent implements OnInit {

    @Input() dataFromParentComponent: any;
    @ViewChild('fileDropRef', { static: false }) imageName: ElementRef;
    files: any[] = [];
    constants = Constants;
    filesForTable = Array<FileOnGrid>();
    allowedFileFormats = '';
    showDelete = false;
    showReportType = false;
    showPeriod = false;
    showExpiry = false;
    showDescription = false;
    showPurpose = false;
    showUpload = false;
    showMail = false;
    showSize = false;
    showCreatedOn = false;
    showPreview = false;
    showAction = false;
    showClient = false;
    requestTypeIsPut: any;
    currentDirectory: DirectoriesModel;
    currentPath = [];

    constructor(
        public dialog: MatDialog,
        public sharedService: SharedService,
        private fileUploaderService: FileUploaderService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        if (this.route.snapshot.queryParams.id) {
            const id = this.route.snapshot.queryParams.id;
            const guid = this.route.snapshot.queryParams.guid;
            const name = this.route.snapshot.queryParams.name;
            this.downloadFile(name, id, guid);
        }
        const loggedInUserIsClient = JSON.parse(localStorage.getItem(Constants.localstorageKeys.CLIENT_ID));
        this.getFilesForTable();
        this.allowedFileFormats = this.dataFromParentComponent === Constants.appConstants.REPORTS ?
            Constants.allowedFileFormat.PDF : Constants.allowedFileFormat.ALL;
        this.showDelete = ((this.dataFromParentComponent === Constants.appConstants.REPORTS &&
            !loggedInUserIsClient) || (this.dataFromParentComponent === Constants.appConstants.FILES &&
                loggedInUserIsClient)) ? true : false;
        this.showUpload = (this.dataFromParentComponent === Constants.appConstants.FILES &&
            loggedInUserIsClient) ? true : false;
        this.showMail = (this.dataFromParentComponent === Constants.appConstants.REPORTS &&
            !loggedInUserIsClient) ? true : false;
        this.showClient = !loggedInUserIsClient;
        if (this.dataFromParentComponent === Constants.appConstants.FILES) {
            this.showDescription = true;
            this.showPurpose = true;
            this.showSize = true;
            this.showCreatedOn = true;
            this.showAction = true;
        }
        if (this.dataFromParentComponent === Constants.appConstants.REPORTS) {
            this.showPeriod = true;
            this.showReportType = true;
            this.showExpiry = true;
            this.showPreview = true;
        }
        this.sharedService.uploadPercent.subscribe(data => {
            if (Number.parseInt(data.percent, 10)) {
                this.getFilesForTable();
            }
        });
    }

    openMailbox(file) {
        const dialogRef = this.dialog.open(MailBoxComponent, {
            width: '700px',
            height: '600px',
            data: {
                header: 'Send Mail',
                sendEmail: 'send-mail',
                subject: 'New File Uploaded',
                clientName: file.clientName,
                clientEmail: file.clientEmail,
                period: file.period,
                expiryDate: file.expiredAt,
                queryParamName: file.name,
                queryParamId: file.id,
                queryParamGuid: file.guid
            }
        });
    }

    getFilesForTable() {
        this.fileUploaderService.getReportsforTable(true, this.dataFromParentComponent).subscribe(list => {
            list.childDirectories.map(directory => {
                directory.isFolder = true;
            });
            this.filesForTable = list.childDirectories;
            this.filesForTable = this.filesForTable.concat(list.fileMetaData);
            this.currentDirectory = list;
        });
    }

    downloadFile(name: string, id: string, guid: string) {
        this.fileUploaderService.downloadBlob(id, guid).subscribe(file => {
            // saveAs(file.url);
            saveAs(file, name);
        }, err => {
            console.log(err);
        });
    }

    deleteFile(name: string, id: string, guid: string, isFolder?: boolean) {
        this.dialog.open(DialogComponent, {
            width: Constants.DialogConstants.DEFAULT_WIDTH,
            data: {
                delete: {
                    heading: Constants.helpTextMessages.DELETE_HEADING,
                    body: Constants.helpTextMessages.DELETE_BODY + (isFolder ? 'folder' : 'file'),
                    fileName: name
                }
            }
        }).componentInstance.submitClicked.subscribe((data) => {
            this.requestTypeIsPut = null;
            if (data) {
                let baseUrl;
                if ( !isFolder) {
                    baseUrl = Constants.endPoints.FILE_DELETE;
                } else {
                    baseUrl = Constants.endPoints.FOLDER_DELETE;
                }
                const url = baseUrl + Constants.symbols.pathVariableSymbol + id + Constants.symbols.pathVariableSymbol + guid;
                this.fileUploaderService.deleteFile(url).subscribe(() => {
                    if ( this.currentDirectory.parentDirectoryId) {
                        this.currentDirectory.isFolder = true;
                        this.openFolder(this.currentDirectory);
                    } else {
                        this.getFilesForTable();
                    }
                });
            }
        });

    }

    openFileUpload(file) {
        this.requestTypeIsPut = file;
        this.imageName.nativeElement.click();
    }

    /**
     * on file drop handler
     */
    onFileDropped($event) {
        this.prepareFilesList($event);
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(files) {
        this.prepareFilesList(files);
    }

    /**
     * Simulate the upload process
     */
    uploadFilesSimulator(index: number) {
        setTimeout(() => {
            if (index === this.files.length) {
                return;
            } else {
                const progressInterval = setInterval(() => {
                    if (this.files[index].progress === 100) {
                        clearInterval(progressInterval);
                        this.uploadFilesSimulator(index + 1);
                    } else {
                        this.files[index].progress += 5;
                    }
                }, 200);
            }
        }, 1000);
    }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>) {
        for (const item of files) {
            item.progress = 0;
            this.files.push(item);
        }
        this.openUploadDialogBox(files);
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

    openUploadDialogBox(files: Array<any>) {
        this.dialog.open(DialogComponent, {
            disableClose: true,
            data: {
                files,
                fileUpload: true,
                componentName: this.dataFromParentComponent,
                createFolderMetaData: this.currentDirectory,
                isPutRequest: this.requestTypeIsPut
            }
        }).componentInstance.submitClicked.subscribe((data) => {
            if (data) {
                if (this.currentDirectory.parentDirectoryId) {
                    this.currentDirectory.isFolder = true;
                    this.openFolder(this.currentDirectory);
                } else {
                this.getFilesForTable();

                }
            }
            this.requestTypeIsPut = null;
            this.resetImage();
        });
    }

    resetImage() {
        this.imageName.nativeElement.value = '';
    }

    addFolderPopUp() {
        this.dialog.open(DialogComponent, {
            width: Constants.DialogConstants.DEFAULT_WIDTH,
            data: {
                createFolder: true,
                createFolderMetaData: this.currentDirectory
            }
        }).componentInstance.submitClicked.subscribe((data) => {
            if (data) {
                if (this.currentDirectory.parentDirectoryId) {
                    this.currentDirectory.isFolder = true;
                    this.openFolder(this.currentDirectory);
                } else {
                    this.getFilesForTable();
                }
            }
        });
    }

    openFolder(file) {
        if (file.isFolder) {
            if (!this.currentPath.some(el => el.id === file.id)) {
                this.currentPath.push(file);
            }
            this.fileUploaderService.getFolderContent(file).subscribe(list => {
                list.childDirectories.map(directory => {
                    directory.isFolder = true;
                });
                this.filesForTable = list.childDirectories;
                this.filesForTable = this.filesForTable.concat(list.fileMetaData);
                this.currentDirectory = list;
            });
        } else {
            return;
        }
    }

    goToPreviousFolder() {
        this.currentPath.pop();
        const prevFolder = this.currentPath[this.currentPath.length - 1];
        if (prevFolder) {
            prevFolder.isFolder = true;
            this.openFolder(prevFolder);
        } else {
            this.getFilesForTable();
        }
    }

}
