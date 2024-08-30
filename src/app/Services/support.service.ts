import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { PaginationModel } from '../models/pagination.model';
import { SupportTicketFilterModel } from '../models/support-ticket-filter.model';
import { SupportTicketMetaDataModel } from '../models/support-ticket-metadata.model';
import { Constants } from '../shared/constants';

@Injectable({
    providedIn: 'root'
})
export class SupportService {

    constructor(private httpClient: HttpClient) { }

    /**
     * @description Gets all support tickets
     * @param filters to be added
     * @param [page] contains event for pagination
     * @returns all support tickets from the server
     */
    getAllSupportTickets(filters: SupportTicketFilterModel, page?: PageEvent): Observable<PaginationModel> {
        const userId = localStorage.getItem(Constants.localstorageKeys.ID);
        const userGuid = localStorage.getItem(Constants.localstorageKeys.GUID);
        const { SUPPORT_TICKET, USERS } = Constants.endPoints;
        let params: HttpParams = new HttpParams();
        if (filters) {
            for (const key in filters) {
                if (filters[key]) {
                    params = params.append(key, filters[key]);
                }
            }
        }
        if (page) {
            params = params.append(Constants.queryParameters.PAGE, `${page.pageIndex}`)
                .append(Constants.queryParameters.PAGE_SIZE, `${page.pageSize}`);
        }
        return this.httpClient.get<PaginationModel>(`${SUPPORT_TICKET}/${USERS}/${userId}/${userGuid}`, { params });
    }

    /**
     * @description Gets support ticket by id
     * @param supportTicketId of the selected support ticket
     * @param supportTicketGuid of the selected support ticket
     * @returns support ticket by id from the server
     */
    getSupportTicketById(supportTicketId: number, supportTicketGuid: string): Observable<any> {
        return this.httpClient.get<any>(`${Constants.endPoints.SUPPORT_TICKET}/${supportTicketId}/${supportTicketGuid}`);
    }

    /**
     * @description Gets attachments for support ticket
     * @param supportTicketId of the selected support ticket
     * @param supportTicketGuid of the selected support ticket
     * @returns attachments for support ticket from the server
     */
    getAttachmentsForSupportTicket(supportTicketId: number, supportTicketGuid: string): Observable<PaginationModel> {
        const { SUPPORT_TICKET_ATTACHMENT, SUPPORT_TICKET } = Constants.endPoints;
        return this.httpClient.get<any>(
            `${SUPPORT_TICKET_ATTACHMENT}/${SUPPORT_TICKET}/${supportTicketId}/${supportTicketGuid}`);
    }

    /**
     * @description Gets responses for support ticket
     * @param supportTicketId of the selected support ticket
     * @param supportTicketGuid of the selected support ticket
     * @returns responses for support ticket from the server
     */
    getResponsesForSupportTicket(supportTicketId: number, supportTicketGuid: string): Observable<PaginationModel> {
        const { SUPPORT_TICKET_RESPONSES, SUPPORT_TICKET } = Constants.endPoints;
        return this.httpClient.get<any>(
            `${SUPPORT_TICKET_RESPONSES}/${SUPPORT_TICKET}/${supportTicketId}/${supportTicketGuid}`);
    }

    /**
     * @description Gets meta data for support ticket
     * @param supportTicketId of the selected support ticket
     * @param supportTicketGuid of the selected support ticket
     * @returns meta data for support ticket
     */
    getMetaDataForSupportTicket(supportTicketId?: number, supportTicketGuid?: string): Observable<SupportTicketMetaDataModel> {
        const { SUPPORT_TICKET_METADATA, SUPPORT_TICKET } = Constants.endPoints;
        const { SUPPORT_TICKET_ID, SUPPORT_TICKET_GUID } = Constants.queryParameters;
        const userId = localStorage.getItem(Constants.localstorageKeys.ID);
        const userGuid = localStorage.getItem(Constants.localstorageKeys.GUID);
        let params: HttpParams = new HttpParams();
        if (supportTicketId) {
            params = params.append(SUPPORT_TICKET_ID, `${supportTicketId}`),
                params = params.append(SUPPORT_TICKET_GUID, `${supportTicketGuid}`);
        }
        return this.httpClient.get<any>(
            `${SUPPORT_TICKET}/${SUPPORT_TICKET_METADATA}/${userId}/${userGuid}`, { params });
    }

    /**
     * @description Adds response for support ticket
     * @param response to be added
     * @returns response for support ticket added
     */
    addResponseForSupportTicket(response: FormData): Observable<any> {
        const { SUPPORT_TICKET_RESPONSES, SUPPORT_TICKET } = Constants.endPoints;
        return this.httpClient.post<any>(`${SUPPORT_TICKET_RESPONSES}`, response);
    }
}
