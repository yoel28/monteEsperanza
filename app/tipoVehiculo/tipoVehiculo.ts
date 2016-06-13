import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import { contentHeaders } from '../common/headers';

//--------------------------LOGIN-------------------------------
@Component({
    selector: 'tipoVehiculo',
    templateUrl: 'app/tipoVehiculo/tipoVehiculo.html',
    styleUrls: ['app/tipoVehiculo/tipoVehiculo.css']
})
export class TipoVehiculo {
    tipoVehiculo:any;

    constructor(private router: Router,public http: Http) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
        this.getTipoVehiculos();
    }
    getTipoVehiculos(){
        event.preventDefault();
        this.http.get(localStorage.getItem('urlAPI')+'/tipo/vehiculos',{headers:contentHeaders})
            .subscribe(
                response => {
                    this.tipoVehiculo=response.json();
                },
                error =>{

                }
            );
    }
    onSave(event,detail,title){
        event.preventDefault();
        let body = JSON.stringify({detail,title});
        this.http.post(localStorage.getItem('urlAPI')+'/tipo/vehiculos', body, { headers: contentHeaders })
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
            this.http.put(localStorage.getItem('urlAPI')+'/tipo/vehiculos/'+data['id'], body, { headers: contentHeaders })
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
        this.http.delete(localStorage.getItem('urlAPI')+"/tipo/vehiculos/"+id,{headers: contentHeaders})
            .subscribe(
                response => {

                },
                error =>{

                }
            );
    }

}