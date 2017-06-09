import {Component, EventEmitter, OnInit,AfterViewInit} from "@angular/core";
import {Control} from "@angular/common";
import {Datepicker} from "../../../common/xeditable";
import {FindRangeDate} from "../../../utils/components/findRangeDate/findRangeDate";
import {globalService} from "../../../common/globalService";


declare var SystemJS:any;
declare var moment:any;

@Component({
    selector: 'date-range',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/date-range/index.html',
    styleUrls: [SystemJS.map.app+'/com.zippyttech.ui/components/date-range/style.css'],
    directives:[FindRangeDate,Datepicker],
    inputs:['data','params','control','type'],
    outputs:['output'],
})
export class DateRangeComponent implements OnInit,AfterViewInit {
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