import {Component, OnInit} from '@angular/core';
import {Router, RouteParams}           from '@angular/router-deprecated';
import { Http} from '@angular/http';
import {Search} from "../utils/search/search"
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {Xeditable, Xfile, Xcropit} from "../common/xeditable";
import {globalService} from "../common/globalService";
import {Filter} from "../utils/filter/filter";
import {Tooltip} from "../utils/tooltips/tooltips";
import {Save} from "../utils/save/save";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Tables} from "../utils/tables/tables";
import {ControllerBase} from "../common/ControllerBase";
import {MVehicle} from "./MVehicle";
import {MDrivers} from "../drivers/MDrivers";
import {MTypeVehicle} from "../tipoVehiculo/MTypeVehicle";
import {MCompany} from "../empresa/MCompany";
import {MTag} from "../tagRfid/MTag";
declare var jQuery:any;
declare var SystemJS:any;

@Component({
    selector: 'vehiculo',
    templateUrl: SystemJS.map.app+'/vehiculo/index.html',
    styleUrls: [SystemJS.map.app+'/vehiculo/style.css'],
    directives: [Search,Xeditable,Xcropit,Xfile,Filter,Tooltip,Save,Tables,Tooltip],
    providers: [TranslateService],
    pipes: [TranslatePipe]
})
export class Vehiculo extends ControllerBase implements OnInit{

    public typeView=1;

    public dataSelect:any = {};

    public vehicle:any;
    public driver:any;
    public typeVehicle:any;
    public company:any;
    public tag:any;

    constructor(public params:RouteParams,public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService) {
        super('VEH', '/vehicles/',router, http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.initModel();
        this.initViewOptions();

        if(this.params.get('companyId'))
            this.where="&where="+encodeURI('[["op":"eq","field":"company.id","value":'+this.params.get('companyId')+']]');
        this.loadPage();
    }
    initModel() {
        this.model = new MVehicle(this.myglobal);

        this.vehicle = new MVehicle(this.myglobal);
        this.driver = new MDrivers(this.myglobal);
        this.typeVehicle = new MTypeVehicle(this.myglobal);
        this.company = new MCompany(this.myglobal);
        this.tag = new MTag(this.myglobal);
        this.tag.paramsSearch.where="&where="+encodeURI("[['op':'isNull','field':'vehicle.id'],['op':'isNull','field':'container.id']]");

    }
    initViewOptions() {
        this.viewOptions["title"] = 'Vehículos';
        this.viewOptions["buttons"] = [];
        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.add,
            'title': 'Agregar',
            'class': 'btn btn-green',
            'icon': 'fa fa-save',
            'modal': this.model.paramsSave.idModal
        });

        this.viewOptions["buttons"].push({
            'visible': this.model.permissions.filter && this.model.permissions.list,
            'title': 'Filtrar',
            'class': 'btn btn-blue',
            'icon': 'fa fa-filter',
            'modal': this.model.paramsSearch.idModal
        });
    }

    syncTag(value, data){
        data.tagRFID = null;
        data.tagId = null;
        if(value.vehiclePlate == data.plate){
            data.tagRFID = value.number;
            data.tagId = value.id;
        }
    }
    public releaseTag(tag:any,data,index){
        let callback = (response,value)=>{
            data['tags'].splice(index,1);
        };
        this.tag.setDataField(tag.id,'vehicle',null,callback,data)
    }

    //cambiar imagen
    public image:any=[];
    changeImage(data,id){
        if(this.image[id]==null)
            this.image[id]=[];
        this.image[id]=data;
    }
    loadImage(event,data){
        event.preventDefault();
        this.onPatch('image',data,this.image[data.id]);
    }
}