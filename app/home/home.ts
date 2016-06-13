import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http, Headers } from '@angular/http';
import { contentHeaders } from '../common/headers';

@Component({
    selector: 'home',
    templateUrl: 'app/home/home.html',
    styleUrls: ['app/home/home.css']
})
export class Home {

    constructor(private router: Router,public http: Http) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['Login', {}];
            this.router.navigate(link);
        }
    }
    perfil(){
        let link = ['User', {}];
        this.router.navigate(link);
    }

}


