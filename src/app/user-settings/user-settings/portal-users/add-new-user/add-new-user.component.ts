import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CpUserService } from 'src/app/services/cp-user.service';
import { Constants } from 'src/app/shared/constants';

import { ClientContactModel } from 'src/app/models/client-contact.model';
import { MetaDataValueModel } from 'src/app/models/meta-data-value.model';
import { ClientListModel } from 'src/app/models/client-list.model';
import { UserAccountModel } from 'src/app/models/user-account.model';
import { ISubscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';
import { RolesEnum } from 'src/app/enum/roles.enum';

@Component({
    selector: 'app-add-new-user',
    templateUrl: './add-new-user.component.html',
    styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements AfterContentChecked, OnInit, OnDestroy {
    cpUserForm: FormGroup;
    cpUserId: string;
    cpUserGuid: string;
    clientId: string;
    contactRoles: MetaDataValueModel[] = [];
    clients: ClientListModel[] = [];
    loggedInUserId: string;
    showClientList: boolean;
    showAddSecondaryEmail = true;
    showAddPhoneButton = true;
    private subscription: ISubscription[] = [];
    constants = Constants;
    loggedInUserRole;

    get cpUserSecondaryEmails(): FormArray {
        return this.cpUserForm.get(Constants.FormControlNames.CP_USER_SECONDARY_EMAILS) as FormArray;
    }

    get cpUserPhoneNumbers(): FormArray {
        return this.cpUserForm.get(Constants.FormControlNames.CP_USER_PHONE_NUMBERS) as FormArray;
    }
    constructor(
        private fb: FormBuilder,
        private cpUserService: CpUserService,
        private router: Router,
        private route: ActivatedRoute,
        private cdref: ChangeDetectorRef,
        private snackBar: MatSnackBar,

    ) {
        const subscription = this.route.paramMap.subscribe(params => {
            this.cpUserId = params.get('id');
            this.cpUserGuid = params.get('guid');
        });
        this.subscription.push(subscription);
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    ngOnInit() {
        this.loggedInUserRole = Number.parseInt(localStorage.getItem(Constants.localstorageKeys.ROLE_ID), 10);
        this.createUserForm();
        if (this.cpUserGuid !== '0') {
            const clientID = this.cpUserForm.controls.cpClient;
            clientID.clearValidators();
            this.cpUserForm.updateValueAndValidity();
        }
        this.clientId = localStorage.getItem(Constants.localstorageKeys.CLIENT_ID);
        this.showClientList = ((this.clientId !== '0' && this.cpUserId === '0') || this.cpUserId !== '0') ? false : true;
        this.loggedInUserId = localStorage.getItem(Constants.localstorageKeys.ID);
    }

    createUserForm() {
        this.cpUserForm = this.fb.group({
            cpClientContactId: '',
            cpClient: ['', Validators.required],
            cpUserFirstName: ['', Validators.required],
            cpUserLastName: ['', Validators.required],
            cpUserRole: '',
            cpUserTitle: '',
            cpUserPrimaryEmail: ['', [Validators.required, Validators.email]],
            cpUserSecondaryEmails: this.fb.array([]),
            cpUserPhoneNumbers: this.fb.array([]),
        });
        if (!this.showClientList) {
            this.upateFormControlAsPerRoleAssigned();
        }
    }

    upateFormControlAsPerRoleAssigned() {
        const nameControl = this.cpUserForm.get('cpClient');
        this.cpUserForm.patchValue({
            cpClient: null
        });
        nameControl.clearValidators();
        nameControl.updateValueAndValidity();
    }

    onSubmit() {
        // TO_BE_REMOVED
        // const newClientContact = (this.cpUserGuid === '0') ?
        //     this.assignFormDataToClientContactModel(this.cpUserForm.value)
        // : this.assignFormDataToUserAccountModel(this.cpUserForm.value);
        // const subscription = this.cpUserService.createClientContact(newClientContact, this.cpUserGuid).subscribe(contact => {
        //     this.router.navigate([Constants.navigations.SETTINGS + Constants.symbols.pathVariableSymbol + Constants.navigations.USERS]);
        // }, error => {
        //     this.snackBar.open(error.error, Constants.notifications.ERROR_LABEL, {
        //         duration: Constants.notifications.NOTIFICATION_DURATION * 1000
        //     });
        // });
        // this.subscription.push(subscription);
    }

    assignFormDataToClientContactModel(obj) {
        const clientContact = new ClientContactModel();
        clientContact.clientId = (this.clientId === '0') ?  Number.parseInt(obj.cpClient, 10) : Number.parseInt(this.clientId, 10);
        clientContact.firstName = obj.cpUserFirstName;
        clientContact.lastName = obj.cpUserLastName;
        clientContact.roles = obj.cpUserRole;
        clientContact.primaryEmail = obj.cpUserPrimaryEmail;
        clientContact.secondaryEmails = obj.cpUserSecondaryEmails;
        clientContact.contactNumbers = obj.cpUserPhoneNumbers;
        return clientContact;
    }

    assignFormDataToUserAccountModel(obj) {
        const user = new UserAccountModel();
        user.contactId = (this.clientId === '0') ?  Number.parseInt(obj.cpClient, 10) : Number.parseInt(this.clientId, 10);
        user.clientContactId = Number.parseInt(obj.cpClientContactId, 10);
        user.clientContactGuid = this.cpUserGuid;
        user.firstName = obj.cpUserFirstName;
        user.lastName = obj.cpUserLastName;
        user.primaryEmail = obj.cpUserPrimaryEmail;
        user.secondaryEmails = obj.cpUserSecondaryEmails;
        user.contactNumbers = obj.cpUserPhoneNumbers;
        user.roles = obj.cpUserRole;
        user.createdBy = Number.parseInt(this.loggedInUserId, 10);
        user.updatedBy = Number.parseInt(this.loggedInUserId, 10);
        return user;
    }

    setContactDetails(obj: ClientContactModel) {
        this.cpUserForm.patchValue({
            cpUserFirstName: obj.firstName,
            cpUserLastName: obj.lastName,
            cpUserPrimaryEmail: obj.primaryEmail,
            cpClientContactId: this.cpUserId
        });
        this.cpUserForm.setControl(Constants.FormControlNames.CP_USER_SECONDARY_EMAILS, this.setExistingFormArrays(obj.secondaryEmails));
        this.cpUserForm.setControl(Constants.FormControlNames.CP_USER_PHONE_NUMBERS, this.setExistingFormArrays(obj.contactNumbers));
    }

    buildEmail(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.email]]
        });
    }

    addEmail(): void {
        const emails = this.cpUserForm.controls.cpUserSecondaryEmails as FormArray;
        emails.push(this.buildEmail());
        this.showAddSecondaryEmail = (emails.length < Constants.appConstants.METADATA_MAXIMUM_LENGTH) ? true : false;
        this.cpUserForm.updateValueAndValidity();
    }

    removeEmail(index: number) {
        const emails = this.cpUserForm.controls.cpUserSecondaryEmails as FormArray;
        emails.removeAt(index);
        this.showAddSecondaryEmail = true;
        this.cpUserForm.updateValueAndValidity();
    }

    buildPhoneNumber(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]]
        });
    }

    addPhoneNumber(): void {
        const phoneNumbers = this.cpUserForm.controls.cpUserPhoneNumbers as FormArray;
        phoneNumbers.push(this.buildPhoneNumber());
        this.showAddPhoneButton = (phoneNumbers.length < Constants.appConstants.METADATA_MAXIMUM_LENGTH) ? true : false;
        this.cpUserForm.updateValueAndValidity();
    }

    removePhoneNumber(index: number) {
        const phoneNumbers = this.cpUserForm.controls.cpUserPhoneNumbers as FormArray;
        phoneNumbers.removeAt(index);
        this.showAddPhoneButton = true;
        this.cpUserForm.updateValueAndValidity();
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

    findDuplicate(name, formArrayName) {
        const metaData = (formArrayName === Constants.FormControlNames.CP_USER_SECONDARY_EMAILS) ?
            this.cpUserSecondaryEmails : this.cpUserPhoneNumbers;

        // updating add MetaData button validations
        (formArrayName === Constants.FormControlNames.CP_USER_SECONDARY_EMAILS) ?
         this.showAddSecondaryEmail = (metaData.valid) ? true : false : this.showAddPhoneButton = (metaData.valid) ? true : false;

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

    ngOnDestroy() {
        this.subscription.forEach(s => {
            s.unsubscribe();
        });
    }

    resetForm() {
      this.createUserForm();
    }
}
