import {Component, EventEmitter, OnInit, AfterViewInit, ViewChild, ElementRef} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {Xcropit, Xfile, ColorPicker, Datepicker,SMDropdown} from "../../common/xeditable";
import {CatalogApp} from "../../common/catalogApp";
import {TagsInput} from "../../common/tagsinput";
import 'rxjs/add/operator/debounceTime';
import {DateTimePicker} from "../../com.zippyttech.ui/directive/date-time-picker/date-time-picker";



declare var SystemJS:any;
declare var jQuery:any;
@Component({
    selector: 'save',
    templateUrl: SystemJS.map.app+'/utils/save/index.html',
    styleUrls: [SystemJS.map.app+'/utils/save/style.css'],
    directives:[Xcropit,Xfile,ColorPicker,Datepicker,SMDropdown,TagsInput,DateTimePicker],
    inputs:['params','rules'],
    outputs:['save','getInstance'],
})
export class Save extends RestController implements OnInit,AfterViewInit{

    public params:any={};
    public msg:any = CatalogApp.msg;

    public rules:any={};
    public id:string;
    public dataSelect:any={};

    public save:any;
    public getInstance:any;

    form:ControlGroup;
    data:any = {};
    keys:any = {};
    public baseWeight=1;
    public delete=false;
    public keyFindData='';



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

            if(that.rules[key].callBack){
                that.data[key]
                    .valueChanges
                    .debounceTime(500)
                    .subscribe((value: string) => {
                        if(value && value.length > 0){
                            that.rules[key].callBack(that,value);
                        }
                    })
            }


