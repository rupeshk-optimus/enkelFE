import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { WorkItemTypeEnum } from 'src/app/enum/work-item-type.enum';
import { SharedService } from 'src/app/services/shared.service';
import { Constants } from 'src/app/shared/constants';
import { AddWorkItemsService } from './add-work-items.service';

@Component({
    selector: 'app-add-work-items',
    templateUrl: './add-work-items.component.html',
    styleUrls: ['./add-work-items.component.scss']
})
export class AddWorkItemsComponent implements OnInit {
    workItemId: string;
    workItemGuid: string;
    workItemType: string;
    workItemTypeId: string;
    parentWorkItemGuid: string;
    iconColor: string;

    constructor(
        public sharedService: SharedService,
        private addWorkItemsService: AddWorkItemsService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    ngOnInit() {
        this.sharedService.pageHeading.next(Constants.appConstants.WORK_ITEM);
        this.sharedService.imgHeading.next(Constants.appConstants.WORK_ITEM_IMG);
        this.route.paramMap.subscribe(params => {
            this.workItemTypeId = params.get(Constants.routingParameters.WORK_ITEM_TYPE);
            this.parentWorkItemGuid = params.get(Constants.routingParameters.PARENT_WORK_ITEM_GUID);
            this.workItemId = params.get(Constants.routingParameters.id);
            this.workItemGuid = params.get(Constants.routingParameters.GUID);
        });
        this.addWorkItemsService.workItemType.next(this.workItemTypeId);
        this.addWorkItemsService.parentWorkItemGuid.next(this.parentWorkItemGuid);
        this.addWorkItemsService.currentWorkItemGuid.next(this.workItemGuid);
        this.addWorkItemsService.currentWorkItemId.next(this.workItemId);
        this.workItemType = Object.keys(WorkItemTypeEnum).filter(type => WorkItemTypeEnum[type] === +this.workItemTypeId).toString();
        this.iconColor = Constants.workItemType.find(type => type.id === +this.workItemTypeId).color;
    }

    saveWorkItem() {
        this.addWorkItemsService.saveWorkItem.next(true);
    }

    /**
     * @description Go back
     */
    goBack() {
        this.location.back();
    }

}
