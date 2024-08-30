import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-custom-dropdown',
    templateUrl: './custom-dropdown.component.html',
    styleUrls: ['./custom-dropdown.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomDropdownComponent),
        multi: true,
    }]
})
export class CustomDropdownComponent implements OnInit, ControlValueAccessor  {

    @Input() directoryTree: any;
    options: Array<any>;
    selectedOption: any;
    selectedDirectory;

    onChange: (_: any) => {};

    constructor() { }

    ngOnInit() {
        this.options = this.directoryTree;

    }

    getDirectoryOfCurrentId = (object, id: number) => {
        if (object.id === id) {
            this.selectedOption = object;
            return object;
        } else {
            if (object.childDirectories) {
                for (const dir of object.childDirectories) {
                    this.getDirectoryOfCurrentId(dir, id);
                }
            } else {
                return null;
            }
        }
    }


    writeValue(value: string) {
        let foundObject;
        this.options.forEach(dir => {
            foundObject = this.getDirectoryOfCurrentId(dir, +value);
        });
    }

    registerOnChange(fn: (_: any) => {}) {
        this.onChange = fn;
    }

    changeSelectedOption(option: any) {
        this.selectedOption = option;
        this.onChange(option.id);
    }

    registerOnTouched() { }

}
