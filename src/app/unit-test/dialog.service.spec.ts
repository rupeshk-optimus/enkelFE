import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { DialogService } from '../services/dialog.service';
import { mockClientList, mockCreateFolder, successStatusCode } from './mock-test-data';

describe('DialogService', () => {
    let dialogService: DialogService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: DialogService, useClass: DialogService }
            ]
        });
        httpMock = getTestBed().get(HttpTestingController);
        dialogService = TestBed.get(DialogService);
    });

    it('should be created', () => {
        expect(dialogService).toBeTruthy();
    });

    it('should get a list of clients', () => {
        dialogService.getClients().subscribe(data => {
            spyOn(dialogService, 'getClients').and.callFake(() => {
                return of(mockClientList);
            });
        });
        expect(mockClientList.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should create a folder', () => {
        dialogService.createFolder(mockCreateFolder).subscribe(data => {
            spyOn(dialogService, 'createFolder').and.callFake(() => {
                return of(successStatusCode);
            });
        });
        expect(successStatusCode).toEqual(201);
    });
});
