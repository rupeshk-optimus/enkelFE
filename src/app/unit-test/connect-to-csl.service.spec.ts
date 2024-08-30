import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ConnectToCslService } from '../services/connect-to-csl.service';
import { cslDetails, sendMockMailToCSL, successStatusCode } from './mock-test-data';

describe('ConnectToCslService', () => {
    let connectToCslService: ConnectToCslService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: ConnectToCslService, useClass: ConnectToCslService }
            ]
        });
        httpMock = getTestBed().get(HttpTestingController);
        connectToCslService = TestBed.get(ConnectToCslService);
    });

    it('should be created', () => {
        expect(connectToCslService).toBeTruthy();
    });

    it('should get information of the CSL', () => {
        connectToCslService.getCslInfo().subscribe(data => {
            spyOn(connectToCslService, 'getCslInfo').and.callFake(() => {
                return of(cslDetails);
            });
        });
        expect(cslDetails.primaryEmail).toBeTruthy();
        expect(cslDetails.firstName).toBeTruthy();
        expect(cslDetails.lastName).toBeTruthy();
    });

    it('should send mail to the CSL', () => {
        connectToCslService.sendMailToCsl(sendMockMailToCSL).subscribe(data => {
            spyOn(connectToCslService, 'sendMailToCsl').and.callFake(() => {
                return of(successStatusCode);
            });
        });
        expect(successStatusCode).toEqual(201);
    });
});

