import { Component } from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {HttpUtils} from "../common/http-utils";
import { CHART_DIRECTIVES } from 'angular2-highcharts';


@Component({
    selector: 'home',
    directives: [CHART_DIRECTIVES],
    templateUrl: 'app/dashboard/dashboard.html',
    styleUrls: ['app/dashboard/dashboard.css']
})
export class Dashboard {
    dataCamion:any = [];
    httputils:HttpUtils;
    endpoint:string;

    constructor(public router: Router,http: Http) {
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            router.navigate(link);
        }
        this.endpoint="/users/";
        this.httputils = new HttpUtils(http);


        this.options = {
            title : { text : 'angular2-highcharts example' },
            series: [{
                name: 's1',
                data: [2,3,5,8,13],
                allowPointSelect: true
            },{
                name: 's2',
                data: [-2,-3,-5,-8,-13],
                allowPointSelect: true
            }]
        };

    }

    error=function(err){
        console.log(err);
    }
    goTaquilla(){
        let link = ['Taquilla', {}];
        this.router.navigate(link);
    }

    options: Object;
    chart: Object;

    saveChart(chart) {
        this.chart = chart;
    }
    addPoint() {
        //this.chart.series[0].addPoint(Math.random() * 10);
        //this.chart.series[1].addPoint(Math.random() * -10);
    }
    onPointSelect(point) {
        alert(`${point.y} is selected`);
    }
    onSeriesHide(series) {
        alert(`${series.name} is selected`);
    }
}


