import {Component, EventEmitter, OnInit,ViewChild} from "@angular/core";
import {FormBuilder, Validators, Control, ControlGroup} from "@angular/common";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {Xeditable} from "../../common/xeditable";
import {Search} from "../search/search";
import {Filter} from "../filter/filter";
import {Save} from "../save/save";

declare var SystemJS:any;
declare var moment:any;
@Component({
    selector: 'tables',
    templateUrl: SystemJS.map.app+'/utils/tables/index.html',
    styleUrls: [SystemJS.map.app+'/utils/tables/style.css'],
    inputs:['params','rules','rulesSearch','dataList','externalSave'],
    directives:[Xeditable,Search,Filter,Save]
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
    public  externalSave:any={};

    public dataSave :any={};

    public keyActions =[];
    public configId=moment().valueOf();


    constructor(public _formBuilder: FormBuilder,public http:Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
    }

    ngOnInit()
    {
        this.keyActions=Object.keys(this.params.actions);
        this.setEndpoint(this.params.endpoint);
    }
    
    keyVisible(){
        let data=[];
        let that=this;
        Object.keys(this.rules).forEach((key)=>{
            if(that.rules[key].visible)
                data.push(key)
        });
        return data;
    }


    public searchTable:any = {}
    public searchTableData:any = {}


    //click en la lupa
    @ViewChild(Search)
    search:Search;
    loadSearchTable(key,data) {


        this.searchTable=this.rulesSearch[key];

        if(this.search)
        {
            this.search.params=this.searchTable;
        }

        this.searchTableData=data;

    }

    //click en la mas
    @ViewChild(Save)
    save:Save;
    loadSaveTable(column,data) {


        this.dataSave.data=data;
        this.dataSave.column=column;
        this.dataSave.params =this.externalSave[column].paramsSave;
        this.dataSave.rules =this.externalSave[column].rulesSave;

        if(this.save)
        {
            //this.search.setNewModal();
            this.save.params = this.externalSave[column].paramsSave;
            this.save.rules = this.externalSave[column].rulesSave;
        }


//        this.searchTableData=data;

    }
    
    asignData(data){
        this.onPatch(this.dataSave.column,this.dataSave.data,data.id);
    }
    
    getDataSearch(data){
        this.onPatch(this.searchTable.field,this.searchTableData,data.id);
    }

    actionPermissionKey() {
        let data=[];
        let that=this;

        Object.keys(this.params.actions).forEach((key)=>
        {
            if( that.myglobal.existsPermission(that.params.actions[key].permission) )
                data.push(key);
        });

        return data;

    }

    getKeys(data){
        return Object.keys(data);
    }
    






}
