import {Component, EventEmitter, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {Router}           from '@angular/router-deprecated';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Search} from "../utils/search/search";
import {globalService} from "../common/globalService";
import {Fecha} from "../utils/pipe";
import {RecargaSave} from "../recarga/methods";
import moment from "moment/moment";
import {ControllerBase} from "../common/ControllerBase";
import {TranslateService} from "ng2-translate/ng2-translate";
import {MOperacion} from "./MOperacion";
declare var SystemJS:any;

@Component({
    selector: 'operacion-save',
    templateUrl: SystemJS.map.app+'/operacion/save.html',
    styleUrls: [SystemJS.map.app+'/operacion/style.css'],
    inputs:['idModal','inAnt'],
    outputs:['save','getInstance'],
    directives:[Search,RecargaSave],
})
export class OperacionSave extends ControllerBase implements OnInit{

    public idModal:string;
    public save:any;
    public getInstance:any;
    public inAnt:any={};

    public pending=0;
    public baseWeight=1;
    
    form:ControlGroup;
    data:any = [];
    keys:any = {};

    constructor(public _formBuilder: FormBuilder,public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('OP', '/operations/',router, http, toastr, myglobal, translate);
        this.save = new EventEmitter();
        this.getInstance = new EventEmitter();
    }

    ngOnInit(){
        this.baseWeight = parseFloat(this.myglobal.getParams('BASE_WEIGHT_INDICADOR') || '1');
        this.baseWeight = this.baseWeight >0?this.baseWeight:1;
        this.initModel();
        this.initForm();
    }
    initModel() {
        this.model = new MOperacion(this.myglobal);
    }
    ngAfterViewInit(){
        this.getInstance.emit(this);
    }

