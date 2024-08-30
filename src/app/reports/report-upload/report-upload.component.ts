import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { FileOnGrid } from 'src/app/models/file-on-grid.model';
import { ReportService } from 'src/app/services/report.service';
import { DirectoriesModel } from 'src/app/models/directories.model';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import {saveAs} from 'file-saver';

@Component({
    selector: 'app-report-upload',
    templateUrl: './report-upload.component.html',
    styleUrls: ['./report-upload.component.scss']
})
export class ReportUploadComponent implements OnInit {
    componentName = Constants.appConstants.REPORTS;
    constants = Constants;
    filesForTable = Array<FileOnGrid>();
    currentDirectory: DirectoriesModel;
    currentPath = [];

    constructor(
        public sharedService: SharedService,
        private reportService: ReportService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        if (this.route.snapshot.queryParams.id) {
            const id = this.route.snapshot.queryParams.id;
            const guid = this.route.snapshot.queryParams.guid;
            const name = this.route.snapshot.queryParams.name;
            this.downloadReport(name, id, guid);
        }
        this.getFilesForTable();
    }

    getFilesForTable() {
        this.reportService.getReportsforTable().subscribe(list => {
            list.childDirectories.map(directory => {
                directory.isFolder = true;
            });
            this.filesForTable = list.childDirectories;
            this.filesForTable = this.filesForTable.concat(list.reportMetaData);
            this.currentDirectory = list;
        });
    }

    downloadReport(name: string, id: string, guid: string, downloadUrl?: string) {
        this.reportService.downloadBlob(id, guid).subscribe(blob => {
            // saveAs(file.url);
            // const a = window.document.createElement('a');
            // a.href = file.url;
            // a.download = name;
            // a.click();
            // a.remove();
            // const blob = new Blob([file], { type: Constants.allowedFileFormat.ALL });
            // console.log(blob)
            // var fileURL = URL.createObjectURL(blob);
            // window.open(fileURL);
            saveAs(blob, name);
        }, err => {
            console.log(err);
        });
    }

    openFolder(file) {
        if (file.isFolder) {
            if (!this.currentPath.some(el => el.id === file.id)) {
                this.currentPath.push(file);
            }
            this.reportService.getFolderContent(file).subscribe(list => {
                list.childDirectories.map(directory => {
                    directory.isFolder = true;
                });
                this.filesForTable = list.childDirectories;
                this.filesForTable = this.filesForTable.concat(list.reportMetaData);
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

    previewFile(name: string, id: string, guid: string, isFolder?: boolean) {
        if (isFolder) {
            return;
        }
        this.dialog.open(DialogComponent, {
            width: Constants.DialogConstants.FILE_WIDTH,
            data: {
                preview: {
                    name,
                    id,
                    guid
                }
            }
        });
    }

}
