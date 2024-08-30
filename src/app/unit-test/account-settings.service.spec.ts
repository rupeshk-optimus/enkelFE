import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AccountSettingsService } from '../services/account-settings.service';
import { userTestData, updateAccountData, successStatusCode } from './mock-test-data';

describe('AccountService', () => {
    let accountSettingsService: AccountSettingsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                { provide: AccountSettingsService, useClass: AccountSettingsService }
            ]
        });
        httpMock = getTestBed().get(HttpTestingController);
        accountSettingsService = TestBed.get(AccountSettingsService);
    });

    it('should be created', () => {
        expect(accountSettingsService).toBeTruthy();
    });

    it('should get account details of the user', () => {
        accountSettingsService.getAccountDetails().subscribe(data => {
            spyOn(accountSettingsService, 'getAccountDetails').and.callFake(() => {
                    return of(userTestData);
                    });
        });
        expect(userTestData).toBeTruthy();
    });

    it('should update account details of the user', () => {
        accountSettingsService.updateAccountDetails(updateAccountData).subscribe( data => {
            spyOn(accountSettingsService, 'updateAccountDetails').and.callFake(() => {
                return of(successStatusCode);
            });
        });
        expect(successStatusCode).toEqual(201);
    });
});

