import {Component, OnInit,ViewChild} from '@angular/core';
import {Router, RouteParams}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {ControllerBase} from "../../common/ControllerBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {OperacionSave, OperacionPrint} from "../methods";
import {Filter} from "../../utils/filter/filter";
import {MPendiente} from "./MPendiente";
import {MOperacion} from "../MOperacion";
import {galeriaComponent, IGaleriaData} from "../galeria/galeriaFolder";
declare var SystemJS:any;
declare var moment:any;
declare var jQuery:any;

@Component({
    selector: 'operacion-pendiente',
    templateUrl: SystemJS.map.app+'/operacion/pendiente/index.html',
    styleUrls: [SystemJS.map.app+'/operacion/pendiente/style.css'],
    providers: [TranslateService],
    directives: [OperacionSave,Filter,OperacionPrint,galeriaComponent],
    pipes: [TranslatePipe]
})
export class OperacionPendiente extends ControllerBase implements OnInit {
   
    public typeView=2;
    public baseWeight=1;
    
    public operation:any;
    public url:any;

    constructor(public params:RouteParams, public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('PEND', '/pendings/',router, http, toastr, myglobal, translate);
    }

    ngOnInit(){

        this.baseWeight = parseFloat(this.myglobal.getParams('BASE_WEIGHT_INDICADOR') || '1');
        this.baseWeight = this.baseWeight >0?this.baseWeight:1;

        this.initModel();
        this.initViewOptions();
        this.where="&where="+encodeURI("[['op':'eq','field':'enabled','value':true],['op':'eq','field':'expired','value':false],['op':'isNotNull','field':'dateIn'],['op':'isNotNull','field':'vehicle']]");
        if(this.params.get('where')){
            this.where = "&where="+encodeURI(this.params.get('where'));
        }
        this.loadPage();
        this.loadUrl();
    }
    loadUrl(){
        this.url = localStorage.getItem('urlAPI') + this.endpoint + '?access_token=' + localStorage.getItem('bearer') + '&tz=' + (moment().format('Z')).replace(':', '') + this.where;
    }
    initModel() {
        this.model = new MPendiente(this.myglobal);
        this.operation = new MOperacion(this.myglobal);
    }

    public list='pendings';
    loadDataPendings(event,data){
        if(event){
            event.preventDefault();
            event.stopPropagation()
        }
        this.list = data.id;
        this.where="&where="+encodeURI(data.where);
        this.loadData();
        this.loadUrl();
    }

