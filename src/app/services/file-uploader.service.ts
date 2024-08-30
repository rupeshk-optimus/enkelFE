import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../shared/constants';
import { DocumentTypeEnum } from '../enum/document-type.enum';

@Injectable({
    providedIn: 'root'
})
export class FileUploaderService {

    constructor(private httpClient: HttpClient) { }

    getReportsforTable(withData: boolean, componentName?: any): Observable<any> {
        const id = localStorage.getItem(Constants.localstorageKeys.CLIENT_ID);
        const guid = localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID);
        const params = new HttpParams()
            .set(Constants.queryParameters.CLIENT_ID, id)
            .set(Constants.queryParameters.DIRECTORY_TYPE, DocumentTypeEnum.File.toString())
            .set(Constants.queryParameters.CLIENT_GUID, guid)
            .set(Constants.queryParameters.WITH_DATA, withData.toString());
        return this.httpClient.get<any>(Constants.endPoints.GET_FILES_FOR_TABLE, { params });
    }

    downloadBlob(id: string, guid: string): Observable<any> {
        const options = { responseType: 'blob' as 'json' };
        const {FILE_DOWNLOAD} = Constants.endPoints;
        return this.httpClient.get<any>(`${FILE_DOWNLOAD}/${id}/${guid}`, options);
    }

    deleteFile(url: string): Observable<any> {
        return this.httpClient.delete<any>(url);
    }

    getFolderContent(folder): Observable<any> {
        const id = localStorage.getItem(Constants.localstorageKeys.CLIENT_ID);
        const guid = localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID);
        const params = new HttpParams()
            .set(Constants.queryParameters.CLIENT_ID, id)
            .set(Constants.queryParameters.DIRECTORY_TYPE, DocumentTypeEnum.File.toString())
            .set(Constants.queryParameters.CLIENT_GUID, guid);
        return this.httpClient.get<any>(Constants.endPoints.GET_FOLDER_BY_ID +
             Constants.symbols.pathVariableSymbol + folder.id + Constants.symbols.pathVariableSymbol + folder.guid, { params });
    }
}
