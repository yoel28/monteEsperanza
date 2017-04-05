import {Component, OnInit} from '@angular/core';
import {globalService} from "../../common/globalService";
declare var SystemJS:any;


export interface IGaleriaData{
    title?:string;
    id:string,
    server?:string;
    images:{ folder:string, created:string }[];
    selectFolder?:string
    selectImage?:string

}
@Component({
    selector: 'modalGaleriac',
    templateUrl: SystemJS.map.app+'/operacion/galeria/index.html',
    styleUrls: [SystemJS.map.app+'/operacion/galeria/style.css'],
    inputs:['data']
})
export class galeriaComponent implements OnInit {

    public data:IGaleriaData;
    constructor(public myglobal:globalService){
    }

    public listImage=[1,2,3,4,5,6,7,8,9];

    openFolder(folder){
        this.data.selectFolder = folder;
    }
    ngOnInit(){

    }
    get server(){
        return this.data?this.data.server:'';
    }

}