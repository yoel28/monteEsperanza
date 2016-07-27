import {Component, EventEmitter} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Search} from "../utils/search/search";
import {globalService} from "../common/globalService";
import {Fecha} from "../utils/pipe";


@Component({
    selector: 'operacion-save',
    templateUrl: 'app/operacion/save.html',
    styleUrls: ['app/operacion/style.css'],
    inputs:['idModal','inAnt'],
    outputs:['save'],
    directives:[Search],
})
export class OperacionSave extends RestController{

    public idModal:string;
    public save:any;
    public inAnt:any={};

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
                'label':{'title':"Empresa: ",'detail':"Placa: "},
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
            'placeholder':'Ingrese el RUC o nombre del cliente',
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
                'label':{'title':"Tipo: ",'detail':"Referencia: "},
                'endpoint':"/search/type/trash/",
                'where':'',
                'imageGuest':'/assets/img/trash-guest.png',
                'field':'trashType',
            },
            'icon':'fa fa-trash',
            'object':true,
            'title':'Basura',
            'placeholder':'Referencia del tipo de basura',
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
                'label':{'title':"Ruta: ",'detail':"Referencia: "},
                'endpoint':"/search/routes/",
                'where':'',
                'imageGuest':'/assets/img/truck-guest.png',
                'field':'route.id',
            },
            'icon':'fa fa-random',
            'object':true,
            'title':'Ruta',
            'placeholder':'Referencia de la ruta',
            'permissions':'69',
            'msg':{
                'error':'La ruta contiene errores',
                'notAuthorized':'No tiene permisos de listar las rutas',
            },
        },
        'weightIn':{
            'type':'number',
            'required':true,
            'double':true,
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
            'hidden':true,
            'double':true,
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
    
                if(that.rules[key].required && that.rules[key].object)
                {
                    that.data[key] = new Control("",Validators.compose([Validators.required,
                        (c:Control)=> {
                            return (that.searchId[key] && that.searchId[key].title == c.value) ? null : {pattern: {valid: false}};
                        }
                    ]));
                }
                else if (that.rules[key].required)
                    that.data[key] = new Control("",Validators.compose([Validators.required]));
                else
                    that.data[key] = new Control("");

                if(that.rules[key].object)
                {
                    that.data[key].valueChanges.subscribe((value: string) => {
                        if(value && value.length > 0){
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

    submitForm(event){
        event.preventDefault();
        let that = this;
        let successCallback= response => {
            Object.keys(that.form.controls).forEach((key) => {
                (<Control>that.form.controls[key]).updateValue("");
                (<Control>that.form.controls[key]).setErrors(null);
                this.searchId={};
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
            if(that.rules[key].double && body[key]!=""){
                body[key]=parseFloat(body[key]);
            }

        });
        this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    patchForm(event){
        event.preventDefault();
        let that=this;
        let json={}
        json['comment'] = this.form.controls['comment'].value;
        json['weightOut'] = parseFloat(this.form.controls['weightOut'].value);
        let body = JSON.stringify(json);

        let successCallback= response => {
            if(that.toastr)
                that.toastr.success('Actualizado con éxito','Notificación')
        }
        this.httputils.doPut('/operations/'+this.idOperacion,body,successCallback,this.error)

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
        this.searchId[this.search.key]={'id':data.id,'title':data.detail};
        (<Control>this.form.controls[this.search.key]).updateValue(data.detail);
        this.dataList=[];
    }
    public dataIn:any={};
    public antenaEnabled:boolean=false;

    public listOperations=false;
    inAntena(data){
        this.readOnlyfalse();
        this.antenaEnabled=true;
        this.idOperacion="-1";
        let that = this;

        that.searchId['vehicle']={'id':data.vehicleId,'title':data.vehiclePlate};
        (<Control>this.form.controls['vehicle']).updateValue(data.vehiclePlate);
        that.rules['vehicle'].readOnly=true;

        that.searchId['company']={'id':data.companyId,'title':data.companyRuc};
        (<Control>this.form.controls['company']).updateValue(data.companyRuc);

        (<Control>this.form.controls['weightIn']).updateValue(data.weightIn);
    }
    public idOperacion="-1";
    getOperacion(data){
        this.readOnlyfalse();

        this.idOperacion=data.id;
        this.searchId['vehicle']={'id':data.vehicleId,'title':data.vehiclePlate};
        (<Control>this.form.controls['vehicle']).updateValue(data.vehiclePlate);
        this.rules['vehicle'].readOnly=true;

        this.searchId['company']={'id':data.companyId,'title':data.companyRuc};
        (<Control>this.form.controls['company']).updateValue(data.companyRuc);
        this.rules['company'].readOnly=true;

        this.searchId['trashType']={'id':data.typeTrashId,'title':data.trashTypeReference};
        (<Control>this.form.controls['trashType']).updateValue(data.trashTypeReference);
        this.rules['trashType'].readOnly=true;

        this.searchId['route']={'id':data.routeId,'title':data.routeReference};
        (<Control>this.form.controls['route']).updateValue(data.routeReference);
        this.rules['route'].readOnly=true;

        (<Control>this.form.controls['weightIn']).updateValue(data.weightIn);
        this.rules['weightIn'].readOnly=true;

        (<Control>this.form.controls['weightOut']).updateValue(this.weightOut);
        this.rules['weightOut'].readOnly=false;
        this.rules['weightOut'].hidden=false;

        (<Control>this.form.controls['comment']).updateValue(data.comment);

        this.listOperations=false;
    }
    public weightOut:number;

    readOnlyfalse(){
        this.rules['vehicle'].readOnly=false;
        this.rules['company'].readOnly=false;
        this.rules['trashType'].readOnly=false;
        this.rules['route'].readOnly=false;
        this.rules['weightIn'].readOnly=false;
        this.rules['weightOut'].hidden=true;
        this.listOperations=false;
    }

    outAntena(data){
        if(data.operations.length>1)
        {
            this.weightOut=data.weightOut;
            Object.assign(this.dataList,data);
            this.listOperations=true;
        }
    }
}


@Component({
    selector: 'operacion-print',
    templateUrl: 'app/operacion/print.html',
    styleUrls: ['app/operacion/style.css'],
    inputs:['data'],
    pipes:[Fecha],
})
export class OperacionPrint{
    public data:any={};

    constructor() {
    }

    onPrint(){
        var printContents = document.getElementById("operacion").innerHTML;
        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write('<body onload="window.print()">' + printContents + '</body>');
        popupWin.document.head.innerHTML = (document.head.innerHTML);
        popupWin.document.close();
        this.data={};
    }
}

