import {Component, EventEmitter} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Search} from "../utils/search/search";
import {globalService} from "../common/globalService";


@Component({
    selector: 'operacion-save',
    templateUrl: 'app/operacion/save.html',
    styleUrls: ['app/operacion/style.css'],
    inputs:['idModal'],
    outputs:['save'],
    directives:[Search],
})
export class OperacionSave extends RestController{

    public idModal:string;
    public save:any;

    form:ControlGroup;
    data:any = [];
    keys:any = {};

    public rules={
        'vehicle':{
            'type':'text',
            'required':true,
            'key':'vehicle',
            'paramsSearch': {
                'label':{'title':"Placa: ",'detail':"Empresa: "},
                'endpoint':"/search/vehicles/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'vehicle.id',
            },
            'icon':'fa fa-truck',
            'object':true,
            'title':'Buscar vehículo',
            'placeholder':'ingrese la placa del vehículo',
            'permissions':'69',
            'msg':{
                'error':'El vehiculo contiene errores',
                'notAuthorized':'No tiene permisos de listar los vehiculos',
            },
        },
        'company':{
            'type':'text',
            'required':true,
            'key':'company',
            'paramsSearch': {
                'label':{'title':"Nombre: ",'detail':"RUC: "},
                'endpoint':"/search/companies/",
                'where':'',
                'imageGuest':'/assets/img/company-guest.png',
                'field':'company.id',
            },
            'icon':'fa fa-building',
            'object':true,
            'title':'Buscar Empresa',
            'placeholder':'Ingrese el RUC de la empresa',
            'permissions':'80',
            'msg':{
                'error':'la empresa contiene errores',
                'notAuthorized':'No tiene permisos de listar las empresas',
            },
        },
        'trashType':{
            'type':'text',
            'required':true,
            'key':'trashType',
            'permissions':'80',
            'paramsSearch': {
                'label':{'title':"Tipo: ",'detail':"Detalle: "},
                'endpoint':"/search/trashType/",
                'where':'',
                'imageGuest':'/assets/img/company-guest.png',
                'field':'trashType.id',
            },
            'icon':'fa fa-trash',
            'object':true,
            'title':'Buscar tipo de basura',
            'placeholder':'Ingrese el tipo de basura',
            'msg':{
                'error':'El tipo de basura contiene errores',
                'notAuthorized':'No tiene permisos de listar los tipos de basura',
            },
        },
        'weightIn':{
            'type':'number',
            'required':true,
            'key':'weightIn',
            'icon':'fa fa-balance-scale',
            'placeholder':'Ingrese el peso de entrada',
            'msg':{
                'error':'El peso debe ser numerico',
            },
        },
        'comment':{
            'type':'textarea',
            'key':'description',
            'icon':'fa fa-font',
            'placeholder':'Ingrese un comentario',
            'msg':{
                'error':'El comentario contiene errores',
            },
        },
    };

    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.save = new EventEmitter();
    }
    ngOnInit(){
        this.initForm();
    }

    initForm() {
        let that = this;
        Object.keys(this.rules).forEach((key)=> {
                that.data[key] = [];
                if(that.rules[key].required)
                    that.data[key] = new Control("",Validators.compose([Validators.required]));
                else
                    that.data[key] = new Control("");

                if(that.rules[key].object)
                {
                    that.data[key].valueChanges.subscribe((value: string) => {
                        if(value.length > 0){
                            that.search=that.rules[key];
                            that.findControl = value;
                            that.dataList=[];
                            that.setEndpoint(that.rules[key].paramsSearch.endpoint+value);
                            if( !that.searchId[key]){
                                that.loadData();
                            }
                            else if(that.searchId[key].title != value){
                                that.searchId[key]=[];
                                that.loadData();
                            }
                            else{
                                this.findControl="";
                                that.search = [];
                            }
                        }
                    });
                }

        });
        this.form = this._formBuilder.group(this.data);
        this.keys = Object.keys(this.rules);
    }

    public loadPage:boolean=false;
    public findControl:string="";

    submitForm(){
        let that = this;
        let successCallback= response => {
            that.save.emit(response.json());
            that.toastr.success('Guardado con éxito','Notificación')
        };
        this.setEndpoint('/operations/');
        let body = this.form.value;
        Object.keys(body).forEach((key:string)=>{
            if(that.rules[key].object){
                body[key]=that.searchId[key]?(that.searchId[key].id||null): null;
            }


        });
        this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    //objecto del search actual
    public search:any={};
    //Lista de id search
    public searchId:any={};
    //Al hacer click en la lupa guarda los valores del objecto
    getLoadSearch(event,data){
        event.preventDefault();
        this.search=data;
    }
    //accion al dar click en el boton de buscar del formulario en el search
    getSearch(event,value){
        event.preventDefault();
        this.setEndpoint(this.search.paramsSearch.endpoint+value);
        this.loadData();
    }
    //accion al dar click en el boton de cerrar el formulario
    searchQuit(event){
        event.preventDefault();
        this.search={};
        this.dataList={};
    }
    //accion al seleccion un parametro del search
    getDataSearch(data){
        this.searchId[this.search.key]={'id':data.id,'title':data.title};
        (<Control>this.form.controls[this.search.key]).updateValue(data.title);
        this.dataList=[];
    }
}