    initViewOptions() {
        this.viewOptions["title"] = 'Operaciones pendientes';
        this.viewOptions["buttons"] = [];

        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.filter && this.model.permissions.list,
            'title': 'Filtrar',
            'class': 'btn btn-blue',
            'icon': 'fa fa-filter',
            'modal': this.model.paramsSearch.idModal,
            'quickFilters': [
                {
                    'id': '1',
                    'title': 'Sin registrar',
                    'where': "[['op':'eq','field':'enabled','value':true],['op':'eq','field':'expired','value':false],['op':'isNotNull','field':'dateIn'],['op':'isNotNull','field':'vehicle']]"
                },
                {
                    'id': '2',
                    'title': 'Sin registrar (Vencidas)',
                    'where': "[['op':'eq','field':'enabled','value':true],['op':'eq','field':'expired','value':true],['op':'isNotNull','field':'dateIn'],['op':'isNotNull','field':'vehicle']]"
                },


                {
                    'id': '3',
                    'title': 'Errores sin procesar ',
                    'where': "[['op':'eq','field':'enabled','value':true],['or':[['op':'isNull','field':'vehicle'],['op':'isNull','field':'dateIn']]]]"
                },
                {
                    'id': '4',
                    'title': 'Errores procesados',
                    'where': "[['op':'eq','field':'enabled','value':false],['or':[['op':'isNull','field':'vehicle'],['op':'isNull','field':'dateIn']]]]"
                },


                {
                    'id': '5',
                    'title': 'Vencidos con placa',
                    'where': "[['op':'eq','field':'expired','value':true],['op':'isNotNull','field':'vehicle']]"
                },
                {
                    'id': '6',
                    'title': 'Vencidos sin placa',
                    'where': "[['op':'eq','field':'expired','value':true],['op':'isNull','field':'vehicle']]"
                },


                {
                    'id': '7',
                    'title': 'Registrados manual',
                    'where': "[['op':'isNotNull','field':'operation.id'],['op':'isNull','field':'operationRegistro.id']]"
                },

                {
                    'id': '8',
                    'title': 'Registrados automatico',
                    'where': "[['op':'isNotNull','field':'operationRegistro.id']]"
                },
                {
                    'id': '9',
                    'title': 'Registros automaticos  validados',
                    'where': "[['op':'isNotNull','field':'operation.id'],['op':'isNotNull','field':'operationRegistro.id']]"
                },
                {
                    'id': '10',
                    'title': 'Registros automaticos sin validar',
                    'where': "[['op':'isNull','field':'operation.id'],['op':'isNotNull','field':'operationRegistro.id']]"
                },
                {
                    'id': 'all',
                    'title': 'Ver todos',
                    'where': ""
                },
            ]
        });

        this.viewOptions.actions={};
        this.viewOptions.actions.delete = {
            'title': 'Eliminar',
            'visible': this.model.permissions.delete,
            'message': 'Estás seguro que deseas eliminar la operación pendiente del ',
            'keyAction': 'id'
        };
        this.viewOptions.actions.load = {
            'visible': this.model.permissions.add,
            'modalId':'cargaPendiente'
        };
        this.viewOptions.actions.loadAuto = {
            'visible': this.model.permissions.update,
        };

        this.viewOptions.actions.devolver = {
            'visible': this.model.permissions.lock,
        };
        this.viewOptions.actions.rechazar = {
            'visible': this.model.permissions.update,
        };
        this.viewOptions.actions.print = {
            'visible': this.model.permissions.print,
        };

        this.viewOptions.actions.image = {
            'visible': this.model.permissions.image ,
            'server':this.myglobal.getParams('SERVER_IMAGE_PENDING')
        };

    }

    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }

    @ViewChild(OperacionSave)
    operacionSave:OperacionSave;

    dataOperation:any={};
    cargarData(event,data){
        event.preventDefault();
        this.dataOperation=data;
        if(this.operacionSave) {
            this.operacionSave.loadOperationIn(data);
            this.operacionSave.pendingId=data.id;
        }
    }
    
    liberar(data) {
        this.dataOperation.operationId=data.id
        this.dataOperation.enabled=false;
        
        
    }
    loadWhere2(data){
        this.list='';
        this.loadWhere(data);
        this.loadUrl();
    }
    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;
    onPrintOperation(event,data){
        if(event)
            event.preventDefault();
        let successCallback= response => {
            if(this.operacionPrint)
                this.operacionPrint.data=response.json();
        };
        this.httputils.doGet('/operations/'+data.operationId,successCallback,this.error)
    }
    onLockAuto(data, event) {
        if (event)
            event.preventDefault();
        let json = {};
        json['enabled'] = false;
        json['operation'] = data.operationRegistroId;

        let body = JSON.stringify(json);
        return (this.httputils.onUpdate("/lock" + this.endpoint + data.id, body, data, this.error));
    }
//galeria por carpetas.
    public dataGaleria:IGaleriaData;

    galeriaFolder(id){
        let that = this;
        let server =  this.viewOptions.actions.image.server;
        //this.myglobal.getParams('SERVER_IMAGE_PENDING');

        let successCallback= response => {
            that.dataGaleria = {
                title: "Lote: "+id,
                server:server,
                images:[{
                    folder:id.toString(),
                    created:''
                }],
                id:'',
                selectFolder:id.toString(),
                selectImage:null,
            };
            jQuery('#myModal1').modal('show');
        };
        let error = err => {
            this.waitResponse = false;
            if (that.toastr) {
                that.toastr.error('No se encontraron imagenes para esta operación');
            }
        }
        this.httputils.doGetFile(this.viewOptions.actions.image.server+id + '/thumb1.jpg',successCallback,error,true)

    }



}
