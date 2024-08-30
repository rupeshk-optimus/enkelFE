import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  componentName = Constants.appConstants.FILES;

  constructor(
    public sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.pageHeading.next(Constants.appConstants.UPLOAD_FILES);
    this.sharedService.imgHeading.next(Constants.appConstants.FILES_IMG);
  }

}
