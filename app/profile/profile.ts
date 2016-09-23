import {Component, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {Search} from "../utils/search/search";
import {EmpresaSave} from "../empresa/methods";
import {Xeditable, Xcropit, Xfile} from "../common/xeditable";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
declare var SystemJS:any;

@Component({
    selector: 'profile',
    templateUrl: SystemJS.map.app+'/profile/index.html',
    styleUrls: [SystemJS.map.app+'/profile/style.css'],
    directives: [Xeditable,Xcropit,Search,EmpresaSave,Xfile],
})
export class Profile extends RestController implements OnInit{
    public userSelect:string;
    constructor(public router: Router,public http: Http,public myglobal:globalService,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/users/');
    }
    ngOnInit(){

    }
    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'id' },
        'username':{'type':'text','display':null,'title':'Nombre de usuario' },
        'name':{'type':'text','display':null,'title':'nombre' },
        'email':{'type':'email','display':null,'title':'Correo' },
        'password':{'type':'password','display':null,'title':'Contrasena','showbuttons':true },
        'phone':{'type':'number','display':null,'title':'Telefono' },
    }
    
    goTaquilla(companyRuc:string)
    {
        let link = ['TaquillaSearh', {search:companyRuc}];
        this.router.navigate(link);
    }
    public image:string;
    changeImage(data){
        this.image=data;
    }
    loadImage(){
        this.onPatch('image',this.myglobal.user,this.image);
    }
    public searchEmpresa = {
        title: "Empresa",
        idModal: "searchEmpresa",
        endpointForm: "/search/companies/",
        placeholderForm: "Ingrese el RUC de la empresa",
        labelForm: {name: "Nombre: ", detail: "RUC: "},
    }
    assignCompany(data) {
        this.onPatch('company', this.myglobal.user, data.id);
    }

}
