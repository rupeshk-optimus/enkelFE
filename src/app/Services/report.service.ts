import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Constants } from '../shared/constants';
import { ClientListModel } from '../models/client-list.model';
import { ReportViewType } from 'src/app/enum/report-view-type.enum';
import { DocumentTypeEnum } from '../enum/document-type.enum';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    clientList: BehaviorSubject<Array<ClientListModel>> = new BehaviorSubject<Array<ClientListModel>>(null);
    selectedClient: BehaviorSubject<ClientListModel> = new BehaviorSubject<ClientListModel>(null);
    openClientList: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    constructor(
        private httpClient: HttpClient
    ) { }

    getReports(type: number, guid: string, reportID?: string): Observable<any> {
        const parameters = {};
        if (reportID) {
            Object.assign(parameters, {
                embedUrl : reportID
            });
            return this.httpClient.get(`${Constants.endPoints.GET_REPORTS}/${guid}`, {
                params: parameters
            });
        }
        Object.assign(parameters, {
            reportType: type,
            reportViewType: window.innerWidth > 850 ? ReportViewType.Desktop : ReportViewType.Mobile,
            clientGuid: guid
        });
        return this.httpClient.get(Constants.endPoints.GET_REPORTS, {
            params: parameters
        });
    }

    getReportsforTable(): Observable<any> {
        const id = localStorage.getItem(Constants.localstorageKeys.CLIENT_ID);
        const guid = localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID);
        const params = new HttpParams()
            .set(Constants.queryParameters.CLIENT_ID, id)
            .set(Constants.queryParameters.DIRECTORY_TYPE, DocumentTypeEnum.Report.toString())
            .set(Constants.queryParameters.CLIENT_GUID, guid)
            .set(Constants.queryParameters.WITH_DATA, 'true');
        return this.httpClient.get<any>(Constants.endPoints.GET_FILES_FOR_TABLE, { params });
    }

    downloadBlob(id: string, guid: string): Observable<any> {
        const options = { responseType: 'blob' as 'json' };
        const {REPORT_DOWNLOAD} = Constants.endPoints;
        return this.httpClient.get<any>(`${REPORT_DOWNLOAD}/${id}/${guid}`, options);
        // return this.httpClient.get<any>(Constants.endPoints.REPORT_DOWNLOAD + Constants.symbols.pathVariableSymbol
        //      + id + Constants.symbols.pathVariableSymbol + guid);
    }

    getFolderContent(folder): Observable<any> {
        const id = localStorage.getItem(Constants.localstorageKeys.CLIENT_ID);
        const guid = localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID);
        const params = new HttpParams()
            .set(Constants.queryParameters.CLIENT_ID, id)
            .set(Constants.queryParameters.DIRECTORY_TYPE, DocumentTypeEnum.Report.toString())
            .set(Constants.queryParameters.CLIENT_GUID, guid);
        return this.httpClient.get<any>(Constants.endPoints.GET_FOLDER_BY_ID +
             Constants.symbols.pathVariableSymbol + folder.id + Constants.symbols.pathVariableSymbol + folder.guid, { params });
    }
}
