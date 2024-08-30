import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../shared/constants';
import { MailModel } from '../models/mail.model';

@Injectable({
  providedIn: 'root'
})
export class ConnectToCslService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCslInfo(): Observable<any> {
    const loggedInUserGuid = localStorage.getItem(Constants.localstorageKeys.CLIENT_GUID);
    const loggedInUserId = localStorage.getItem(Constants.localstorageKeys.CLIENT_ID);
    return this.httpClient.get<any>(Constants.endPoints.CSL_INFO
      + Constants.symbols.pathVariableSymbol + loggedInUserId + Constants.symbols.pathVariableSymbol + loggedInUserGuid);
  }

  sendMailToCsl(mail: MailModel): Observable<any> {
    return this.httpClient.post<any>(Constants.endPoints.CSL_MAIL, mail);
  }
}
