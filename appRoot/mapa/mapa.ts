import {Component, OnInit} from "@angular/core";
import {globalService} from "../common/globalService";



declare var SystemJS:any;
declare var jQuery:any;
@Component({
    selector: 'mapa',
    templateUrl:SystemJS.map.app+'/mapa/index.html',
    styleUrls: [SystemJS.map.app+'/mapa/style.css'],
    inputs:['params']


})
export class MapaComponents implements OnInit{
    public params:Object;
    constructor(public myglobal:globalService) {

    }
    ngOnInit(){


    }
    get url(){
        return "https://maps.googleapis.com/maps/api/staticmap?" +
            "center=" + this.params['lat'] + "," + this.params['lng'] +
            "&zoom=16&scale=false&size=600x300&maptype=roadmap&" +
            "format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C" + this.params['lat'] + "," + this.params['lng']
    }
}