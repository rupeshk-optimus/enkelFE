import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Constants } from '../shared/constants';
import { Observable } from 'rxjs';
import { DirectoriesModel } from '../models/directories.model';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(private httpClient: HttpClient) { }

    getClients(): Observable<any> {
        const id = localStorage.getItem(Constants.localstorageKeys.ID);
        const guid = localStorage.getItem(Constants.localstorageKeys.GUID);
        const params = new HttpParams().set(Constants.queryParameters.IS_SUCCESS_LEAD, 'true');
        return this.httpClient.get(Constants.endPoints.GET_CLIENTS
            + Constants.symbols.pathVariableSymbol + id + Constants.symbols.pathVariableSymbol + guid, { params });
    }

    createFolder(folder: DirectoriesModel): Observable<any> {
        return this.httpClient.post(Constants.endPoints.CREATE_FOLDER, folder);
    }

    uploadFileFormData(formValue, putReqObject, componentName: string) {
        const fileKeys = Constants.fileUploadKeys;
        const loggedInUserId = localStorage.getItem(Constants.localstorageKeys.ID);
        const file: File = formValue.fileName as File;
        const fd = new FormData();
        fd.append(fileKeys.FILE, file, file.name);
        fd.append(fileKeys.NAME, file.name);
        fd.append(fileKeys.UPDATED_BY, loggedInUserId);
        fd.append(fileKeys.UPLOADED_BY, loggedInUserId);
        fd.append(fileKeys.DIRECTORY_ID, formValue.DirectoryId);
        fd.append(fileKeys.CLIENT_ID, localStorage.getItem(Constants.localstorageKeys.CLIENT_ID));
        if (componentName === Constants.appConstants.REPORTS) {
            fd.append(fileKeys.EXPIRED_AT, formValue.expiryDate);
            fd.append(fileKeys.PERIOD, formValue.period);
            fd.append(fileKeys.REPORT_TYPE, formValue.fileType);
        } else {
            fd.append(fileKeys.DESCRIPTION, formValue.description);
            fd.append(fileKeys.ACTION_REQUIRED, formValue.actionRequired);
            fd.append(fileKeys.PURPOSE, formValue.purpose);
        }
        const url = componentName === Constants.appConstants.REPORTS ? Constants.endPoints.REPORT_UPLOAD : Constants.endPoints.FILE_UPLOAD;
        if (putReqObject) {
            fd.append(fileKeys.ID, putReqObject.id);
            fd.append(fileKeys.GUID, putReqObject.guid);
            return this.httpClient.put(url, fd, {
                reportProgress: true,
                observe: 'events'
            }
            );
        }
        return this.httpClient.post(url, fd, {
            reportProgress: true,
            observe: 'events'
        }
        );
    }
}
