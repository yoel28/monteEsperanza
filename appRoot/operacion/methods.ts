import {Component, EventEmitter, OnInit, ViewChild, ChangeDetectorRef} from "@angular/core";
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
import 'rxjs/add/operator/debounceTime';
import {TagsInput} from "../common/tagsinput";
import {Tooltip} from "../utils/tooltips/tooltips";

declare var SystemJS:any;
declare var jQuery:any;

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
    get place(){
        let data=[];
        this.data.place.forEach(obj=>{
            data.push(obj.text);
        })
        return data.join(', ');
    }

    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }
}

@Component({
    selector: 'operacion-save',
    templateUrl: SystemJS.map.app+'/operacion/save.html',
    styleUrls: [SystemJS.map.app+'/operacion/style.css'],
    inputs:['idModal'],
    outputs:['save','getInstance'],
    directives:[Search,RecargaSave,TagsInput,Tooltip],
})
export class OperacionSave extends ControllerBase implements OnInit{

    public idModal:string;
    public save:any;
    public getInstance:any;
    public inAnt:any={};

    public pendingId=0;//Identificador cuando se lanza desde un pendiente
    public baseWeight=1;
    public noInWithoutOut=false;

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
        this.noInWithoutOut = (this.myglobal.getParams('NO_IN_WITHOUT_OUT')=='true')?true:false;
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
                            if(that.search && that.search.key && that.search.key == key){
                                that.findControl = c.value;
                            }
                        }
                        if(key == 'route')
                            that.place=null;
                        delete that.searchId[key];
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

        });
        this.form = this._formBuilder.group(this.data);
    }
    public findControl:string="";

    public getDataBody(){
        let body = this.form.value;
        let that=this;
        Object.keys(body).forEach((key:string)=>{
            if(that.model.rulesSave[key].object){
                body[key]=that.searchId[key]?(that.searchId[key].id||body[key]): body[key];
            }
            if(that.model.rulesSave[key].type == 'number' && body[key]!=""){
                body[key]=parseFloat(body[key]);
            }
            if(that.model.rules[key].type=='list'){
                let data=[];
                if(that.data[key] && that.data[key].value && that.data[key].value.length){
                    that.data[key].value.forEach(obj=>{
                        data.push(obj.value || obj);
                    });
                }
                body[key]=data;
            }
        });
        if(this.pendingId>0)
            body['pendingId']=this.pendingId;

        return body;
    }
    //submit

    submitForm(event){
        event.preventDefault();
        let that = this;
        this.waitResponse = true;
        let successCallback= response => {
            that.closeForm();
            that.waitResponse = false;
            that.resetForm();
            that.save.emit(response.json());
            that.toastr.success('Guardado con éxito','Notificación')
        };
        this.setEndpoint('/operations/');
        if(this.pendingId>0)
            this.setEndpoint('/operations/save/auto/');

        let body = this.getDataBody();
        this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    closeForm(){
        jQuery('#'+this.idModal).modal('hide');
    }
    //patch
    patchForm(event){
        event.preventDefault();
        let that=this;
        this.waitResponse = true;
        let successCallback= response => {
            that.closeForm();
            that.waitResponse = false;
            that.resetForm();
            that.save.emit(response.json());
            Object.assign(that.dataSelect,response.json());
            if(that.toastr)
                that.toastr.success('Actualizado con éxito','Notificación');
            that.onPrint(response.json());
        }
        let body = this.getDataBody();
        this.setEndpoint('/operations/');
        this.httputils.doPut(this.endpoint+this.idOperacion,JSON.stringify(body),successCallback,this.error)
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
        if(event)
            event.preventDefault();
        this.findControl=this.data[data.key].value || '';
        this.search=data;
        this.max = 5;
        this.getSearch(event,this.findControl);
    }
    getLoadSearchKey(event,data){
        if(event && event.code && (event.code == 'Enter' || event.code == 'NumpadEnter')){
            if(data.object){
                this.getLoadSearch(null,data);
            }
        }
    }
    //accion al dar click en el boton de buscar del formulario en el search
    getSearch(event,value){
        if(event)
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

        if(this.search.key == 'vehicle' || this.search.key == 'company' || this.search.key == 'container'){

            if((!this.searchId['chofer'] || (this.searchId['chofer'] && this.searchId['chofer'].default)) && data.choferId){
                this.searchId['chofer']={};
                this.data['chofer'].updateValue(data.choferName);
                this.searchId['chofer']={'id':data.choferId,'title':data.choferTelefono,'detail':data.choferName,'default':true};
            }

            if((!this.searchId['company'] || (this.searchId['company'] && this.searchId['company'].default)) && data.companyId){
                this.searchId['company']={};
                this.data['company'].updateValue(data.companyRuc);
                this.searchId['company']={'id':data.companyId,'title':data.companyName,'detail':data.companyRuc,'default':true};
            }

            if((!this.searchId['trashType'] || (this.searchId['trashType'] && this.searchId['trashType'].default)) && data.trashTypeId){
                this.searchId['trashType']={};
                this.data['trashType'].updateValue(data.trashTypeReference);
                this.searchId['trashType']={'id':data.trashTypeId,'title':data.trashTypeTitle,'detail':data.trashTypeReference,'default':true};
            }

            if((!this.searchId['route'] || (this.searchId['route'] && this.searchId['route'].default)) && data.routeId){
                this.searchId['route']={};
                this.data['route'].updateValue(data.routeReference);
                this.searchId['route']={'id':data.routeId,'title':data.routeTitle,'detail':data.routeReference,'default':true};
            }

            if((!this.searchId['container'] || (this.searchId['container'] && this.searchId['container'].default)) && data.containerId){
                this.searchId['container']={};
                this.data['container'].updateValue(data.containerCode);
                this.searchId['container']={'id':data.containerId,'title':data.containerTitle,'detail':data.containerCode};
            }
        }


        if(data.routePlaces || data.places){
            this.loadPlace((data.routePlaces || data.places),this.search.key)
        }

        this.checkBalance();
        this.dataList=[];
        this.search={};
    }

    get textPlaces(){
        let data='';
        if(this.place){
            this.place.forEach(value=>{
                data+=(value.text+'\n');
            })
        }
        return data;

    }
    public place:any;
    loadPlace(place,key){
        if((this.searchId['route'] && this.searchId['route'].default) || key == 'route'){
            this.place = null;
            if(this.model.rules['place'] && this.model.rules['place'].instance)
                this.model.rules['place'].instance.removeAll();
            let that = this;
            setTimeout(()=>{
                that.place = [];
                that.place = place;
            },10);
        }
    }
    // loadPlaceAll(){
    //     let that = this;
    //     if(this.place && this.place.length){
    //         setTimeout(()=>{
    //             if(that.model.rules['place'] && that.model.rules['place'].instance){
    //                 that.place.forEach(obj=>{
    //                     that.model.rules['place'].instance.addValue(obj);
    //                 })
    //             }
    //             else {
    //                 that.loadPlaceAll();
    //             }
    //         },100);
    //     }
    // }

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
    public readOperations=false;

    loadOperationIn(data){
        this.resetForm();
        if(data && data.vehicleId){
            this.searchId['vehicle']={'id':data.vehicleId,'title':data.companyName,'detail':data.vehiclePlate};
            this.data['vehicle'].updateValue(data.vehiclePlate);
            this.model.rulesSave['vehicle'].readOnly=this.model.permissions.lockField;

            this.searchId['company']={'id':data.companyId,'title':data.companyName,'detail':data.companyRUC,'balance':data.companyBalance || '0','minBalance':data.companyMinBalance || '0'};
            this.data['company'].updateValue(data.companyRUC);

            this.data['weightIn'].updateValue(data.weightIn);

            this.data['comment'].updateValue(data.comment);

            this.model.rulesSave['weightIn'].readOnly=this.model.permissions.lockField;

            if(data.choferId){
                this.searchId['chofer']={'id':data.choferId,'title':data.choferTelefono,'detail':data.choferName};
                this.data['chofer'].updateValue(data.choferName);
            }

            if(data.trashTypeId){
                this.searchId['trashType']={'id':data.trashTypeId,'title':data.trashTypeTitle,'detail':data.trashTypeReference};
                this.data['trashType'].updateValue(data.trashTypeReference);
            }

            if(data.routeId){
                this.searchId['route']={'id':data.routeId,'title':data.routeTitle,'detail':data.routeReference};
                this.data['route'].updateValue(data.routeReference);
            }

            if(data.containerId){
                this.searchId['container']={'id':data.containerId,'title':data.containerTitle,'detail':data.containerCode};
                this.data['container'].updateValue(data.containerCode);
            }
            if(data.containerInId){
                this.searchId['container']={'id':data.containerInId,'title':data.containerInTitle,'detail':data.containerInCode};
                this.data['container'].updateValue(data.containerInCode);
            }
            if(data.containerOutId){
                this.searchId['container']={'id':data.containerOutId,'title':data.containerOutTitle,'detail':data.containerOutCode};
                this.data['container'].updateValue(data.containerOutCode);
            }

            if(data.weightOut){
                this.data['weightOut'].updateValue(data.weightOut);
                this.model.rulesSave['weightOut'].readOnly=this.model.permissions.lockField;
                this.model.rulesSave['weightOut'].hidden=false;
            }

            this.loadPlace(data.places.concat(data.placesPosible || []),'route');

            this.checkBalance();

            this.loadPlaces(data.places);

        }
    }

    loadPlaces(data:Object []){
        setTimeout(()=>{
            if(this.model.rules['place'].instance){
                data.forEach(obj=>{
                    this.model.rules['place'].instance.addValue(obj);
                });
            }
        },500);
    }

    loadOperationOut(data){
        this.resetForm();

        this.idOperacion=data.id;

        this.searchId['vehicle']={'id':data.vehicleId,'title':data.companyName,'detail':data.vehiclePlate};
        this.data['vehicle'].updateValue(data.vehiclePlate);
        //this.model.rulesSave['vehicle'].readOnly=this.model.permissions.lockField;

        this.searchId['container']={'id':data.containerId,'title':data.containerTitle,'detail':data.containerCode};
        this.data['container'].updateValue(data.containerCode);
        //this.model.rulesSave['container'].readOnly=false;

        this.searchId['chofer']={'id':data.choferId,'title':data.choferTelefono,'detail':data.choferName};
        this.data['chofer'].updateValue(data.choferName);
        //this.model.rulesSave['chofer'].readOnly=false;

        this.searchId['company']={'id':data.companyId,'title':data.companyName,'detail':data.companyRUC,'balance':data.companyBalance || '0','minBalance':data.companyMinBalance || '0'};
        this.data['company'].updateValue(data.companyRUC);
        //this.model.rulesSave['company'].readOnly=false;

        this.searchId['trashType']={'id':data.trashTypeId,'title':data.trashTypeTitle,'detail':data.trashTypeReference};
        this.data['trashType'].updateValue(data.trashTypeReference);
        //this.model.rulesSave['trashType'].readOnly=false;

        this.searchId['route']={'id':data.routeId,'title':data.routeTitle,'detail':data.routeReference};
        this.data['route'].updateValue(data.routeReference);

        this.place = data.place;
        this.loadPlace(data.places.concat(data.placesPosible || []),'route');

        this.data['weightIn'].updateValue(data.weightIn);
        //this.model.rulesSave['weightIn'].readOnly=this.model.permissions.lockField;

        this.data['weightOut'].updateValue(data.weightOut || data.vehicleWeight);
        this.model.rulesSave['weightOut'].required=true;
        //this.model.rulesSave['weightOut'].readOnly=this.model.permissions.lockField;
        this.model.rulesSave['weightOut'].hidden=false;

        this.data['comment'].updateValue(data.comment);

        this.loadPlaces(data.places);

    }

    resetForm(event?){
        if(event)
            event.preventDefault();
        let that=this;
        this.waitResponse = false;
        this.search={};
        this.searchId={};
        this.dataList={};
        this.pendingId=0;
        this.idOperacion="-1";
        this.readOperations=false;
        Object.keys(this.data).forEach(key=>{
            if(that.model.rules[key].type!='list'){
                (<Control>that.data[key]).updateValue(that.model.rules[key].value);
                (<Control>that.data[key]).setErrors(that.model.rules[key].value);
                that.data[key]._pristine=true;
                if(that.model.rules[key].readOnly)
                    that.model.rules[key].readOnly=false;
            }
            else{
                if(that.model.rules[key] && that.model.rules[key].instance)
                    that.model.rules[key].instance.removeAll()
            }
        });
        this.model.rulesSave['weightOut'].hidden=true;
    }

    @ViewChild(RecargaSave)
    recargaSave:RecargaSave;
    getLoadRecharge(event,data){
        if(event)
            event.preventDefault();
        if(this.recargaSave){
            this.recargaSave.idCompany=data.id;
            this.recargaSave.company.updateValue(data.id);
        }

    }

    refreshField(event,data){
        if(event)
            event.preventDefault();
        let that = this;
        let successCallback= response => {
            if(data.refreshField.callback)
                data.refreshField.callback(this,response.json());
            else {
                let val = response.json()[data.refreshField.field];
                if(data.refreshField.field=='weight')
                    val = val / this.baseWeight;
                that.data[data.key].updateValue(val);
            }
        }
        this.httputils.doGet(data.refreshField.endpoint,successCallback,this.error);
    }

    loadReadOperations(event){
        if(event)
            event.preventDefault();
        let that= this;
        let successCallback= response => {
            Object.assign(that.dataList,response.json());
            that.readOperations=true;
            if(that.dataList && that.dataList.salida && that.dataList.salida.operations && that.dataList.salida.operations.length == 0)
                that.loadOperationIn(that.dataList.entrada);
            if(that.dataList && that.dataList.salida && that.dataList.salida.operations && that.dataList.salida.operations.length == 1 && this.noInWithoutOut)
                that.loadOperationOut(that.dataList.salida.operations[0]);
        };
        if(!(this.data['vehicle'].valid && this.data['vehicle'].value && this.data['vehicle'].value.length))
        {
            that.resetForm();
            this.httputils.doGet('/read',successCallback,this.error);
        }

    }

    loadEdit(data){
        this.dataSelect = data;
        this.loadOperationOut(this.dataSelect);

    }

}