    initForm() {
        let that = this;
        this.keys = Object.keys(this.model.rulesSave);
        Object.keys(this.model.rulesSave).forEach((key)=> {

            that.data[key] = [];
            let validators=[];
            if(that.model.rulesSave[key].required)
                validators.push(Validators.required);
            if(that.model.rulesSave[key].maxLength)
                validators.push(Validators.maxLength(that.model.rulesSave[key].maxLength));
            if(that.model.rulesSave[key].minLength)
                validators.push(Validators.minLength(that.model.rulesSave[key].minLength));
            if(that.model.rulesSave[key].object)
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
            if(that.model.rulesSave[key].type=='email')
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
            that.data[key] = new Control(null,Validators.compose(validators));
            if(that.model.rulesSave[key].value)
                that.data[key].updateValue(that.model.rulesSave[key].value);

            if(that.model.rulesSave[key].object)
            {
                that.data[key].valueChanges.subscribe((value: string) => {
                    if(value && value.length > 0){
                        that.search=that.model.rulesSave[key];
                        that.findControl = value;
                        that.dataList=[];
                        that.setEndpoint(that.model.rulesSave[key].paramsSearch.endpoint+value);
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
        this.setEndpoint('/operations/');
        if(this.pending>0)
            this.setEndpoint('/operations/save/auto/');
        
        let body = this.form.value;

        Object.keys(body).forEach((key:string)=>{
            if(that.model.rulesSave[key].object){
                body[key]=that.searchId[key]?(that.searchId[key].id||null): null;
            }
            if(that.model.rulesSave[key].type == 'number' && body[key]!=""){
                body[key]=parseFloat(body[key]);
            }
        });
        if(this.pending>0)
            body['pendingId']=this.pending;

        this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    patchForm(event){
        event.preventDefault();
        let that=this;

        let body = this.form.value;
        Object.keys(body).forEach((key:string)=>{
            if(that.model.rulesSave[key].object){
                body[key]=that.searchId[key]?(that.searchId[key].id||null): null;
            }
            if(that.model.rulesSave[key].type == 'number' && body[key]!=""){
                body[key]=parseFloat(body[key]);
            }
        });
        let successCallback= response => {
            that.resetForm();
            Object.assign(that.dataSelect,response.json());
            if(that.toastr)
                that.toastr.success('Actualizado con éxito','Notificación');
            that.onPrint(response.json());
        }
        this.httputils.doPut('/operations/'+this.idOperacion,JSON.stringify(body),successCallback,this.error)
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
        this.max = 5;
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

        if(this.search.key == 'vehicle'){
            if(!this.searchId['chofer'] || (this.searchId['chofer'] && this.searchId['chofer'].default)){
                this.searchId['chofer']={};
                this.data['chofer'].updateValue(data.choferName);
                this.searchId['chofer']={'id':data.choferId,'title':data.choferTelefono,'detail':data.choferName,'default':true};
            }

        }

        if(this.search.key == 'container'){
            if(!this.searchId['company'] || (this.searchId['company'] && this.searchId['company'].default)){
                this.searchId['company']={};
                this.data['company'].updateValue(data.companyRuc);
                this.searchId['company']={'id':data.companyId,'title':data.companyName,'detail':data.companyRuc,'default':true};
            }

        }

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

            this.searchId['vehicle']={'id':data.vehicleId,'title':data.companyName,'detail':data.vehiclePlate};
            this.data['vehicle'].updateValue(data.vehiclePlate);
            this.model.rulesSave['vehicle'].readOnly=false;

            this.searchId['company']={'id':data.companyId,'title':data.companyName,'detail':data.companyRUC,'balance':data.companyBalance || '0','minBalance':data.companyMinBalance || '0'};
            this.data['company'].updateValue(data.companyRUC);

            this.data['weightIn'].updateValue(data.weightIn);

            if(data.weightOut){
                this.data['weightOut'].updateValue(data.weightOut);

                this.model.rulesSave['weightOut'].readOnly=true;
                this.model.rulesSave['weightIn'].readOnly=true;
                
                this.model.rulesSave['weightOut'].hidden=false;
            }

            if(this.myglobal.existsPermission('OP_EDIT_WEIGHT')){
                this.model.rulesSave['weightIn'].readOnly=false;
                this.model.rulesSave['weightOut'].readOnly=false;
            }

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
        this.model.rulesSave['vehicle'].readOnly=false;

        this.searchId['container']={'id':data.containerId,'title':data.containerTitle,'detail':data.containerCode};
        this.data['container'].updateValue(data.containerCode);
        this.model.rulesSave['container'].readOnly=false;

        this.searchId['chofer']={'id':data.choferId,'title':data.choferTelefono,'detail':data.choferName};
        this.data['chofer'].updateValue(data.choferName);
        this.model.rulesSave['chofer'].readOnly=false;

        this.searchId['company']={'id':data.companyId,'title':data.companyName,'detail':data.companyRUC,'balance':data.companyBalance || '0','minBalance':data.companyMinBalance || '0'};
        this.data['company'].updateValue(data.companyRUC);
        this.model.rulesSave['company'].readOnly=false;

        this.searchId['trashType']={'id':data.trashTypeId,'title':data.trashTypeTitle,'detail':data.trashTypeReference};
        this.data['trashType'].updateValue(data.trashTypeReference);
        this.model.rulesSave['trashType'].readOnly=false;

        this.searchId['route']={'id':data.routeId,'title':data.routeTitle,'detail':data.routeReference};
        this.data['route'].updateValue(data.routeReference);
        this.model.rulesSave['route'].readOnly=false;

        this.data['weightIn'].updateValue(data.weightIn);
        this.model.rulesSave['weightIn'].readOnly=false;

        this.data['weightOut'].updateValue(data.weightOut || this.weightOut || data.vehicleWeight);
        this.model.rulesSave['weightOut'].required=true;
        this.model.rulesSave['weightOut'].readOnly=false;
        this.model.rulesSave['weightOut'].hidden=false;

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
        this.dataList={};
        Object.keys(this.data).forEach(key=>{
            (<Control>that.data[key]).updateValue(null);
            (<Control>that.data[key]).setErrors(null);
            that.data[key]._pristine=true;
            if(that.model.rulesSave[key].readOnly)
                that.model.rulesSave[key].readOnly=false;
        })
        this.model.rulesSave['weightOut'].hidden=true;
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

    //cargar entradas desde la antena
    loadInAnt(event?){
        if(event)
            event.preventDefault();
        this.idOperacion="-1";
        let that= this;
        let successCallback= response => {
            let dataOperation=response.json();
            that.inAntena(dataOperation['entrada']);
        }
        this.httputils.doGet('/in/operations',successCallback,this.error);
    }
    //cargar salidas desde la antena
    loadOutAnt(event?,data?){
        if(event)
            event.preventDefault();
        this.idOperacion="-2";
        let that= this;
        if(!data){
            let successCallback= response => {
                let dataOperation=response.json();
                that.outAntena(dataOperation['salida'] || {});
            }
            this.httputils.doGet('/out/operations',successCallback,this.error);
        }
        else{
            let dataOperation={'operations':[]};
            dataOperation.operations.push(data);
            that.outAntena(dataOperation || {});
        }
    }
    loadEdit(data){
        this.dataSelect = data;
        this.resetForm();
        this.getOperacion(this.dataSelect);
    }


}


@Component({
    selector: 'operacion-print',
    templateUrl: SystemJS.map.app+'/operacion/print.html',
    styleUrls: [SystemJS.map.app+'/operacion/style.css'],
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

