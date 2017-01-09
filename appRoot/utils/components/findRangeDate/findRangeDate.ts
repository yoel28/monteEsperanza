import {Component, EventEmitter, OnInit,AfterViewInit} from "@angular/core";
import {Control} from "@angular/common";
import {SMDropdown, DateRangepPicker} from "../../../common/xeditable";
import {globalService} from "../../../common/globalService";
import {CatalogApp} from "../../../common/catalogApp";
declare var SystemJS:any;
@Component({
    selector: 'find-range-date',
    templateUrl: SystemJS.map.app+'/utils/components/findRangeDate/index.html',
    styleUrls: [SystemJS.map.app+'/utils/components/findRangeDate/style.css'],
    directives:[SMDropdown,DateRangepPicker],
    inputs:['params','control'],
    outputs:['dateRange'],
})
export class FindRangeDate implements OnInit,AfterViewInit {
    public control:Control;
    public params:any;
    public dateRange:any;

    public paramsDate = CatalogApp.formatDateDDMMYYYY;
    public itemsDate = CatalogApp.itemsDate;

    constructor(public myglobal:globalService) {
        this.control = new Control('');
        this.dateRange = new EventEmitter();
    }
    ngOnInit(){

    }
    ngAfterViewInit(){

    }
    setFecha(id){
        if(id!='-1'){
            this.control.updateValue(CatalogApp.getDateRange(id));
            this.dateRange.emit(this.control);
        }
    }
    assignDate(value){
        this.control.updateValue(value);
        this.dateRange.emit(this.control);
    }
}