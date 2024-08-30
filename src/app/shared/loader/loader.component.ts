import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { LoaderService } from 'src/app/services/loader.service';
import { Constants } from '../constants';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
    color = 'primary';
    mode = 'indeterminate';
    value = 50;
    isLoading: Subject<boolean> = this.loaderService.isLoading;
    constants = Constants;

    constructor(
        private loaderService: LoaderService
    ) { }

    ngOnInit() {
    }

}
