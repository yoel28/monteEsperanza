import {Component, EventEmitter, OnInit,AfterViewInit} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {Xcropit, Xfile, ColorPicker, Datepicker} from "../../common/xeditable";
import {CatalogApp} from "../../common/catalogApp";
declare var SystemJS:any;
@Component({
    selector: 'save',
    templateUrl: SystemJS.map.app+'/utils/save/index.html',
    styleUrls: [SystemJS.map.app+'/utils/save/style.css'],
    directives:[Xcropit,Xfile,ColorPicker,Datepicker],
    inputs:['params','rules'],
    outputs:['save','getInstance'],
})
export class Save extends RestController implements OnInit,AfterViewInit{

    public params:any={};
    public msg:any = CatalogApp.msg;

    public rules:any={};
    public id:string;
    public dataSelect:any;

    public save:any;
    public getInstance:any;

    form:ControlGroup;
    data:any = [];
    keys:any = {};
    public baseWeight=1;



    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.save = new EventEmitter();
        this.getInstance = new EventEmitter();
    }
    ngOnInit(){
        this.baseWeight = parseFloat(this.myglobal.getParams('BASE_WEIGHT_INDICADOR') || '1');
        this.baseWeight = this.baseWeight >0?this.baseWeight:1;
        this.initForm();

    }
    ngAfterViewInit(){
        this.getInstance.emit(this);
        if(this.params.prefix && !this.myglobal.objectInstance[this.params.prefix])
        {
            this.myglobal.objectInstance[this.params.prefix]={};
            this.myglobal.objectInstance[this.params.prefix]=this;
        }
    }

    initForm() {
        let that = this;
        Object.keys(this.rules).forEach((key)=> {

            that.data[key] = [];
            let validators=[];
            if(that.rules[key].required)
                validators.push(Validators.required);
            if(that.rules[key].maxLength)
                validators.push(Validators.maxLength(that.rules[key].maxLength));
            if(that.rules[key].minLength)
                validators.push(Validators.minLength(that.rules[key].minLength));
            if(that.rules[key].object)
            {
                validators.push(
                    (c:Control)=> {
                        if(c.value && c.value.length > 0){
                            if(that.searchId[key]){
                                if(that.searchId[key].detail == c.value)
                                    return null;
                            }
                            return {object: {valid: true}};
                        }
                        return null;
                    });
            }
            if(that.rules[key].email)
            {
                validators.push(
                    (c:Control)=> {
                        if(c.value && c.value.length > 0) {
                            let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
                            return EMAIL_REGEXP.test(c.value) ? null : {'email': {'valid': true}};
                        }
                        return null;
                    });
            }
            that.data[key] = new Control('',Validators.compose(validators));
            if(that.rules[key].value)
                that.data[key].updateValue(that.rules[key].value);


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
        this.keys = Object.keys(this.rules);
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
        if(this.params.updateField)
            this.httputils.onUpdate(this.endpoint+this.id,JSON.stringify(body),this.dataSelect,this.error);
        else
            this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    //objecto del search actual
    public search:any={};
    //Lista de id search
    public searchId:any={};
    //Al hacer click en la lupa guarda los valores del objecto
    getLoadSearch(event,data){
        event.preventDefault();
        this.max=5;
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
        (<Control>this.form.controls[this.search.key]).updateValue(data.detail);
        this.dataList=[];
    }
    //accion seleccionar un item de un select
    setValueSelect(data,key){
        (<Control>this.form.controls[key]).updateValue(data);
        if(data=='-1')
            (<Control>this.form.controls[key]).updateValue(null);
    }
    resetForm(){
        let that=this;
        this.search={};
        this.searchId={};
        this.params.updateField=false;
        Object.keys(this.data).forEach(key=>{
            (<Control>that.data[key]).updateValue(null);
            (<Control>that.data[key]).setErrors(null);
            that.data[key]._pristine=true;
            if(that.rules[key].readOnly)
                that.rules[key].readOnly=false;
        })
    }
    refreshField(event,data){
        event.preventDefault();
        let that = this;
        let successCallback= response => {
            let val = response.json()[data.refreshField.field]
            if(data.refreshField.field=='weight')
                val = val / this.baseWeight
            that.data[data.key].updateValue(val);
        }
        this.httputils.doGet(data.refreshField.endpoint,successCallback,this.error);
    }
    setColor(data,key){
        this.data[key].updateValue(data);
    }
    changeImage(data,key){
        (<Control>this.form.controls[key]).updateValue(data);
    }

    setLoadDataModel(data)
    {
        this.resetForm();
        if(data.id)
        {
            this.id = data.id;
            Object.keys(data).forEach(key=>{
                if(this.data[key])
                {
                    (<Control>this.form.controls[key]).updateValue(data[key]);
                    this.data[key].updateValue(data[key]);
                }
            })
            this.params.updateField=true;
            Object.assign(this.dataSelect,data);
        }
    }
    public getKeys(data){
        return Object.keys(data || {});
    }
    loadDate(data,key){
        this.data[key].updateValue(data);

    }
}

