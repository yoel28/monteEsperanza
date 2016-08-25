import {Component, ViewChild, OnInit} from "@angular/core";
import {Router} from "@angular/router-deprecated";
import {Http} from "@angular/http";
import {HttpUtils} from "../common/http-utils";
import {RecargaTimeLine, RecargaFactura} from "../recarga/methods";
import {RestController} from "../common/restController";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";
import {ControlGroup, Control, Validators, FormBuilder} from "@angular/common";
import {Datepicker} from "../common/xeditable";
import {CHART_DIRECTIVES} from "angular2-highcharts";

declare var moment:any;
@Component({
    selector: 'home',
    templateUrl: 'app/dashboard/dashboard.html',
    styleUrls: ['app/dashboard/dashboard.css'],
    directives: [RecargaTimeLine, RecargaFactura, Datepicker, CHART_DIRECTIVES],
})
export class Dashboard extends RestController implements OnInit {
    
    dataCamion:any = [];
    httputils:HttpUtils;
    endpoint:string;
    plotDate = "";

    public paramsTimeLine = {
        'offset': 0,
        'max': 5,
        'ruc': ''
    };

    constructor(public router:Router, http:Http, public _formBuilder:FormBuilder, public toastr:ToastsManager, public myglobal:globalService) {
        super(http, toastr);
        this.plotDate = moment().format('YYYY/MM');
        let that=this;
        let formatter = function (hc,scope=that) {
            let data;
            if(scope.plotDate.length==4){
                data=moment(scope.plotDate+"/"+(this.point.index+1),"YYYY/MM")
                data=data.format('MMMM,  YYYY');
            }
            else{
                data=moment(scope.plotDate+"/"+(this.point.index+1),"YYYY/MM/DD")
                data=data.format('dddd D, MMMM  YYYY');
            }
            return '<strong>'+data+'</strong><br/>'
                    + scope.WEIGTH_METRIC+' descargadas: ' + scope.dataAreaPlot1.series[0].data[this.point.index].toFixed(3)+" "+(scope.WEIGTH_METRIC_SHORT||'')+'<br/>'
                    +'Ingreso total: '+scope.dataAreaPlot2.series[0].data[this.point.index].toFixed(2)+(scope.MONEY_METRIC_SHORT||'')
                    +'<br/>Viajes: '+scope.dataAreaPlot3.series[0].data[this.point.index]
                ;
        }
        let formatter2 = function (hc,scope=that) {
            let data;
            if(scope.plotDate.length==4){
                data=moment(scope.plotDate+"/"+(this.point.index+1),"YYYY/MM")
                data=data.format('MMMM,  YYYY');
            }
            else{
                data=moment(scope.plotDate+"/"+(this.point.index+1),"YYYY/MM/DD")
                data=data.format('dddd D, MMMM  YYYY');
            }
            let vert="";
            if(this.series.name == scope.TITLE_USO_VERTEDERO){
                vert= '<br/>'+scope.WEIGTH_METRIC+' descargadas: ' + scope.dataAreaPlot1.series[0].data[this.point.index].toFixed(3)+" "+(scope.WEIGTH_METRIC_SHORT||'')
            }
            return '<strong>'+data+'</strong><br/>'
                    +(this.y).toFixed(2)+scope.MONEY_METRIC_SHORT+" en "+this.series.name+vert

                ;
        }
        let formatter3 = function (hc,scope=that) {
            let data;
            if(scope.plotDate.length==4){
                data=moment(scope.plotDate+"/"+(this.points[0].point.index+1),"YYYY/MM")
                data=data.format('MMMM,  YYYY');
            }
            else{
                data=moment(scope.plotDate+"/"+(this.points[0].point.index+1),"YYYY/MM/DD")
                data=data.format('dddd D, MMMM  YYYY');
            }
            return '<strong>'+data+'</strong><br/>'
                    +this.points[0].series.name+' '+(this.points[0].y).toFixed(2)+(scope.MONEY_METRIC_SHORT||'')+'<br/>'
                    +this.points[1].series.name+' '+(this.points[1].y).toFixed(2)+(scope.MONEY_METRIC_SHORT||'')
                ;
        }


        this.dataAreaPlot1.tooltip.formatter = formatter;
        this.dataAreaPlot2.tooltip.formatter = formatter;
        this.dataAreaPlot3.tooltip.formatter = formatter;
        this.dataAreaPlot4.tooltip.formatter = formatter2;
        this.dataAreaPlot5.tooltip.formatter = formatter3;

    }
    initMoment(){
        moment.updateLocale('en', {
            months : ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            weekdays:["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"]
        });
    }

