import {
    HttpRequest,
    HttpInterceptor,
    HttpHandler,
    HttpEvent,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';


import { Constants } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';

import { LoaderService } from '../services/loader.service';
import { SharedService } from '../services/shared.service';
import { HttpCacheService } from '../services/http-cache.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    authReq: any;

    constructor(
        private loaderService: LoaderService,
        private sharedService: SharedService,
        private snackBar: MatSnackBar,
        private cacheService: HttpCacheService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem(Constants.localstorageKeys.ACCESS_TOKEN);
        if (req.url !== Constants.endPoints.LOGIN) {
            this.loaderService.show();
        }
        if (req.url === Constants.endPoints.REPORT_UPLOAD || req.url === Constants.endPoints.FILE_UPLOAD
            || req.url === Constants.endPoints.SUPPORT_TICKET_RESPONSES ||
            req.url === Constants.endPoints.WORK_ITEM_ATTACHMENT) {
            this.authReq = req.clone({
                url: environment.serverBaseUrl + req.url,
                headers: req.headers.set(Constants.requestHeaders.AUTHORIZATION_HEADER_KEY,
                    Constants.requestHeaders.SECURITY_SCHEME + token)
            });
            return this.requestHandler(next);
        }
        this.authReq = req.clone({
            url: environment.serverBaseUrl + req.url,
            headers: req.headers.set(Constants.requestHeaders.CONTENT_TYPE_KEY, Constants.requestHeaders.CONTENT_TYPE_VALUE)
                .set(Constants.requestHeaders.AUTHORIZATION_HEADER_KEY, Constants.requestHeaders.SECURITY_SCHEME + token)
        });

        // Disable Caching

        // if (this.authReq.urlWithParams.includes(Constants.navigations.REPORTS)) {
        //     if (this.authReq.method !== 'GET') {

        //         this.cacheService.invalidateCache();
        //         return this.requestHandler(next);
        //     }

        //     // attempt to retrieve a cached response
        //     const cachedResponse: HttpResponse<any> = this.cacheService.get(this.authReq.urlWithParams);

        //     // return cached response
        //     if (cachedResponse) {
        //         this.loaderService.hide();
        //         return of(cachedResponse);
        //     }
        // }

        return this.requestHandler(next);
    }

    requestHandler(next) {
        return next.handle(this.authReq).pipe(
            tap((ev: HttpEvent<any>) => {
                if (ev instanceof HttpResponse) {
                    this.loaderService.hide();
                    this.cacheService.put(this.authReq.urlWithParams, ev);
                }
            }),
            catchError(error => {
                if (error.status === Constants.errorCodes.UNAUTHORIZED) {
                    this.authReq.url.includes(Constants.navigations.LOGIN) ?
                        this.snackBar.open(error.statusText, Constants.notifications.ERROR_LABEL, {
                            duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                            panelClass: 'mail-success'
                        }) : this.sharedService.logout();
                } else {
                    if (!(this.authReq.url.includes(Constants.endPoints.GET_REPORTS) ||
                        this.authReq.url.includes(Constants.endPoints.GET_CLIENTS) ||
                        this.authReq.url.includes(Constants.endPoints.CSL_INFO))) {
                        this.snackBar.open(error.statusText, Constants.notifications.ERROR_LABEL, {
                            duration: Constants.notifications.NOTIFICATION_DURATION * 1000,
                            panelClass: 'mail-success'
                        });
                    }
                }
                this.loaderService.hide();
                throw error;
            }),
        );
    }
}
