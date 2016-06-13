import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import { contentHeaders } from '../common/headers';

//--------------------------LOGIN-------------------------------
@Component({
    selector: 'empresa',
    templateUrl: 'app/empresa/empresa.html',
    styleUrls: ['app/empresa/empresa.css']
})
export class Empresa {
    empresa:any;

    constructor(private router: Router,public http: Http) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.getEmpresas()
    }
    getEmpresas(){
        event.preventDefault();
        this.http.get(localStorage.getItem('urlAPI')+'/empresas',{headers:contentHeaders})
            .subscribe(
                response => {
                    this.empresa=response.json();
                },
                error =>{

                }
            );
    }

}