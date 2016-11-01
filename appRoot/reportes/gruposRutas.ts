import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import moment from 'moment/moment';
import {DateRangepPicker} from "../common/xeditable";
import {Fecha} from "../utils/pipe";
import {Search} from "../utils/search/search";
import {Tooltip} from "../utils/tooltips/tooltips";
import {CatalogApp} from "../common/catalogApp";
declare var SystemJS:any;
declare var Table2Excel:any;

@Component({
    selector: 'reporte-gruposRutas',
    templateUrl: SystemJS.map.app+'/reportes/gruposRutas.html',
    pipes: [Fecha],
    styleUrls: [SystemJS.map.app+'/reportes/style.css'],
    directives : [Filter,DateRangepPicker,Search,Tooltip]
})
export class GruposRutas extends RestController implements OnInit{

    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;
    fechaRegistro:any;

    public whereObject:any={'route':{'or':[]},'data':[]};


    public paramsDate:any = CatalogApp.formatDateDDMMYYYY;
    public itemsDate:any =  CatalogApp.itemsDate;

    public title:string;

    constructor(public router: Router,public http: Http,toastr:ToastsManager,public myglobal:globalService,public _formBuilder: FormBuilder) {
        super(http,toastr);
        this.setEndpoint('/reports/routes');
    }
    ngOnInit(){
        this.title="REPORTE POR RUTAS";
        this.initForm();
    }
    
    initForm(){
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
        });
    }
    
    public searchRutas = {
        title: "Rutas",
        idModal: "searchRoutes",
        endpoint: "/search/routes/",
        placeholder: "Ingrese la ruta",
        label: {name: "Nombre: ", detail: "Detalle: "},
    };


    public params:any={};
    

    loadReporte(event?){
        if(event)
            event.preventDefault();

        this.dataList = Object.assign({});
        
        let noGroup="";
        if(!this.msgLabelAll)
            noGroup="&noGroup=true";

        this.whereObject.data=[];

        this.whereObject.data.push({'op':'ge','field':'dateCreated','value':this.dateStart.value,'type':'date'});
        this.whereObject.data.push({'op':'lt','field':'dateCreated','value':this.dateEnd.value,'type':'date'});

        this.whereObject.data.push(this.whereObject.route);


        this.where = "&where="+encodeURI(JSON.stringify(this.whereObject.data).split('{').join('[').split('}').join(']'))+noGroup;

        this.max=100;

        if(this.form.valid)
            this.loadData();
        this.fechaRegistro = new Date();
    }
    sumTotalPeso(id)
    {
        let total=0;
        this.dataList.list[id].recharges.forEach(val=>{
            total+=(val.weightIn-val.weightOut);
        })
        return total;
    }
    sumTotalFact(id)
    {
        let total=0;
        this.dataList.list[id].recharges.forEach(val=>{
            total+=(val.quantity);
        })
        return total;
    }
    sumTotalVeh(id)
    {
        let total={};
        this.dataList.list[id].recharges.forEach(val=>{
            total[val.vehiclePlate]='';
        })
        return Object.keys(total).length;
    }
    onPrint()
    {
        var printContents = document.getElementById("reporte").innerHTML;
        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write('<body onload="window.print()">' + printContents + '</body>');
        popupWin.document.head.innerHTML = (document.head.innerHTML);
        popupWin.document.close();
    }
    exportCSV()
    {
        let table2excel = new Table2Excel({
            'defaultFileName': this.title,
        });
        Table2Excel.extend((cell, cellText) => {
            if (cell) return {
                v:cellText,
                t: 's',
            };
            return null;
        });
        table2excel.export(document.querySelectorAll("table.export"));
    }


    assignRuta(data){
        if(this.whereObject.route.or.findIndex(obj => (obj.value == data.id))<0)
        {
            this.whereObject.route.or.push({'op':'eq','field':'ro.id','value':data.id,'title':data.title});
            this.loadReporte();
        }
    }

    //lapso de fechas
    assignDate(data)
    {
        this.dateStart.updateValue(data.start || null);
        this.dateEnd.updateValue(data.end || null);
    }

    setFecha(id)
    {
        if(id!='-1'){
            let range = CatalogApp.getDateRange(id);
            this.dateStart.updateValue(range.start || null);
            this.dateEnd.updateValue(range.end || null);
            this.loadReporte();
        }
    }


    formatDate(date,format)
    {
        if(date)
            return moment(date).format(format);
        return "";
    }

    public msgLabelAll:boolean=true;
    cambiarAll()
    {
        this.msgLabelAll=!this.msgLabelAll;
    }

    removeOr(data){
        let index = this.whereObject.route.or.findIndex(obj => (obj.value == data.value))
        if(index!=-1)
            this.whereObject.route.or.splice(index,1);
        this.loadReporte();

        
    }
}