import {Component, ViewChild} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {Http} from "@angular/http";
import {HttpUtils} from "../common/http-utils";
import {RecargaTimeLine, RecargaFactura} from "../recarga/methods";
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {ControlGroup, Control, Validators, FormBuilder} from "@angular/common";
import {Datepicker} from "../common/xeditable";
import moment from "moment/moment";
import {CHART_DIRECTIVES} from "angular2-highcharts";

@Component({
    selector: 'home',
    templateUrl: 'app/dashboard/dashboard.html',
    styleUrls: ['app/dashboard/dashboard.css'],
    directives: [RecargaTimeLine, RecargaFactura, Datepicker, CHART_DIRECTIVES],
})
export class Dashboard extends RestController {
    
    dataCamion:any = [];
    httputils:HttpUtils;
    endpoint:string;
    plotDate = "2016";

    public paramsTimeLine = {
        'offset': 0,
        'max': 5,
        'ruc': ''
    };

    constructor(public router:Router, http:Http, public _formBuilder:FormBuilder, public toastr:ToastsManager, public myglobal:globalService) {
        super(http, toastr);
    }

    ngOnInit() {
        if (this.myglobal.existsPermission('27')) {
            this.initForm();
            this.getPlots();
            this.getPlot2();
        }
    }

    goTaquilla(event) {
        event.preventDefault();
        let link = ['Taquilla', {}];
        this.router.navigate(link);
    }

    goFactura(event) {
        event.preventDefault();
        let link = ['RecargaIngresos', {}];
        this.router.navigate(link);
    }

    goVehiculos(event) {
        event.preventDefault();
        let link = ['Vehiculo', {}];
        this.router.navigate(link);
    }

    goLibro(event) {
        event.preventDefault();
        let link = ['RecargaLibro', {}];
        this.router.navigate(link);
    }

    dataPlot:any = [];

    dataAreaPlot1 = {
        chart: {
            type: 'area',
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: {
                text: "Cantidad",
            },
        },
        credits: {
            enabled: false
        },
        series: [],
        title: {text: 'Balance General (Dinero)'},
    };
    dataAreaPlot2 = {
        chart: {
            type: 'area',
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: {
                text: "Cantidad",
            },
        },
        credits: {
            enabled: false
        },
        series: [],
        title: {text: 'Uso del vertedero (Camiones)'},
    };
    dataAreaPlot3 = {
        chart: {
            type: 'area',
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: {
                text: "Cantidad",
            },
        },
        credits: {
            enabled: false
        },
        series: [],
        title: {text: 'Descargas en el vertedero'},
    };

    getPlots() {
        let that = this;
        let successCallback = response => {
            if(that.chart['plot1']) {
                that.chart['plot1'].series[0].setData(response.json().series[0].data)
                that.chart['plot1'].xAxis[0].setCategories(response.json().categories)
            }
            else {
                if (response.json().categories)
                    that.dataAreaPlot1.xAxis.categories = response.json().categories;
                that.dataAreaPlot1.series.push(response.json().series[0]);
            }

            if(that.chart['plot2']) {
                that.chart['plot2'].series[0].setData(response.json().series[1].data)
                that.chart['plot2'].xAxis[0].setCategories(response.json().categories)
            }
            else {
                if (response.json().categories)
                    that.dataAreaPlot2.xAxis.categories = response.json().categories;
                that.dataAreaPlot2.series.push(response.json().series[1]);
            }

            if(that.chart['plot3']) {
                that.chart['plot3'].series[0].setData(response.json().series[2].data)
                that.chart['plot3'].xAxis[0].setCategories(response.json().categories)
            }
            else {
                if (response.json().categories)
                    that.dataAreaPlot3.xAxis.categories = response.json().categories;
                that.dataAreaPlot3.series.push(response.json().series[2]);
            }

        }
        this.httputils.doGet("/dashboards/plot/1/" + this.plotDate, successCallback, this.error)
    }

    chart:any=[];

    saveInstance(chartInstance,index) {
        this.chart[index]=[];
        this.chart[index] = chartInstance;
    }

    getPlot2() {
        let successCallback = response => {
            Object.assign(this.dataPlot, response.json());
            this.dataPlot.total = 0;
            this.dataPlot.forEach(val=> {
                if (val.quantity > 0)
                    this.dataPlot.total += val.quantity;
                else val.quantity *= -1;
            })
        }
        this.httputils.doGet("/dashboards/plot/2/" + this.plotDate, successCallback, this.error)
    }

    //consultar Facturas
    form:ControlGroup;
    dateStart:Control;
    dateEnd:Control;

    initForm() {
        this.dateStart = new Control("", Validators.compose([Validators.required]));
        this.dateEnd = new Control("");

        this.form = this._formBuilder.group({
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
        });
    }

    @ViewChild(RecargaFactura)
    recargaFactura:RecargaFactura;

    public paramsFactura:any = {};
    public consultar = false;
    public formatDate1 = {
        format: "mm/yyyy",
        startView: 2,
        minViewMode: 1,
        maxViewMode: 2,
        todayBtn: "linked",
        language: "es",
        forceParse: true,
        autoclose: true,
        todayHighlight: true,
        return: 'YYYY/MM',
    }
    public formatDate2 = {
        format: "yyyy",
        startView: 2,
        minViewMode: 2,
        maxViewMode: 2,
        todayBtn: "linked",
        language: "es",
        forceParse: true,
        autoclose: true,
        todayHighlight: true,
        return: 'YYYY',
    }
    public formatDateFact = {
        format: "dd/mm/yyyy",
        startView: 2,
        minViewMode: 0,
        maxViewMode: 2,
        todayBtn: "linked",
        language: "es",
        forceParse: true,
        autoclose: true,
        todayHighlight: true,
    }

    loadFacturas(event) {
        event.preventDefault();
        let final=this.dateEnd.value;
        if (!this.dateEnd.value) {
            final = (moment(this.dateStart.value).add(1, 'days'));
        }

        this.paramsFactura = {
            'dateStart': moment(this.dateStart.value.toString()).format('DD-MM-YYYY'),
            'dateEnd': moment(final.toString()).format('DD-MM-YYYY'),
        };
        if (this.recargaFactura) {
            this.recargaFactura.params = this.paramsFactura;
            if(this.myglobal.existsPermission('109'))
                this.recargaFactura.cargar();
        }
        this.consultar = true;
    }

    loadFechaPlot(data) {
        this.plotDate = data;
        this.getPlots();
        this.getPlot2();
    }

    loadFechaFac(data, field) {
        if (field == 1)
            this.dateStart.updateValue(data)
        else
            this.dateEnd.updateValue(data)

    }
    public msgLabel:boolean=true;
    cambiar(){
        this.msgLabel=!this.msgLabel;
    }


}


