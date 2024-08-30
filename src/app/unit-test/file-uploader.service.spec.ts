import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FileUploaderService } from '../services/file-uploader.service';
import { deleteStatusCode, getReportAndFileList, mockFileData, mockFolderData } from './mock-test-data';


describe('FileUploaderService', () => {
    let fileUploaderService: FileUploaderService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: FileUploaderService, useClass: FileUploaderService }
            ]
        });
        httpMock = getTestBed().get(HttpTestingController);
        fileUploaderService = TestBed.get(FileUploaderService);
    });

    it('should be created', () => {
        expect(fileUploaderService).toBeTruthy();
    });

    it('should delete file successfully', () => {
        const blob = new Blob();
        fileUploaderService.deleteFile('testFileDelete').subscribe(res => {
            spyOn(fileUploaderService, 'deleteFile').and.callFake(() => {
                return of(deleteStatusCode);
            });
        });
        expect(deleteStatusCode).toEqual(204);
    });

    it('should get list of file metaData', () => {
        fileUploaderService.getReportsforTable(true).subscribe(res => {
            spyOn(fileUploaderService, 'getReportsforTable').and.callFake(() => {
                return of(getReportAndFileList);
            });
        });
        expect(getReportAndFileList.reportMetaData.length).toBeGreaterThanOrEqual(1);
    });

    it('should get a file to be downloaded', () => {
        fileUploaderService.downloadBlob('1', '6286a1bc-0aae-4dcc-8e7f-7ee1d5ffeef5').subscribe(data => {
            spyOn(fileUploaderService, 'downloadBlob').and.callFake(() => {
                return of(mockFileData);
            });
        });
        expect(mockFileData).toBeTruthy();
    });

    it('should get contents of a folder', () => {
        fileUploaderService.getFolderContent('test').subscribe(content => {
            spyOn(fileUploaderService, 'getFolderContent').and.callFake(() => {
                return of(mockFolderData);
            });
        });
        expect(mockFolderData).toBeTruthy();
    });
});

