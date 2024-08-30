import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MsalService } from '@azure/msal-angular';

import { AppComponent } from './app.component';
import { DialogComponent } from './shared/dialog/dialog.component';

import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { SharedModule } from './shared/shared.module';

import { AuthInterceptor } from './shared/authInterceptor';
import { LoaderService } from './services/loader.service';
import { DragDropDirective } from './directives/drag-drop.directive';
import { MailBoxComponent } from './shared/mail-box/mail-box.component';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorHandlerService } from './services/error-handler.service';


@NgModule({
    declarations: [
        AppComponent,
        DragDropDirective
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LoginModule,
        SharedModule,
        BrowserAnimationsModule,
        HttpClientModule
    ],
    providers: [
        LoaderService,
        MsalService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        DatePipe,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: ErrorHandler, useClass: ErrorHandlerService },
    ],
    bootstrap: [AppComponent],
    entryComponents: [DialogComponent, MailBoxComponent]
})
export class AppModule { }
