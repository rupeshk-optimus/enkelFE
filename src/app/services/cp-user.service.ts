import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PaginationModel } from '../models/pagination.model';
import { Constants } from '../shared/constants';
import { ClientContactModel } from '../models/client-contact.model';
import { ChangeRoleModel } from '../models/change-role.model';

@Injectable({
    providedIn: 'root'
})
export class CpUserService {

    constructor(private httpClient: HttpClient) { }

    getClientContacts(pageNumber: number): Observable<any> {
        const id = localStorage.getItem(Constants.localstorageKeys.CLIENT_ID);
        const guid = localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID);
        const params = new HttpParams().set(Constants.queryParameters.PAGE, `${pageNumber}`);
        return this.httpClient.get(Constants.endPoints.GET_CONTACTS
            + Constants.symbols.pathVariableSymbol + id + Constants.symbols.pathVariableSymbol + guid, {params});
    }
}
