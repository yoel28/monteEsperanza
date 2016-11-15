import {Component, EventEmitter, OnInit, AfterViewInit} from "@angular/core";
import {FormBuilder} from "@angular/common";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {Xeditable, ColorPicker} from "../../common/xeditable";
import {Search} from "../search/search";
import {Save} from "../save/save";
import {CatalogApp} from "../../common/catalogApp";

declare var SystemJS:any;
declare var moment:any;

@Component({
    selector: 'accordion',
    templateUrl: SystemJS.map.app+'/utils/accordion/index.html',
    styleUrls: [SystemJS.map.app+'/utils/accordion/style.css'],
    inputs:['params','model','dataList','where'],
    outputs:['getInstance'],
    directives:[Xeditable,ColorPicker,Search,Save]
})


export class Accordion extends RestController implements OnInit,AfterViewInit {


    public params:any={};
    public model:any={};
    public formatDateId:any={};
    public dateHmanizer = CatalogApp.dateHmanizer;

    public dataSelect:any={};

    public keyActions =[];
    public configId=moment().valueOf();

    public getInstance:any;


    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.getInstance = new EventEmitter();
    }

    ngOnInit()
    {
        this.keyActions=Object.keys(this.params.actions || {});
        this.setEndpoint(this.model.endpoint);
        this.setEndpoint(this.params.endpoint);
    }
    ngAfterViewInit() {
        this.getInstance.emit(this);
    }

    actionPermissionKey()
    {
        let data=[];
        let that=this;
        Object.keys(this.params.actions || {}).forEach((key)=>
        {
            if( that.params.actions[key].permission || false)
                data.push(key);
        });
        return data;
    }

    public formatDate(date, format, force = false, id = null) {
        if (date) {
            if (id && this.formatDateId[id])
                force = this.formatDateId[id].value;
            if (!force) {
                var diff = moment().valueOf() - moment(date).valueOf();
                if (diff < parseFloat(this.myglobal.getParams('DATE_MAX_HUMAN'))) {
                    if (diff < 1800000)//menor a 30min
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m', 's']})
                    if (diff < 3600000) //menor a 1hora
                        return 'Hace ' + this.dateHmanizer(diff, {units: ['m']})
                    return 'Hace ' + this.dateHmanizer(diff, {units: ['h', 'm']})
                }
            }
            return moment(date).format(format);
        }
        return "-";
    }

    public changeFormatDate(id) {
        if (!this.formatDateId[id])
            this.formatDateId[id] = {'value': false};
        this.formatDateId[id].value = !this.formatDateId[id].value;
    }

    public viewChangeDate(date) {
        //<i *ngIf="viewChangeDate(data.rechargeReferenceDate)" class="fa fa-exchange" (click)="changeFormatDate(data.id)"></i>
        var diff = moment().valueOf() - moment(date).valueOf();
        return ((diff < parseFloat(this.myglobal.getParams('DATE_MAX_HUMAN'))))
    }

    public getObjectKey(data){
        return Object.keys(data);
    }

}
