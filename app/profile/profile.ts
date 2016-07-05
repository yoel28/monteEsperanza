import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {RestController} from "../common/restController";
import {globalService} from "../common/globalService";
import {Search} from "../utils/search/search";
import {EmpresaSave} from "../empresa/methods";
import {Xeditable} from "../common/xeditable";
import {ToastsManager} from "ng2-toastr/ng2-toastr";

@Component({
    selector: 'profile',
    templateUrl: 'app/profile/index.html',
    styleUrls: ['app/profile/style.css'],
    directives: [Xeditable],
})
export class Profile extends RestController{
    
    constructor(public router: Router,public http: Http,public myglobal:globalService,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/users/');
    }
    ngOnInit(){
        this.validTokens();
    }
    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'id' },
        'username':{'type':'text','display':null,'title':'Nombre de usuario' },
        'name':{'type':'text','display':null,'title':'nombre' },
        'email':{'type':'email','display':null,'title':'Correo' },
        'password':{'type':'password','display':null,'title':'Contrasena' },
        'phone':{'type':'number','display':null,'title':'Telefono' },
    }

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
    
}
