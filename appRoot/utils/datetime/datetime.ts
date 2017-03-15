import {Component, EventEmitter, OnInit,AfterViewInit} from "@angular/core";
import {Control} from "@angular/common";
import {SMDropdown, DateRangepPicker, Datepicker} from "../../common/xeditable";
import {globalService} from "../../common/globalService";
import {CatalogApp} from "../../common/catalogApp";
import {HttpUtils} from "../../common/http-utils";
import {FindRangeDate} from "../components/findRangeDate/findRangeDate";
declare var SystemJS:any;
declare var moment:any;




@Component({
    selector: 'dateTime',
    templateUrl: SystemJS.map.app+'/utils/datetime/index.html',
    styleUrls: [SystemJS.map.app+'/utils/datetime/style.css'],
    directives:[FindRangeDate,Datepicker],
    inputs:['data','params','control','rango'],
    outputs:['output'],
})

export class datetimeComponent implements OnInit,AfterViewInit {

    public type:string;

    public output:any;

    constructor(public myglobal:globalService) {
        this.output = new EventEmitter();
    }
    ngOnInit(){


        if(!this.type)
            this.type = this.myglobal.getParams('DateTimeType');

        if(this.type == '' || !(this.type=='month' || this.type=='range'))
            this.type = 'month';

    }
    ngAfterViewInit(){

    }


    public formatDate = {
        format: "mm/yyyy",
        startDate:'01/2016',
        startView: 2,
        minViewMode: 1,
        maxViewMode: 2,
        todayBtn: "linked",
        language: "es",
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
       // return: 'DD/MM/YYYY',
    }

    loadFecha(data:Object | Control) {
        if(data.constructor.name == 'Control'){
            this.output.emit(data['value'])
            return;
        }
        if(data.constructor.name == 'Object'){
            let range={start:null,end:null};
            range.start = moment(data['date']).format('DD-MM-YYYY');
            range.end   = moment(data['date']).add(1,'month').startOf('month').format('DD-MM-YYYY');
            this.output.emit(range);
        }

    }
}

