import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { clientContactMockList } from './mock-test-data';
import { CpUserService } from '../services/cp-user.service';

describe('CpUserService', () => {
    let cpUserService: CpUserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: CpUserService, useClass: CpUserService }
            ]
        });
        httpMock = getTestBed().get(HttpTestingController);
        cpUserService = TestBed.get(CpUserService);
    });

    it('should be created', () => {
        expect(cpUserService).toBeTruthy();
    });

    it('should get list of Client contacts', () => {
        cpUserService.getClientContacts(1).subscribe(data => {
            spyOn(cpUserService, 'getClientContacts').and.callFake(() => {
                return of(clientContactMockList);
            });
        });
        expect(clientContactMockList.data.length).toBeGreaterThanOrEqual(1);
    });
});

