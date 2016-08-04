import {Component, ViewChild, OnInit} from '@angular/core';
import { Router }           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {TagSave} from "./methods";
import {Search} from "../utils/search/search";
import {globalService} from "../common/globalService";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Filter} from "../utils/filter/filter";
import {Xeditable} from "../common/xeditable";


@Component({
    selector: 'tagRfid',
    templateUrl: 'app/tagRfid/index.html',
    styleUrls: ['app/tagRfid/style.css'],
    directives:[TagSave,Search,Filter,Xeditable],
})
export class TagRfid extends RestController implements OnInit{
    @ViewChild(Search)
    modal:Search;
    public dataSelect:any={};

    constructor(public router: Router,public http: Http, public toastr:ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.setEndpoint('/rfids/');
    }
    public rules = {
        'number': {
            'type': 'text',
            'display': null,
            'title': 'Número del Tag',
            'placeholder': 'Número del Tag',
            'mode': 'inline',
            'search': true
        },
    }

    ngOnInit() {
        if (this.myglobal.existsPermission('120')) {
            this.max = 10;
            this.loadData();
        }
    }
    assignTag(data){
        this.dataList.list.unshift(data);
        if(this.dataList.page.length > 1)
            this.dataList.list.pop();
    }

    //Cargar Where del filter
    public paramsFilter:any = {
        title: "Filtrar Tag",
        idModal: "modalFilter",
        endpointForm: "",
    };
    loadWhere(where) {
        this.where = where;
        if (this.myglobal.existsPermission('120'))
            this.loadData();
    }

    //Buscar vehiculos sin tag ---------------------------------------------
    public searchVehicle={
        title:"Vehiculo",
        idModal:"searchVehicle",
        endpointForm:"/search/vehicles/",
        placeholderForm:"Ingrese la placa del vehiculo",
        labelForm:{'name':"Placa: ",'detail':"Empresa: "},
        where:"&where="+encodeURI("[['op':'isNull','field':'tag.id']]")
    }
    //asignar tag a vehiculo
    assignVehicle(data){
        let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect.id);
        this.onPatch('vehicle',this.dataList.list[index],data.id);
        this.modal.dataList=[];
    }
    //liberar tag
    releaseTag(data){
        let successCallback= response => {
            this.toastr.success('Tag RFID liberado','Notificación')
            Object.assign(data,response.json())
        };
        let body = JSON.stringify({'vehicle':null})
        this.httputils.doPut(this.endpoint+data.id,body,successCallback,this.error)
    }

}