import {Component, ViewChild, ElementRef} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {HttpUtils} from "../common/http-utils";
import {RecargaTimeLine} from "../recarga/methods";
import {RecargaFactura} from "../recarga/methods";
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {ControlGroup, Control, Validators, FormBuilder} from "@angular/common";
import {Datepicker} from "../common/xeditable";
import moment from 'moment/moment';
import { CHART_DIRECTIVES } from 'angular2-highcharts';

@Component({
    selector: 'home',
    templateUrl: 'app/dashboard/dashboard.html',
    styleUrls: ['app/dashboard/dashboard.css'],
    directives: [RecargaTimeLine,RecargaFactura,Datepicker,CHART_DIRECTIVES],
})
export class Dashboard extends RestController{


    dataCamion:any = [];
    httputils:HttpUtils;
    endpoint:string;
    plotDate="2016/02";

    public paramsTimeLine={
        'offset':0,
        'max':5,
        'ruc':''
    };
    dataArea={
        chart: {
          type: 'area',
         },
        xAxis: {
            categories: [],
        },
        yAxis:{
            title:{
                text:"Cantidad",
            },
        },
        credits:{
            enabled:false
        },
        series: [],
        title : { text : 'Uso del vertedero' },
    };

    constructor(public router: Router,http: Http,public _formBuilder: FormBuilder,public toastr: ToastsManager,public myglobal:globalService) {
        super(http,toastr);
        this.validTokens();
    }
    ngOnInit(){
        this.initForm();
        this.getPlot1();
        this.getPlot2();
    }
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }

    goTaquilla(event){
        event.preventDefault();
        let link = ['Taquilla', {}];
        this.router.navigate(link);
    }
    goFactura(event){
        event.preventDefault();
        let link = ['RecargaIngresos', {}];
        this.router.navigate(link);
    }
    goVehiculos(event){
        event.preventDefault();
        let link = ['Vehiculo', {}];
        this.router.navigate(link);
    }
    goLibro(event){
        event.preventDefault();
        let link = ['RecargaLibro', {}];
        this.router.navigate(link);
    }

    dataPlot:any=[];
    getPlot1(){
        let that=this;
        let successCallback= response => {
            that.dataArea.series = response.json().series;
            if(response.json().categories)
                that.dataArea.xAxis.categories= response.json().categories;
            if(that.chart){
                that.chart.series[0].setData(that.dataArea.series[0].data)
                that.chart.series[1].setData(that.dataArea.series[1].data)
                that.chart.series[2].setData(that.dataArea.series[2].data)
            }
        }
        this.httputils.doGet("/dashboards/plot/1/"+this.plotDate,successCallback,this.error)
    }
    chart:any;
    saveInstance(chartInstance) {
        this.chart = chartInstance;
    }
    getPlot2(){
        let successCallback= response => {
            Object.assign(this.dataPlot, response.json());
            this.dataPlot.total=0;
            this.dataPlot.forEach(val=>{
                if(val.quantity > 0)
                    this.dataPlot.total+=val.quantity;
                else val.quantity *= -1;
            })
        }
        this.httputils.doGet("/dashboards/plot/2/"+this.plotDate,successCallback,this.error)
    }

    //consultar Facturas
    form: ControlGroup;
    dateStart:Control;
    dateEnd:Control;
    initForm(){
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");

        this.form = this._formBuilder.group({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
        });
    }

    @ViewChild(RecargaFactura)
    recargaFactura:RecargaFactura;

    public paramsFactura:any={};
    public consultar=false;
    loadFacturas(event){
        event.preventDefault();

        if(!this.dateEnd.value)
        {
            this.dateEnd.updateValue(moment(this.dateStart.value.toString()).format('YYYY-MM-DD'));
            this.dateEnd.updateValue(moment(this.dateEnd.value).add(1, 'days'));
        }

        this.paramsFactura={
            'dateStart': moment(this.dateStart.value.toString()).format('DD-MM-YYYY'),
            'dateEnd':   moment(this.dateEnd.value.toString()).format('DD-MM-YYYY'),
        };
        if(this.recargaFactura)
        {
            this.recargaFactura.params = this.paramsFactura;
            this.recargaFactura.cargar();
        }

        this.consultar=true;
        this.dateEnd.updateValue("");
    }
    loadFechaPlot(data){
        this.plotDate=data;
        this.getPlot1();
        this.getPlot2();
    }
    
    

}


