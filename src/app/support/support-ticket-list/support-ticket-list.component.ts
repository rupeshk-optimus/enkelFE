import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';

import { PaginationModel } from 'src/app/models/pagination.model';
import { SupportTicketFilterModel } from 'src/app/models/support-ticket-filter.model';
import { ReportService } from 'src/app/services/report.service';
import { SharedService } from 'src/app/services/shared.service';
import { SupportService } from 'src/app/services/support.service';
import { Constants } from 'src/app/shared/constants';
import { SupportTicketMetaDataModel } from 'src/app/models/support-ticket-metadata.model';

@Component({
    selector: 'app-support-ticket-list',
    templateUrl: './support-ticket-list.component.html',
    styleUrls: ['./support-ticket-list.component.scss']
})
export class SupportTicketListComponent implements OnInit {
    tableHeader = ['Subject', '', 'From', 'State', 'Sent'];
    supportTickets = [];
    filterSupportTicketForm: FormGroup;
    supportTicketStatus = Constants.supportTicketOptions.TICKET_STATUS;
    supportTicketFilters: SupportTicketFilterModel;
    supportTicketMetaData: SupportTicketMetaDataModel;
    paginationTools = new PaginationModel();
    totalPages = [];
    Constants = Constants;


    constructor(
        private fb: FormBuilder,
        public reportService: ReportService,
        public sharedService: SharedService,
        private router: Router,
        private supportService: SupportService
    ) { }

    ngOnInit() {
        this.sharedService.pageHeading.next(Constants.appConstants.SUPPORT);
        this.sharedService.imgHeading.next(Constants.appConstants.SUPPORT_IMG);
        this.createSupportTicketFilterForm();
        this.getAllSupportTicket();
        this.getSupportTicketMetaData();
        Observable.combineLatest(
            this.filterSupportTicketForm.controls.supportTicketSearchKeyword.valueChanges.debounceTime(1000).startWith(''),
            this.filterSupportTicketForm.controls.supportTicketStatus.valueChanges.startWith(''),
            this.filterSupportTicketForm.controls.supportTicketSent.valueChanges.startWith(''),
            (supportTicketSearchKeyword, supportTicketStatus, supportTicketSent) => ({
                supportTicketSearchKeyword, supportTicketStatus, supportTicketSent
            })
        ).subscribe(criteria => {
            // let filterNotPresent = this.checkProperties(criteria);
            if (criteria) {
                // console.log('criteria',criteria , filterNotPresent )
                this.supportTicketFilters = this.assignFiltersToFilterObject(criteria);
                this.getAllSupportTicket();
                this.getSupportTicketMetaData();
            }
            // TO BE ADDED LATER
            // this.router.navigate([Constants.navigations.SUPPORT],
            //     { queryParams: { searchKeyword: JSON.stringify(data) } }
            // );
        });
    }

    // checkProperties(obj) {
    //     for (var key in obj) {
    //         if (obj[key] !== null && obj[key] != "")
    //             return false;
    //     }
    //     return true;
    // }

    /**
     * @description Assigns filters to filter object
     * @returns  work item filter object
     */
    assignFiltersToFilterObject(filters: any) {
        const supportTicketFilter = new SupportTicketFilterModel();
        supportTicketFilter.supportTicketStatusId = filters.supportTicketStatus;
        if (filters.supportTicketSent) {
            supportTicketFilter.receivedAt = new Date(filters.supportTicketSent).toDateString();
        }
        supportTicketFilter.searchKeyWord = filters.supportTicketSearchKeyword;

        return supportTicketFilter;
    }

    /**
     * @description Gets all work item list
     */
    getAllSupportTicket() {
        this.supportService.getAllSupportTickets(this.supportTicketFilters).subscribe(supportTickets => {
            this.setSupportTicketListDataSource(supportTickets);
        });
    }

    /**
     * @description Gets next
     * @param pageNumber contains the pagination pageNumber
     */
    getNext(pageNumber: number) {
        const pageEvent = new PageEvent();
        pageEvent.pageIndex = pageNumber;
        pageEvent.pageSize = 50;
        this.supportService.getAllSupportTickets(this.supportTicketFilters, pageEvent).subscribe(supportTickets => {
            this.setSupportTicketListDataSource(supportTickets);
        });
    }

    /**
     * @description Gets support ticket meta data by id
     */
    getSupportTicketMetaData() {
        this.supportService.getMetaDataForSupportTicket()
            .subscribe(metaData => {
                this.supportTicketMetaData = metaData;
            });
    }

    /**
     * @description Sets work item list data source
     * @param supportTickets from the server
     */
    private setSupportTicketListDataSource(supportTickets: PaginationModel) {
        supportTickets.data.map(ticket => {
            ticket.state = Constants.supportTicketOptions.TICKET_STATUS
                .find(status => status.id === ticket.supportTicketStatusId).name;
            ticket.receivedAt = new Date(ticket.receivedAt + 'Z');
            ticket.color = Constants.supportTicketOptions.TICKET_STATUS
                .find(status => status.id === ticket.supportTicketStatusId).color;
        });
        this.supportTickets = supportTickets.data;
        this.paginationTools.hasNext = supportTickets.hasNext;
        this.paginationTools.currentPage = supportTickets.currentPage;
        this.paginationTools.hasPrevious = supportTickets.hasPrevious;
        this.paginationTools.totalCount = supportTickets.totalCount;
        this.paginationTools.totalPages = supportTickets.totalPages + 1;
        this.totalPages = Array(this.paginationTools.totalPages + 1).fill(0).map((x, i) => i);
        this.totalPages.shift();
    }

    /**
     * @description Creates work item filter form
     */
    createSupportTicketFilterForm() {
        this.filterSupportTicketForm = this.fb.group({
            supportTicketSearchKeyword: '',
            supportTicketStatus: '',
            supportTicketSent: ''
        });
    }

    resetFilter() {
        this.filterSupportTicketForm.reset();
        this.supportTicketFilters = new SupportTicketFilterModel();
        this.getAllSupportTicket();
        this.getSupportTicketMetaData();
    }

    editSupportTicket(ticket) {
        const { SUPPORT, EDIT } = Constants.navigations;
        const { id, guid } = ticket;
        this.router.navigate([SUPPORT, guid, id, EDIT]);
    }

}
