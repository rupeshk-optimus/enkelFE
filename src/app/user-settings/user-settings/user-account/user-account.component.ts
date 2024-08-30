import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { UserAccountModel } from 'src/app/models/user-account.model';
import { MetaDataValueModel } from 'src/app/models/meta-data-value.model';

import { forgotPasswordAuthority, tenantConfig } from 'src/environments/msConfig';
import { Constants } from 'src/app/shared/constants';

import { MsalService } from '@azure/msal-angular';
import { AccountSettingsService } from 'src/app/services/account-settings.service';
import { AuthService } from 'src/app/services/auth.service';
import { ISubscription } from 'rxjs/Subscription';
import { SharedService } from 'src/app/services/shared.service';
import { RolesEnum } from 'src/app/enum/roles.enum';

@Component({
    selector: 'app-user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements AfterContentChecked, OnInit, OnDestroy {
    constants = Constants;
    myAccountdetails: UserAccountModel;
    profileForm: FormGroup;
    showAddSecondaryEmailButton = true;
    showAddPhoneButton = true;
    showAddWebsiteButton = true;
    showEditFormButton = false;
    allowEditForm = false;
    roles: string;
    private subscription: ISubscription[] = [];

    get myAccountSecondaryEmails(): FormArray {
        return this.profileForm.get(Constants.FormControlNames.MY_ACCOUNT_SECONDARY_EMAILS) as FormArray;
    }

    get myAccountPhoneNumbers(): FormArray {
        return this.profileForm.get(Constants.FormControlNames.MY_ACCOUNT_PHONE_NUMBERS) as FormArray;
    }

    get myAccountWebsites(): FormArray {
        return this.profileForm.get(Constants.FormControlNames.MY_ACCOUNT_WEBSITES) as FormArray;
    }

    constructor(
        private fb: FormBuilder,
        private msalService: MsalService,
        private accountSettingsService: AccountSettingsService,
        private cdref: ChangeDetectorRef,
        private snackBar: MatSnackBar,
        private sharedService: SharedService
    ) { }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    ngOnInit() {
        this.createProfileForm();
        this.getAccountDetails();
    }

    createProfileForm() {
        this.profileForm = this.fb.group({
            myAccountFirstName: ['', Validators.required],
            myAccountLastName: ['', Validators.required],
            myAccountRole: '',
            myAccountPrimaryEmail: ['', [Validators.required, Validators.email]],
            myAccountSecondaryEmails: this.fb.array([this.buildEmail()]),
            myAccountPhoneNumbers: this.fb.array([this.buildPhoneNumber()]),
            myAccountWebsites: this.fb.array([this.buildPhoneNumber()])
        });
    }

    buildEmail(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.email]]
        });
    }

    addEmail(): void {
        const emails = this.profileForm.controls.myAccountSecondaryEmails as FormArray;
        emails.push(this.buildEmail());
        this.showAddSecondaryEmailButton = (emails.length < Constants.appConstants.METADATA_MAXIMUM_LENGTH) ? true : false;
        this.profileForm.updateValueAndValidity();
    }

    removeEmail(index: number) {
        const emails = this.profileForm.controls.myAccountSecondaryEmails as FormArray;
        emails.removeAt(index);
        this.showAddSecondaryEmailButton = true;
        this.profileForm.updateValueAndValidity();
    }

    buildPhoneNumber(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]]
        });
    }

    addPhoneNumber(): void {
        const phoneNumbers = this.profileForm.controls.myAccountPhoneNumbers as FormArray;
        phoneNumbers.push(this.buildPhoneNumber());
        this.showAddPhoneButton = (phoneNumbers.length < Constants.appConstants.METADATA_MAXIMUM_LENGTH) ? true : false;
        this.profileForm.updateValueAndValidity();
    }

    removePhoneNumber(index: number) {
        const phoneNumbers = this.profileForm.controls.myAccountPhoneNumbers as FormArray;
        phoneNumbers.removeAt(index);
        this.showAddPhoneButton = true;
        this.profileForm.updateValueAndValidity();
    }

    buildWebsite(): FormGroup {
        const urlValidationRegex = '^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$';
        return this.fb.group({
            name: ['', [Validators.required, Validators.pattern(urlValidationRegex)]]
        });
    }

    addWebsite(): void {
        const websites = this.profileForm.controls.myAccountWebsites as FormArray;
        websites.push(this.buildWebsite());
        this.showAddWebsiteButton = (websites.length < Constants.appConstants.METADATA_MAXIMUM_LENGTH) ? true : false;
        this.profileForm.updateValueAndValidity();
    }

    removeWebsite(index: number) {
        const websites = this.profileForm.controls.myAccountWebsites as FormArray;
        websites.removeAt(index);
        this.showAddWebsiteButton = true;
        this.profileForm.updateValueAndValidity();
    }

    setExistingFormArrays(metaDataArray): FormArray {
        const formArray = new FormArray([]);
        metaDataArray.forEach(metaData => {
            formArray.push(
                this.fb.group({
                    id: metaData.id,
                    name: metaData.name
                })
            );
        });
        return formArray;
    }

    setAccountDetails(obj: UserAccountModel) {
        this.profileForm.patchValue({
            myAccountFirstName: obj.firstName,
            myAccountLastName: obj.lastName,
            myAccountRole: obj.roles,
            myAccountPrimaryEmail: obj.primaryEmail
        });
        this.profileForm.setControl(Constants.FormControlNames.MY_ACCOUNT_SECONDARY_EMAILS,
            this.setExistingFormArrays(obj.secondaryEmails));
        this.profileForm.setControl(Constants.FormControlNames.MY_ACCOUNT_PHONE_NUMBERS, this.setExistingFormArrays(obj.contactNumbers));
        this.profileForm.setControl(Constants.FormControlNames.MY_ACCOUNT_WEBSITES, this.setExistingFormArrays(obj.websites));
        this.roles = Object.keys(RolesEnum).find(role => RolesEnum[role] === +localStorage.getItem(Constants.localstorageKeys.ROLE_ID));
    }


    getAccountDetails() {
        const subscription = this.accountSettingsService.getAccountDetails().subscribe(data => {
            this.setAccountDetails(data);
            this.myAccountdetails = data;
            this.showEditFormButton = (data.epUserId) ? false : true;
        });
        this.subscription.push(subscription);
    }

    findDuplicate(name, formArrayName) {
        let metaData;
        switch (formArrayName) {
            case Constants.FormControlNames.MY_ACCOUNT_SECONDARY_EMAILS:
                metaData = this.myAccountSecondaryEmails;
                if (metaData.touched) {
                    this.showAddSecondaryEmailButton = metaData.valid;
                }
                break;
            case Constants.FormControlNames.MY_ACCOUNT_PHONE_NUMBERS:
                metaData = this.myAccountPhoneNumbers;
                if (metaData.touched) {
                    this.showAddPhoneButton = metaData.valid;
                }
                break;
            case Constants.FormControlNames.MY_ACCOUNT_WEBSITES:
                metaData = this.myAccountWebsites;
                if (metaData.touched) {
                    this.showAddWebsiteButton = metaData.valid;
                }
                break;
        }

        const repeatedMetaData = metaData.value.filter(data => data.name === name);
        if (repeatedMetaData.length > Constants.appConstants.MINIMUM_LENGTH) {
            metaData.setErrors({
                notUnique: true
            });
            return true;
        } else {
            return false;
        }
    }

    resetPassword() {
        this.msalService.authority = forgotPasswordAuthority;
        this.msalService.loginRedirect(tenantConfig.scopes);
    }

    resetForm() {
        this.createProfileForm();
        this.getAccountDetails();
        this.allowEditForm = false;
        this.showEditFormButton = true;
    }

    updateDetails() {
        const updatedProfile = this.assignFormDataToUserAccountModel(this.profileForm.value);
        const subscription = this.accountSettingsService.updateAccountDetails(updatedProfile).subscribe(res => {
            this.snackBar.open(Constants.notifications.UPDATE_SUCCESS, Constants.notifications.SUCCESS, {
                duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                panelClass: 'mail-success'
            });
            this.allowEditForm = false;
            this.showEditFormButton = true;
        });
        this.subscription.push(subscription);
    }

    assignFormDataToUserAccountModel(obj) {
        const userAccountModel = new UserAccountModel();
        userAccountModel.clientContactGuid = this.myAccountdetails.clientContactGuid;
        userAccountModel.clientContactId = this.myAccountdetails.clientContactId;
        userAccountModel.clientName = this.myAccountdetails.clientName;
        userAccountModel.contactNumbers = obj.myAccountPhoneNumbers;
        userAccountModel.cpUserAccounts = this.myAccountdetails.cpUserAccounts;
        userAccountModel.createdBy = this.myAccountdetails.createdBy;
        userAccountModel.firstName = obj.myAccountFirstName;
        userAccountModel.guid = this.myAccountdetails.guid;
        userAccountModel.id = this.myAccountdetails.id;
        userAccountModel.lastName = obj.myAccountLastName;
        userAccountModel.primaryEmail = this.myAccountdetails.primaryEmail;
        userAccountModel.secondaryEmails = obj.myAccountSecondaryEmails;
        userAccountModel.statusId = this.myAccountdetails.statusId;
        userAccountModel.updatedBy = +localStorage.getItem(Constants.localstorageKeys.ID);
        userAccountModel.websites = obj.myAccountWebsites;
        return userAccountModel;
    }

    allowingEditForm() {
        this.allowEditForm = true;
        this.showEditFormButton = false;
    }

    ngOnDestroy() {
        this.subscription.forEach(s => {
            s.unsubscribe();
        });
    }
}
