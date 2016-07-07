import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {UserSave} from "./methods";
import {Search} from "../utils/search/search";
import {Filter} from "../utils/filter/filter";
import {EmpresaSave} from "../empresa/methods";
import {Xeditable} from "../common/xeditable";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Divide} from "../utils/pipe";

@Component({
    selector: 'user',
    pipes : [Divide],
    templateUrl: 'app/user/index.html',
    styleUrls: ['app/user/style.css'],
    directives: [UserSave,Search,EmpresaSave,Xeditable,Filter],
})
export class User extends RestController{
    
    public userSelect:string;
    
    constructor(public router: Router,public http: Http,public myglobal:globalService,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/users/');
    }
    ngOnInit(){
        this.validTokens();
        this.max=6;
        this.loadData();
        this.loadRoles();
    }
    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'id','placeholder':'Identificador','search':true},
        'username':{'type':'text','display':null,'title':'Nombre de usuario','placeholder':'Usuario','search':true},
        'name':{'type':'text','display':null,'title':'nombre','placeholder':'Nombre de usuario','search':true},
        'companie':{'type':'object','display':null,'title':'nombre','placeholder':'Nombre de compañia','search':true},
        'email':{'type':'email','display':null,'title':'Correo','placeholder':'Correo','search':true},
        'password':{'type':'password','display':null,'title':'Contrasena','placeholder':'Contrasena','search':false},
        'phone':{'type':'number','display':null,'title':'Telefono','placeholder':'Telefono','search':true},
        'roles':{'type':'object','display':null,'title':'Rol','mode':'popup','showbuttons':true,'placeholder':'Roles','search':false,
            'source': []
        },
    }
    public params:any={
        title:"Buscar Usuarios",
        idModal:"modalFilterUser",
        endpointForm:"",
    };

    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }
    goTaquilla(companyRuc:string)
    {
        let link = ['TaquillaSearh', {search:companyRuc}];
        this.router.navigate(link);
    }
    goTimeLine(companyRuc:string)
    {
        let link = ['EmpresaTimeLine', {ruc:companyRuc}];
        this.router.navigate(link);
    }


    public searchEmpresa={
        title:"Empresa",
        idModal:"searchEmpresa",
        endpointForm:"/search/companies/",
        placeholderForm:"Ingrese el RUC de la empresa",
        labelForm:{name:"Nombre: ",detail:"RUC: "},
    }

    assignCompany(data){
        let index = this.dataList.list.findIndex(obj => obj.id == this.userSelect);
        this.onPatch('company',this.dataList.list[index],data.id);
    }
    assignUser(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }

    //Cargar Roles
    public dataRoles:any=[];
    loadRoles(){
        let that = this;
        let successCallback= response => {
            Object.assign(that.dataRoles, response.json());
            that.dataRoles.list.forEach(obj=>{
                that.rules.roles.source.push({'value':obj.id,'text':obj.authority});
            });
        };
        this.httputils.doGet('/roles/',successCallback,this.error)
    }
    //Cargar Where del filter
    loadWhere(data){
        let dataWhere="["
        Object.keys(data.values).forEach( key=>{
              if(data.values[key]!="")
                  data
                  
        })
    }
}