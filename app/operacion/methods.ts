import {Component, EventEmitter, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Search} from "../utils/search/search";
import {globalService} from "../common/globalService";
import {Fecha} from "../utils/pipe";
import {RecargaSave} from "../recarga/methods";
import moment from "moment/moment";


@Component({
    selector: 'operacion-save',
    templateUrl: 'app/operacion/save.html',
    styleUrls: ['app/operacion/style.css'],
    inputs:['idModal','inAnt'],
    outputs:['save'],
    directives:[Search,RecargaSave],
})
export class OperacionSave extends RestController implements OnInit{

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
            'checkBalance':true,
            'checkBalancePermission':this.myglobal.existsPermission('160'),
            'paramsSearch': {
                'label':{'title':"Nombre: ",'detail':"Codigo: "},
                'endpoint':"/search/companies/",
                'where':'',
                'imageGuest':'/assets/img/company-guest.png',
                'field':'company.id',
            },
            'icon':'fa fa-building',
            'object':true,
            'title':'Cliente',
            'placeholder':'Ingrese el Codigo/RUC del cliente',
            'permissions':'80',
            'msg':{
                'error':'El cliente contiene errores',
                'notAuthorized':'No tiene permisos de listar los clientes',
                'errorCheckBalance':"El cliente no tiene saldo suficiente"
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
                            if(c.value && c.value.length > 0){
                                if(that.searchId[key]){
                                    if(that.searchId[key].detail == c.value)
                                        return null;
                                }
                                return {myobject: {valid: false}};
                            }
                            return null;
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
                            else if(that.searchId[key].detail != value){
                                delete that.searchId[key];
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
    public findControl:string="";

    submitForm(event){
        event.preventDefault();
        let that = this;
        let successCallback= response => {
            that.resetForm();
            that.save.emit(response.json());
            that.toastr.success('Guardado con éxito','Notificación')
        };
        this.setEndpoint('/operations/');
        let body = this.form.value;

        Object.keys(body).forEach((key:string)=>{
            if(that.rules[key].object){
                body[key]=that.searchId[key]?(that.searchId[key].id||null): null;
            }
            if(that.rules[key].type == 'number' && body[key]!=""){
                body[key]=parseFloat(body[key]);
            }
        });
        this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    patchForm(event){
        event.preventDefault();
        let that=this;
        let json={};
        json['comment'] = this.form.controls['comment'].value;
        json['weightOut'] = parseFloat(this.form.controls['weightOut'].value);
        let body = JSON.stringify(json);
        let successCallback= response => {
            that.resetForm();
            if(that.toastr)
                that.toastr.success('Actualizado con éxito','Notificación')
            that.onPrint(response.json());
        }
        this.httputils.doPut('/operations/'+this.idOperacion,body,successCallback,this.error)
    }
    //print automatic
    @ViewChild(OperacionPrint)
    operacionPrint:OperacionPrint;
    dataPrint:any={};
    printAuto:boolean=false;
    public onPrint(data){
        let value = this.myglobal.getParams('PRINT_AUTOMATIC_OPERATIONS');
        this.printAuto=false;
        if(value=="true"){
            this.dataPrint=data;
            this.printAuto=true;
            if(this.operacionPrint)
                this.operacionPrint.data=data
        }
    }

    //objecto del search actual
    public search:any={};
    //Lista de id search
    public searchId:any={};
    //Al hacer click en la lupa guarda los valores del objecto
    getLoadSearch(event,data){
        event.preventDefault();
        this.findControl="";
        this.search=data;
        this.getSearch(event,"");
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
        this.searchId[this.search.key]={'id':data.id,'title':data.title,'detail':data.detail,'balance':data.balance || null,'minBalance':data.minBalance || null};
        this.data[this.search.key].updateValue(data.detail);
        this.checkBalance();
        this.dataList=[];
    }
    checkBalance(){

        if(this.searchId['company']){
            let balance=parseFloat(this.searchId['company'].balance || '0');
            let minBalance=parseFloat(this.searchId['company'].minBalance || '0');
            if(balance < minBalance )
            {
                if(!this.myglobal.existsPermission('160')){
                    delete this.searchId['company'];
                    this.data['company'].updateValue('');
                    this.findControl="";
                }
                this.toastr.info('El cliente no tiene saldo suficiente')
            }
        }
    }
    public dataIn:any={};

    public idOperacion="-1";
    public listOperations=false;

    inAntena(data){
        this.resetForm();
        if(data && data.vehicleId){
            this.listOperations=false;
            this.dataList={};
            this.idOperacion="-1";

            this.searchId['vehicle']={'id':data.vehicleId,'title':data.companyName,'detail':data.vehiclePlate};
            this.data['vehicle'].updateValue(data.vehiclePlate);
            this.rules['vehicle'].readOnly=true;

            this.searchId['company']={'id':data.companyId,'title':data.companyName,'detail':data.companyRUC,'balance':data.companyBalance || '0','minBalance':data.companyMinBalance || '0'};
            this.data['company'].updateValue(data.companyRUC);

            this.data['weightIn'].updateValue(data.weightIn);

            this.checkBalance();
        }
        else{
            this.listOperations=true;
        }
    }

    getOperacion(data){
        this.idOperacion=data.id;

        this.searchId['vehicle']={'id':data.vehicleId,'title':data.companyName,'detail':data.vehiclePlate};
        this.data['vehicle'].updateValue(data.vehiclePlate);
        this.rules['vehicle'].readOnly=true;

        this.searchId['company']={'id':data.companyId,'title':data.companyName,'detail':data.companyRUC,'balance':data.companyBalance || '0','minBalance':data.companyMinBalance || '0'};
        this.data['company'].updateValue(data.companyRUC);
        this.rules['company'].readOnly=true;

        this.searchId['trashType']={'id':data.trashTypeId,'title':data.trashTypeTitle,'detail':data.trashTypeReference};
        this.data['trashType'].updateValue(data.trashTypeReference);
        this.rules['trashType'].readOnly=true;

        this.searchId['route']={'id':data.routeId,'title':data.routeTitle,'detail':data.routeReference};
        this.data['route'].updateValue(data.routeReference);
        this.rules['route'].readOnly=true;

        this.data['weightIn'].updateValue(data.weightIn);
        this.rules['weightIn'].readOnly=true;

        this.data['weightOut'].updateValue(this.weightOut);
        this.rules['weightOut'].readOnly=false;
        this.rules['weightOut'].hidden=false;

        this.data['comment'].updateValue(data.comment);

        this.listOperations=false;
    }
    public weightOut:number;

    outAntena(data){
        this.resetForm();
        if(data && data.operations && data.operations.length>1)
        {
            this.listOperations=true;
            this.weightOut=data.weightOut;
            Object.assign(this.dataList,data);
        }
        else{
            if(data.operations)
                this.getOperacion(data.operations[0]);
            else
                this.listOperations=true;

        }
    }
    resetForm(){
        let that=this;
        this.search={};
        this.searchId={};
        Object.keys(this.data).forEach(key=>{
            (<Control>that.data[key]).updateValue(null);
            (<Control>that.data[key]).setErrors(null);
            that.data[key]._pristine=true;
            if(that.rules[key].readOnly)
                that.rules[key].readOnly=false;
        })
        this.rules['weightOut'].hidden=true;
        this.listOperations=false;
    }
    @ViewChild(RecargaSave)
    recargaSave:RecargaSave;
    getLoadRecharge(event,data){
        event.preventDefault();
        if(this.recargaSave){
            this.recargaSave.idCompany=data.id;
            this.recargaSave.company.updateValue(data.id);
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
export class OperacionPrint implements OnInit {
    public data:any={};

    constructor() {
    }
    ngOnInit(){

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
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
}

