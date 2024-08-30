import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SideNavComponent } from './side-nav/side-nav.component';
import { LoaderComponent } from './loader/loader.component';
import { DialogComponent } from './dialog/dialog.component';

import { MaterialModule } from '../material/material.module';
import { MsalModule } from '@azure/msal-angular';

import { tenantConfig } from 'src/environments/msConfig';
import { environment } from 'src/environments/environment';
import { Constants } from './constants';

import { ClientListComponent } from './client-list/client-list.component';

import { CookieService } from 'ngx-cookie-service';
import { NgxPowerBiModule } from 'ngx-powerbi';
import { JoyrideModule } from 'ngx-joyride';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { TruncateTextPipe } from '../pipes/truncate-text.pipe';
import { MailBoxComponent } from './mail-box/mail-box.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.component';
import { PartialLoaderComponent } from './partial-loader/partial-loader.component';


@NgModule({
    declarations: [
        SideNavComponent,
        LoaderComponent,
        DialogComponent,
        TruncateTextPipe,
        ClientListComponent,
        MailBoxComponent,
        FileUploaderComponent,
        CustomDropdownComponent,
        PartialLoaderComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPowerBiModule,
        NgxDocViewerModule,
        BsDropdownModule.forRoot(),
        MsalModule.forRoot({
            clientID: tenantConfig.clientID,
            authority: tenantConfig.authority,
            validateAuthority: tenantConfig.validateAuthority,
            cacheLocation: tenantConfig.cacheLocation,
            postLogoutRedirectUri: environment.clientBaseUrl + Constants.navigations.LOGIN
        }),
        JoyrideModule.forRoot(),
        NgCircleProgressModule.forRoot({
            // set defaults here
            backgroundPadding: 8,
            radius: 15,
            space: -2,
            maxPercent: 100,
            unitsFontWeight: '400',
            outerStrokeWidth: 2,
            outerStrokeColor: '#400094',
            innerStrokeColor: '#e7e8ea',
            innerStrokeWidth: 2,
            titleFontSize: '10',
            titleFontWeight: '300',
            subtitleFontSize: '12',
            subtitleFontWeight: '900',
            imageHeight: 97,
            animation: false,
            animateTitle: false,
            animationDuration: 1000,
            showTitle: false,
            showUnits: false,
            showBackground: false,
            showSubtitle: false
        })
    ],
    exports: [
        SideNavComponent,
        MaterialModule,
        LoaderComponent,
        NgxPowerBiModule,
        TruncateTextPipe,
        ClientListComponent,
        MailBoxComponent,
        JoyrideModule,
        FileUploaderComponent,
        NgCircleProgressModule,
        NgxDocViewerModule
    ],
    providers: [CookieService]
})
export class SharedModule { }