    ngOnInit() {
        this.initMoment();
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

    public WEIGTH_METRIC_SHORT=this.myglobal.getParams('WEIGTH_METRIC_SHORT');
    public WEIGTH_METRIC=this.myglobal.getParams('WEIGTH_METRIC');
    public MONEY_METRIC_SHORT=this.myglobal.getParams('MONEY_METRIC_SHORT');
    public MONEY_METRIC=this.myglobal.getParams('MONEY_METRIC');
    public VEHICLE_METRIC_SHORT=this.myglobal.getParams('VEHICLE_METRIC_SHORT');
    public VEHICLE_METRIC=this.myglobal.getParams('VEHICLE_METRIC');
    public TITLE_USO_VERTEDERO=this.myglobal.getParams('TITLE_USO_VERTEDERO');

    public PLOT_ID_NEGATIVES=this.myglobal.getParams('PLOT_ID_NEGATIVES');
    public RECHARGE_DEVOLUCION_ID=this.myglobal.getParams('RECHARGE_DEVOLUCION_ID');

    dataAreaPlot1 = {
        chart: {
            renderTo: 'chartcontainer1',
            type: 'area',
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: {
                text:this.WEIGTH_METRIC,
            },
        },
        tooltip: {
            formatter:{}
        },
        credits: {
            enabled: false
        },
        series: [],
        title: {text: 'Disposición final ('+this.WEIGTH_METRIC+')'},
    };
    dataAreaPlot2 = {
        chart: {
            renderTo: 'chartcontainer2',
            type: 'column',
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: {
                text: this.MONEY_METRIC,
            },
        },
        tooltip: {
            formatter:{}
        },
        credits: {
            enabled: false
        },
        series: [],
        title: {text: 'Balance general ('+this.MONEY_METRIC+')'},
    };
    dataAreaPlot3 = {
        chart: {
            renderTo: 'chartcontainer3',
            type: 'line',
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: {
                text: this.VEHICLE_METRIC,
            },
        },
        tooltip: {
            formatter:{}
        },
        credits: {
            enabled: false
        },
        series: [],
        title: {text: ' Viajes al vertedero'},
    };
    dataAreaPlot4 = {
        chart: {
            renderTo: 'chartcontainer4',
            type: 'area',
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            title: {
                text: this.MONEY_METRIC,
            },
        },
        tooltip: {
            formatter:{}
        },
        credits: {
            enabled: false
        },
        series: [],
        title: {text: 'Flujo de caja ('+this.MONEY_METRIC+')'},
    };

    dataAreaPlot5={
        chart: {
            zoomType: 'xy',
            renderTo: 'chartcontainer5',
        },
        credits: {
            enabled: false
        },
        title: {
            text: ' Ingreso neto x Facturado en vertedero'
        },
        subtitle: {
            text: 'Balance general'
        },
        xAxis: [{
            categories: [],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} '+this.MONEY_METRIC_SHORT,
                style: {
                    color: '#FFF'
                }
            },
            title: {
                text: 'Temperature',
                style: {
                    color: '#FFF'
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'Rainfall',
                style: {
                    color: '#FFF'
                }
            },
            labels: {
                format: '{value} '+this.MONEY_METRIC_SHORT,
                style: {
                    color: '#FFF'
                }
            },
            opposite: true
        }],
        tooltip: {
            shared: true,
            formatter:{}
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 100,
            floating: true,
            backgroundColor: '#FFFFFF'
        },
        series: [{
            name: 'Ingreso Neto',
            type: 'column',
            yAxis: 1,
            data: [],
            tooltip: {
                valueSuffix: this.MONEY_METRIC_SHORT,
            }

        }, {
            name: 'Facturado en vertedero',
            type: 'spline',
            data: [],
            tooltip: {
                valueSuffix: this.MONEY_METRIC_SHORT,
            }
        }]
    }

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
            response.json().series[0].data.forEach(key=>{
                this.Total[0].quantity+=key;
            })


        }
        this.httputils.doGet("/dashboards/plot/1/" + this.plotDate, successCallback, this.error)
    }

    chart:any=[];

    saveInstance(chartInstance,index) {
        this.chart[index]=[];
        this.chart[index] = chartInstance;
    }
    public color= {
        'fa fa-cc-amex': 'bg-black',
        'fa fa-cc-mastercard': 'bg-blue',
        'fa fa-credit-card': 'bg-red',
        'fa fa-cc-diners-club': 'bg-dark',
        'fa fa-cc-paypal': 'bg-blue',
        'fa fa-google-wallet': 'bg-red',
        'fa fa-cc-discover': 'bg-orange',
        'fa fa-cc-stripe': 'bg-green',
        'fa fa-paypal': 'bg-yellow',
        'fa fa-cc-jcb': 'bg-violet',
        'fa fa-cc-visa': 'bg-pink',
        'fa fa-money': 'bg-violet',
        'fa fa-truck': 'bg-green',
        'fa fa-refresh': 'bg-ivonne',
        'fa fa-truck 0': 'bg-aqua',
        'fa fa-line-chart 1': 'bg-red',
        'fa fa-money 2': 'bg-green',
        'fa fa-dollar 3': 'bg-yellow',

    };
    public totales:any={};
    public totalTamLg=[6,6,4,4,3,4,3];

    public Total=[
        {'name':'Total descargado ('+this.WEIGTH_METRIC_SHORT+')','icon':'fa fa-truck 0','quantity':0.0,'metric':this.WEIGTH_METRIC_SHORT,'decimal':'.0-3'},
        {'name':'Total facturado ('+this.MONEY_METRIC+')','icon':'fa fa-line-chart 1','quantity':0.0,'metric':this.MONEY_METRIC_SHORT,'decimal':'.0-2'},
        {'name':'Saldo de clientes ('+this.MONEY_METRIC+')','icon':'fa fa-money 2','quantity':0.0,'metric':this.MONEY_METRIC_SHORT,'decimal':'.0-2'},
        {'name':'Total de ingresos ('+this.MONEY_METRIC+')','icon':'fa fa-dollar 3','quantity':0.0,'metric':this.MONEY_METRIC_SHORT,'decimal':'.0-2'},
    ]

    loadTotales(data){
        let that=this;
        that.totales={'list':[],'count':0};
        data.forEach(key=>{
            let total=0;
            key.data.forEach(val=>{
                total+=Math.abs(val);
            })
            if(key.name!='Uso - Vertedero')
                that.totales.list.push({'name':key.name,'icon':key.icon,'quantity':total});

            if(key.name=='Uso - Vertedero')
                this.Total[1].quantity=total;
            else if(key.name=='Devolución')
                this.Total[3].quantity-=total;
            else
                this.Total[3].quantity+=total;

        })
        that.totales.count=data.length;
        that.Total[2].quantity=this.Total[3].quantity-this.Total[1].quantity;
    }

    getPlot2() {
        let that = this;
        let successCallback = response => {
            if(that.chart['plot4']) {

                that.chart['plot4'].series.forEach((data,i)=>{
                    let _data = response.json().series[i];
                    data.setData(_data.data);

                });
                that.chart['plot4'].xAxis[0].setCategories(response.json().categories)
            }
            else {
                if (response.json().categories)
                    that.dataAreaPlot4.xAxis.categories = response.json().categories;
                let _data = response.json().series;
                that.dataAreaPlot4.series = _data;
            }
            let ingresos=[];
            let consumo=[];
            let cat=response.json().categories;

            response.json().series.forEach((obj,x)=>{
                obj.data.forEach((data,y)=>{
                    if(!consumo[y])
                        consumo[y]=0.0;
                    if(!ingresos[y])
                        ingresos[y]=0.0;

                    if(obj.id == 4){
                        consumo[y]+=data;
                    }
                    else if(obj.id == 7){
                        ingresos[y]-=data;
                    }
                    else{
                        ingresos[y]+=data;
                    }

                })
            });
            Object.assign(that.dataAreaPlot5.xAxis[0]['categories'],cat);
            Object.assign(that.dataAreaPlot5.series[0]['data'],ingresos);
            Object.assign(that.dataAreaPlot5.series[1]['data'],consumo);
            if(that.chart['plot5']) {

                that.chart['plot5'].series[0].setData(ingresos);
                that.chart['plot5'].series[1].setData(consumo);
                that.chart['plot5'].xAxis[0].setCategories(cat)
            }

            this.loadTotales(response.json().series);

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
        forceParse: false,
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
        forceParse: false,
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
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
    }

    loadFacturas(event) {

        event.preventDefault();
        let final=this.dateEnd.value;
        if (!this.dateEnd.value) {
            final = (moment(this.dateStart.value).add(1, 'days'));
        }
        else{
            final = (moment(this.dateEnd.value).add(1, 'days'));
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
        this.plotDate = data.date;

        this.Total[0].quantity=0.0;
        this.Total[1].quantity=0.0;
        this.Total[2].quantity=0.0;
        this.Total[3].quantity=0.0;

        this.getPlots();
        this.getPlot2();
    }

    loadFechaFac(data) {
        if (data.key == "1")
            this.dateStart.updateValue(data.date);
        else
            this.dateEnd.updateValue(data.date);

    }
    public msgLabel:boolean=true;
    cambiar(){
        this.msgLabel=!this.msgLabel;
    }
    goOperaciones(event){
        event.preventDefault();
        let link = ['Operacion', {}];
        this.router.navigate(link);

    }


}


