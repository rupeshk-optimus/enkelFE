import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { CpUserService } from 'src/app/services/cp-user.service';
import { Constants } from 'src/app/shared/constants';

import { ClientContactModel } from 'src/app/models/client-contact.model';
import { RemoveUserModel } from 'src/app/models/removeUser.model';
import { MetaDataValueModel } from 'src/app/models/meta-data-value.model';
import { ChangeRoleModel } from 'src/app/models/change-role.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { RolesEnum } from 'src/app/enum/roles.enum';
import { SharedService } from 'src/app/services/shared.service';
import { ClientContactStatusEnum } from 'src/app/enum/client-contact-status.enum';

@Component({
    selector: 'app-portal-users',
    templateUrl: './portal-users.component.html',
    styleUrls: ['./portal-users.component.scss']
})
export class PortalUsersComponent implements OnInit, OnDestroy {
    displayedColumns = ['Name', 'Status', 'Roles', 'Access'];
    dataSource: ClientContactModel[] = [];
    Constants = Constants;
    clientContactStatusEnum = ClientContactStatusEnum;
    contactRoles: MetaDataValueModel[] = [];
    private subscription: ISubscription[] = [];
    noUsers = false;
    roleControl;
    roleArray = [];
    readonly = false;
    loggedInUserRole;
    paginationTools = new PaginationModel();
    totalPages = [];
    showAddContactButton = false;
    isEpUser = false;

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    constructor(
        private cpUserService: CpUserService,
        private router: Router,
        private snackBar: MatSnackBar,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        if (Number.parseInt(localStorage.getItem(Constants.localstorageKeys.ROLE_ID), 10) === RolesEnum.User) {
            this.loggedInUserRole = Number.parseInt(localStorage.getItem(Constants.localstorageKeys.ROLE_ID), 10);
        }
        this.getClientContacts(Constants.queryParameters.INITIAL_PAGE);
    }

    getClientContacts(pageNumber: number) {
        const subscription = this.cpUserService.getClientContacts(pageNumber).subscribe(contacts => {
            contacts.data.map(client => {
                if (client.cpUser) {
                    client.status = (client.cpUser.statusId) ? Object.keys(ClientContactStatusEnum)
                        .find(status => ClientContactStatusEnum[status] === client.cpUser.statusId) : Constants.ContactStatus.NOT_INVITED;
                    client.accountRole = client.cpUser.cpUserAccounts.find(account => account.clientId === client.clientId);
                }
            });
            this.dataSource = contacts.data;
            this.noUsers = contacts.data.length > 0 ? false : true;
            this.paginationTools.hasNext = contacts.hasNext;
            this.paginationTools.currentPage = contacts.currentPage;
            this.paginationTools.hasPrevious = contacts.hasPrevious;
            this.paginationTools.totalCount = contacts.totalCount;
            this.paginationTools.totalPages = contacts.totalPages + 1;
            this.totalPages = Array(this.paginationTools.totalPages + 1).fill(0).map((x, i) => i);
            this.totalPages.shift();
        });
        this.subscription.push(subscription);
    }

    getContactDetails(contact) {
        this.router.navigate([Constants.navigations.SETTINGS, Constants.navigations.USERS,
        contact.id, contact.guid, Constants.navigations.EDIT]);
    }

    getTooltip(contact) {
        return (contact.cpUser.status.status === Constants.ContactStatus.ACTIVE) ? Constants.ContactActions.REMOVE_ACCESS :
            (contact.cpUser.status.status === Constants.ContactStatus.PENDING) ? null : Constants.ContactActions.GRANT_ACCESS;
    }

    assignedRoles(roles) {
        const assignedRoles = [];
        roles.forEach(role => {
            assignedRoles.push(role.name);
        });
        return assignedRoles;
    }

    ngOnDestroy() {
        this.subscription.forEach(s => {
            s.unsubscribe();
        });
    }
}
