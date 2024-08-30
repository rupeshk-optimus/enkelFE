import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/services/shared.service';
import { Constants } from 'src/app/shared/constants';

@Component({
    selector: 'app-user-guide',
    templateUrl: './user-guide.component.html',
    styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
    urlSafe: SafeResourceUrl;


    constructor(
        public sanitizer: DomSanitizer,
        public sharedService: SharedService,
    ) { }

    ngOnInit() {
        this.sharedService.pageHeading.next(Constants.appConstants.USER_GUIDE);
        this.sharedService.imgHeading.next(Constants.appConstants.USER_GUIDE_IMG);
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(environment.userGuideDocument);
    }

}
