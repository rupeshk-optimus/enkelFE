import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ReportService } from '../services/report.service';
import { dashboardReportUrl, getReportAndFileList, mockFileData, mockFolderData } from './mock-test-data';


describe('ReportService', () => {
    let reportService: ReportService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: ReportService, useClass: ReportService }
            ]
        });
        httpMock = getTestBed().get(HttpTestingController);
        reportService = TestBed.get(ReportService);
    });

    it('should be created', () => {
        expect(reportService).toBeTruthy();
    });

    it('should get url for dashboard reports', () => {
        reportService.getReports(1, 'abctest').subscribe(reportUrl => {
            spyOn(reportService, 'getReports').and.callFake(() => {
                return of(dashboardReportUrl);
            });
        });
        expect(dashboardReportUrl).toBeTruthy();
    });

    it('should get list of report metaData', () => {
        reportService.getReportsforTable().subscribe(reportData => {
            spyOn(reportService, 'getReportsforTable').and.callFake(() => {
                return of(getReportAndFileList);
            });
        });
        expect(getReportAndFileList.reportMetaData.length).toBeGreaterThanOrEqual(1);
    });

    it('should get a report to be downloaded', () => {
        reportService.downloadBlob('1', '6286a1bc-0aae-4dcc-8e7f-7ee1d5ffeef5').subscribe(data => {
            spyOn(reportService, 'downloadBlob').and.callFake(() => {
                return of(mockFileData);
            });
        });
        expect(mockFileData).toBeTruthy();
        expect(mockFileData).toBeDefined();
    });

    it('should get contents of a folder', () => {
        reportService.getFolderContent('test').subscribe(content => {
            spyOn(reportService, 'getFolderContent').and.callFake(() => {
                return of(mockFolderData);
            });
        });
        expect(mockFolderData).toBeTruthy();
    });
});

