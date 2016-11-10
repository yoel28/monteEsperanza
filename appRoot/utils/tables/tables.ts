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
    inputs:['params','rules','rulesSearch','dataList','where'],
    outputs:['getInstance'],
    directives:[Xeditable,ColorPicker,Search,Save]
})


export class Tables extends RestController implements OnInit {


    public params:any={};
    public rules:any={};
    public rulesSearch:any={};
    public searchId:any={};
    data:any = [];
    public keys:any = [];
    form:ControlGroup;
    public dataDelete:any={};
    public dataSelect:any={};

    public dataSave :any={};

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
        Object.keys(this.rules).forEach((key)=>{
            if(that.rules[key].visible)
                data.push(key)
        });
        return data;
    }


    public searchTable:any = {};
    public searchTableData:any;

    loadSearchTable(event,key,data)
    {
        event.preventDefault();
        this.searchTable =  Object.assign({},this.rules[key].paramsSearch);
        this.searchTable.field =  key;
        this.searchTableData=data;
    }
    loadSaveModal(event,key,data){
        event.preventDefault();
        this.dataSave = Object.assign({},this.rules[key]);
        this.dataSelect = data;
    }
    loadUpdateModal(event,data){
        if(event)
            event.preventDefault();
        (<Save>this.myglobal.objectInstance[this.params.prefix+'_ADD']).setLoadDataModel(data);
    }
    
    getDataSearch(data){
        this.onPatch(this.searchTable.field,this.searchTableData,data.id);
    }
    getSaveObject(data){
        this.onPatch(this.dataSave.key,this.dataSelect,data.id);
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

        if( (eval(this.rules[key].disabled || 'true')))
        {
            let index = this.rules[key].source.findIndex(obj => (obj.value == data[key] || obj.id == data[key]));
            if(index > -1)
                return this.rules[key].source[index];
        }
        return field;

    }

    getDisabledField(key,data){
        return (eval(this.rules[key].disabled || 'false'));
    }
    






}
