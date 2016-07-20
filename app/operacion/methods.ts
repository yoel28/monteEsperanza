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
            'readOnly':false,
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
            'title':'Vehículo',
            'placeholder':'Ingrese la placa del vehículo',
            'permissions':'69',
            'msg':{
                'error':'El vehículo contiene errores',
                'notAuthorized':'No tiene permisos de listar los vehículos',
            },
        },
        'company':{
            'type':'text',
            'required':true,
            'key':'company',
            'readOnly':false,
            'paramsSearch': {
                'label':{'title':"Nombre: ",'detail':"RUC: "},
                'endpoint':"/search/companies/",
                'where':'',
                'imageGuest':'/assets/img/company-guest.png',
                'field':'company.id',
            },
            'icon':'fa fa-building',
            'object':true,
            'title':'Cliente',
            'placeholder':'Ingrese el RUC del cliente',
            'permissions':'80',
            'msg':{
                'error':'El cliente contiene errores',
                'notAuthorized':'No tiene permisos de listar los clientes',
            },
        },
        'trashType':{
            'type':'text',
            'required':true,
            'key':'trashType',
            'readOnly':false,
            'permissions':'136',
            'paramsSearch': {
                'label':{'title':"Tipo: ",'detail':"Detalle: "},
                'endpoint':"/search/type/trash/",
                'where':'',
                'imageGuest':'/assets/img/trash-guest.png',
                'field':'trashType',
            },
            'icon':'fa fa-trash',
            'object':true,
            'title':'Basura',
            'placeholder':'Ingrese el tipo de basura',
            'msg':{
                'error':'El tipo de basura contiene errores',
                'notAuthorized':'No tiene permisos de listar los tipos de basura',
            },
        },
        'route':{
            'type':'text',
            'required':true,
            'key':'route',
            'readOnly':false,
            'paramsSearch': {
                'label':{'title':"Ruta: ",'detail':"Detalle: "},
                'endpoint':"/search/routes/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'route.id',
            },
            'icon':'fa fa-random',
            'object':true,
            'title':'Ruta',
            'placeholder':'Ingrese la ruta',
            'permissions':'69',
            'msg':{
                'error':'La ruta contiene errores',
                'notAuthorized':'No tiene permisos de listar las rutas',
            },
        },
        'weightIn':{
            'type':'number',
            'required':true,
            'key':'weightIn',
            'readOnly':false,
            'icon':'fa fa-balance-scale',
            'title':'Peso E.',
            'placeholder':'Ingrese el peso de entrada',
            'msg':{
                'error':'El peso debe ser numerico',
            },
        },
        'weightOut':{
            'type':'number',
            'key':'weightOut',
            'readOnly':false,
            'icon':'fa fa-balance-scale',
            'title':'Peso S.',
            'placeholder':'Peso de salida',
            'msg':{
                'error':'El peso debe ser numerico',
            },
        },
        'comment':{
            'type':'textarea',
            'key':'description',
            'icon':'fa fa-font',
            'title':'Comentarios',
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
            Object.keys(that.form.controls).forEach((key) => {
                (<Control>that.form.controls[key]).updateValue("");
                (<Control>that.form.controls[key]).setErrors(null);
                if(that.rules[key].readOnly)
                    that.rules[key].readOnly=false;
            });
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
    public dataIn:any={};
    public antenaEnabled:boolean=false;
    inAntena(event){
        event.preventDefault();
        this.antenaEnabled=true;
        let that = this;
        let successCallback= response => {
            let data=response.json();
            that.searchId['vehicle']={'id':data.vehicleId,'title':data.vehiclePlate};
            (<Control>this.form.controls['vehicle']).updateValue(data.vehiclePlate);
            that.rules['vehicle'].readOnly=true;

            that.searchId['company']={'id':data.companyId,'title':data.companyName};
            (<Control>this.form.controls['company']).updateValue(data.companyName);
            that.rules['company'].readOnly=true;

            (<Control>this.form.controls['weightIn']).updateValue(data.weightIn);
            that.rules['weightIn'].readOnly=true;
        }
        this.httputils.doGet('consultas/in.json',successCallback,this.error,true)
    }
    outAntena(event){
        event.preventDefault();
        let that = this;
        this.antenaEnabled=true;
        let successCallback= response => {
            let data=response.json()[0];
            that.searchId['vehicle']={'id':data.vehicleId,'title':data.vehiclePlate};
            (<Control>this.form.controls['vehicle']).updateValue(data.vehiclePlate);
            that.rules['vehicle'].readOnly=true;

            that.searchId['company']={'id':data.companyId,'title':data.companyName};
            (<Control>this.form.controls['company']).updateValue(data.companyName);
            that.rules['company'].readOnly=true;

            that.searchId['trashType']={'id':data.typeTrashId,'title':data.typeTrashName};
            (<Control>this.form.controls['trashType']).updateValue(data.typeTrashName);
            that.rules['trashType'].readOnly=true;

            that.searchId['route']={'id':data.routeId,'title':data.routeName};
            (<Control>this.form.controls['route']).updateValue(data.routeName);
            that.rules['route'].readOnly=true;

            (<Control>this.form.controls['weightIn']).updateValue(data.weightIn);
            that.rules['weightIn'].readOnly=true;

            (<Control>this.form.controls['weightOut']).updateValue(data.weightOut);
            that.rules['weightOut'].readOnly=true;
        }
        this.httputils.doGet('consultas/out.json',successCallback,this.error,true)
    }
}

