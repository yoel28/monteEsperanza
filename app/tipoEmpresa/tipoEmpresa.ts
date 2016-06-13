import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import { contentHeaders } from '../common/headers';

//--------------------------LOGIN-------------------------------
@Component({
    selector: 'tipoEmpresa',
    templateUrl: 'app/tipoEmpresa/tipoEmpresa.html',
    styleUrls: ['app/tipoEmpresa/tipoEmpresa.css']
})
export class TipoEmpresa {
    tipoEmpresa:any;

    constructor(private router: Router,public http: Http) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.getTipoEmpresas();
    }
    getTipoEmpresas(){
        event.preventDefault();
        this.http.get(localStorage.getItem('urlAPI')+'/tipo/empresas',{headers:contentHeaders})
            .subscribe(
                response => {
                    this.tipoEmpresa=response.json();
                },
                error =>{

                }
            );
    }
    onSave(event,icon,title){
        event.preventDefault();
        let body = JSON.stringify({icon,title});
        this.http.post(localStorage.getItem('urlAPI')+'/tipo/empresas', body, { headers: contentHeaders })
            .subscribe(
                response => {

                },
                error => {
                    alert(error.text());
                    console.log(error.text());
                }
            );
    }
    onUpdate(event,data){
        event.preventDefault();
        if(data[event.target.id]!=event.target.innerHTML){

            data[event.target.id] = event.target.innerHTML;

            let body = JSON.stringify(data)
            this.http.put(localStorage.getItem('urlAPI')+'/tipo/empresas/'+data['id'], body, { headers: contentHeaders })
                .subscribe(
                    response => {

                    },
                    error => {
                        alert(error.text());
                        console.log(error.text());
                    }
                );
        }

    }
    onDelete(event,id){
        event.preventDefault();
        this.http.delete(localStorage.getItem('urlAPI')+"/tipo/empresas/"+id,{headers: contentHeaders})
            .subscribe(
                response => {

                },
                error =>{

                }
            );
    }

}