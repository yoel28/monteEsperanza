import {Component, EventEmitter, OnInit} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";

@Component({
    selector: 'save',
    templateUrl: 'app/utils/save/index.html',
    styleUrls: ['app/utils/save/style.css'],
    inputs:['params','rules'],
    outputs:['save'],
})
export class Save extends RestController implements OnInit{

    /*
    public params = {
        title: "Tipo de empresa",
        idModal: "searchTipoEmpresa",
        endpoint: "/search/type/companies/",
    }
    */
    public params:any={};
    /*
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
     };
    */
    public rules:any={};

    public save:any;

    form:ControlGroup;
    data:any = [];
    keys:any = {};



    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.save = new EventEmitter();
    }
    ngOnInit(){
        this.initForm();
    }

    initForm() {
        let that = this;
        this.keys = Object.keys(this.rules);
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
            else if (that.rules[key].required && that.rules[key].maxLength)
                that.data[key] = new Control("",Validators.compose([Validators.required,Validators.maxLength(that.rules[key].maxLength)]));
            else if (that.rules[key].required )
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
        this.setEndpoint(this.params.endpoint);
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
        this.searchId[this.search.key]={'id':data.id,'title':data.title,'detail':data.detail,'balance':data.balance || null,'minBalance':data.minBalance || null};
        (<Control>this.form.controls[this.search.key]).updateValue(data.detail);
        this.dataList=[];
    }
    //accion seleccionar un item de un select
    setValueSelect(data,key){
        (<Control>this.form.controls[key]).updateValue(data);
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
    }
}

