import {Component, EventEmitter, OnInit,ViewChild} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {Xeditable, ColorPicker} from "../../common/xeditable";
import {Search} from "../search/search";
import {Save} from "../save/save";

declare var SystemJS:any;
declare var moment:any;
@Component({
    selector: 'tables',
    templateUrl: SystemJS.map.app+'/utils/tables/index.html',
    styleUrls: [SystemJS.map.app+'/utils/tables/style.css'],
    inputs:['params','model','dataList','where'],
    outputs:['getInstance'],
    directives:[Xeditable,ColorPicker,Search,Save]
})


export class Tables extends RestController implements OnInit {


    public params:any={};
    public model:any={};
    public searchId:any={};
    data:any = [];
    public keys:any = [];
    form:ControlGroup;
    public dataDelete:any={};
    public dataSelect:any={};

    public dataReference :any={};//cargar data a referencias en otros metodos

    public keyActions =[];
    public configId=moment().valueOf();

    public getInstance:any;


    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
    }

    ngOnInit()
    {
        this.keyActions=Object.keys(this.params.actions);
        this.getInstance = new EventEmitter();
        this.setEndpoint(this.params.endpoint);
    }
    ngAfterViewInit() {
        this.getInstance.emit(this);
    }
    
    keyVisible()
    {
        let data=[];
        let that=this;
        Object.keys(this.model.rules).forEach((key)=>{
            if(that.model.rules[key].visible)
                data.push(key)
        });
        return data;
    }


    public searchTable:any = {};
    public searchTableData:any;

    loadSearchTable(event,key,data)
    {
        event.preventDefault();
        this.searchTable =  Object.assign({},this.model.rules[key].paramsSearch);
        this.searchTable.field =  key;
        this.searchTableData=data;
    }
    getDataSearch(data){
        this.onPatch(this.searchTable.field,this.searchTableData,data.id);
    }
    actionPermissionKey() 
    {
        let data=[];
        let that=this;

        Object.keys(this.params.actions).forEach((key)=>
        {
            if( that.myglobal.existsPermission(that.params.actions[key].permission) )
                data.push(key);
        });

        return data;
    }

    getKeys(data)
    {
        return Object.keys(data);
    }

    getBooleandData(key,data){
        let field = {'class':'btn btn-orange','text':'n/a','disabled':true};

        if( (eval(this.model.rules[key].disabled || 'true')))
        {
            let index = this.model.rules[key].source.findIndex(obj => (obj.value == data[key] || obj.id == data[key]));
            if(index > -1)
                return this.model.rules[key].source[index];
        }
        return field;

    }

    getDisabledField(key,data){
        return (eval(this.model.rules[key].disabled || 'false'));
    }

    public setDataFieldReference(model,data,setNull=false,callback)
    {
        let value=null;
        let that = this;

        if(!setNull)//no colocar valor nulo
        {
            value=this.dataSelect.id;
            if(that.dataSelect[model.ruleObject.code]!=null && model.rules[this.model.ruleObject.key].unique)
                model.setDataField(that.dataSelect[model.ruleObject.code],this.model.ruleObject.key,null,callback,that.dataSelect).then(
                    response=>{
                        model.setDataField(data.id,that.model.ruleObject.key,value,callback,that.dataSelect);
                    });
            else
                model.setDataField(data.id,that.model.ruleObject.key,value,callback,that.dataSelect);
        }
        else
            model.setDataField(data[model.ruleObject.code],that.model.ruleObject.key,null,callback,data);

    }






}