            if(that.rules[key].object)
            {
                that.data[key]
                    .valueChanges
                    .debounceTime(500)
                    .subscribe((value: string) => {
                        if(value && value.length > 0){
                            if(that.searchId[key]){
                                if(that.searchId[key].detail != value){
                                    delete that.searchId[key];
                                }
                                else{
                                    that.search = [];
                                }
                            }
                        }
                });
            }

        });
        this.keys = Object.keys(this.rules);
        this.form = this._formBuilder.group(this.data);
    }
    addTagManual(event,key){
        if(event)
            event.preventDefault();
        let tag=jQuery('#'+key+'manual').val();
        if(tag && tag.length)
        {
            jQuery('#'+key+'manual').val('');
            if(this.rules[key].callback){
                this.rules[key].callback(this,tag);
            }
            else{
                this.rules[key].instance.addValue(
                    {
                        'id': 0,
                        'value': tag,
                        'title': 'Entrada manual'
                    }
                );
            }

        }

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
            if(that.rules[key].prefix && that.rules[key].type=='text' && body[key]!="" && !that.rules[key].object)
            {
                body[key] = that.rules[key].prefix + body[key];
            }
            if(that.rules[key].type=='list'){
                let data=[];
                if(that.data[key] && that.data[key].value && that.data[key].value.length){
                    that.data[key].value.forEach(obj=>{
                        if(that.rules[key].save){
                            data.push(obj[that.rules[key].save.key]);

                        }else{
                            that.rules[key].onlyId?data.push(+(obj.value || obj)):data.push(obj.value || obj)
                        }
                    });
                }
                body[key]=data;
            }
            if(that.rules[key].type=='select2'){
                let data=[];
                if(that.data[key] && that.data[key].value && that.data[key].value.length){
                    that.data[key].value.forEach(obj=>{
                        data.push(+(obj.id || obj.value))
                    });
                }
                body[key]=data;
            }

            if(that.rules[key].setEqual){
                body[that.rules[key].setEqual]=body[key];
            }

        });
        if(this.params.updateField)
            this.httputils.onUpdate(this.endpoint+this.id,JSON.stringify(body),this.dataSelect,this.error).then((respnse)=>{
                that.resetForm();
            });
        else
            this.httputils.doPost(this.endpoint,JSON.stringify(body),successCallback,this.error);
    }
    //objecto del search actual
    public search:any={};
    //Lista de id search
    public searchId:any={};
    //Al hacer click en la lupa guarda los valores del objecto

    @ViewChild('find') find:ElementRef;
    getLoadSearch(data,value=''){
        this.max=5;
        this.findControl=value;
        this.search=data;
        this.dataList = [];
        this.getSearch(null,value);
        setTimeout(()=>{
            if(this.find && this.find.nativeElement)
                this.find.nativeElement.focus();
        },500);
    }
    //accion al dar click en el boton de buscar del formulario en el search
    getSearch(event,value){
        if(event)
            event.preventDefault();
        this.setEndpoint(this.search.paramsSearch.endpoint+value);
        this.loadData().then(
            response=>{
                if(this.dataList && this.dataList.count == 1){
                    this.getDataSearch(this.dataList.list[0]);
                }
            }
        );;
    }
    //accion al dar click en el boton de cerrar el formulario
    searchQuit(event){
        event.preventDefault();
        this.search={};
        this.dataList={};
    }
    //accion al seleccion un parametro del search
    getDataSearch(data:any,key?:string){
        (<Control>this.form.controls[this.search.key || key]).updateValue(this.rules[this.search.key || key].value);

        setTimeout(()=>{
            this.searchId[this.search.key || key]={'id':data.id,'title':data.title,'detail':data.detail,'balance':data.balance || null,'minBalance':data.minBalance || null,data:data};
            (<Control>this.form.controls[this.search.key || key]).updateValue(data.detail);
            this.dataList=[];
        },100);
    }

    getDisabled(rule:any){
        if(rule.disabled){
            return rule.disabled(this);
        }
        return false;
    }
    isValid(key:string):boolean{
        return this.form.controls[key].valid;
    }

    //accion seleccionar un item de un select
    setValueSelect(data,key){
        (<Control>this.form.controls[key]).updateValue(data);
        if(data=='-1')
            (<Control>this.form.controls[key]).updateValue(null);
    }
    resetForm(event?:Event){
        if(event)
            event.preventDefault();
        let that=this;
        this.search={};
        this.searchId={};
        this.delete=false;
        this.id = null;
        this.params.updateField=false;
        Object.keys(this.data).forEach(key=>{
            if(that.rules[key].type!='list' && that.rules[key].type!='select2' && that.rules[key].type!='date'){
                (<Control>that.data[key]).updateValue(that.rules[key].value);
                (<Control>that.data[key]).setErrors(that.rules[key].value);
                that.data[key]._pristine=true;
                if(that.rules[key].readOnly)
                    that.rules[key].readOnly=false;
            }
            else{
                if(that.rules[key] && that.rules[key].instance)
                    that.rules[key].instance.removeAll();

            }
        })
    }
    loadDelete(event){
        this.setEndpoint(this.params.endpoint);
        this.onDelete(event,this.id);
    }
    refreshField(data){

        let that = this;
        let successCallback= response => {
            if(data.refreshField.callback)
            {
                data.refreshField.callback(data,response.json(),that.data[data.key]);
            }
            else {
                let val = response.json()[data.refreshField.field]
                if(data.refreshField.field=='weight')
                    val = val / this.baseWeight
                that.data[data.key].updateValue(val);
            }
        }
        this.httputils.doGet(data.refreshField.endpoint,successCallback,this.error);
    }
    setColor(data,key){
        this.data[key].updateValue(data);
    }
    changeImage(data,key){
        (<Control>this.form.controls[key]).updateValue(data);
    }

    setLoadDataModel(data,_delete=false)
    {
        let that = this;
        this.resetForm();
        if(data.id)
        {
            this.id = data.id;
            Object.keys(data).forEach(key=>{
                if(that.data[key])
                {
                    (<Control>that.form.controls[key]).updateValue(data[key]);
                    that.data[key].updateValue(data[key]);
                }
            })
            that.params.updateField=true;
            Object.assign(this.dataSelect,data);
        }
        this.delete = _delete;
    }
    public getKeys(data){
        return Object.keys(data || {});
    }
    loadDate(data,key){
        if(typeof data == 'object')
            this.data[key].updateValue(data.date);
        else
            this.data[key].updateValue(data);

    }
    private _classCol(lg = 12, md = 12, sm = 12, xs = 12) {
        let _lg = lg == 0 ? 'hidden-lg' : 'col-lg-' + lg;
        let _md = md == 0 ? 'hidden-md' : 'col-md-' + md;
        let _sm = sm == 0 ? 'hidden-sm' : 'col-sm-' + sm;
        let _xs = xs == 0 ? 'hidden-xs' : 'col-xs-' + xs;

        return ' ' + _lg + ' ' + _md + ' ' + _sm + ' ' + _xs;
    }

    private _classOffset(lg = 0, md = 0, sm = 0, xs = 0) {
        return ' col-lg-offset-' + lg + ' col-md-offset-' + md + ' col-sm-offset-' + sm + ' col-xs-offset-' + xs;
    }
}

