import {Component, OnInit,ViewChild} from '@angular/core';
import {Router}           from '@angular/router-deprecated';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {ModelBase} from "../../common/modelBase";
import {TranslateService, TranslatePipe} from "ng2-translate/ng2-translate";
import {Operacion} from "../operacion";
import {OperacionSave} from "../methods";
import moment from "moment/moment";


@Component({
    selector: 'operacion-pendiente',
    templateUrl: 'app/operacion/pendiente/index.html',
    styleUrls: ['app/operacion/pendiente/style.css'],
    providers: [TranslateService,Operacion],
    directives: [OperacionSave],
    pipes: [TranslatePipe]
})
export class OperacionPendiente extends ModelBase implements OnInit {

    public dataSelect:any = {};
    constructor(public router:Router, public http:Http, public toastr:ToastsManager, public myglobal:globalService, public translate:TranslateService,public operacion:Operacion) {
        super('OP', '/operations/', http, toastr, myglobal, translate);
    }
    ngOnInit(){
        this.operacion.initModel();
        
        this.initModel();
        this.setEndpoint('/pendings/');
        this.loadData();
        this.setEndpoint('/operations/');
    }

    initOptions() {
        this.viewOptions["title"] = 'Operaciones pendientes';
    }

    initRules() {
        this.rulesSave = this.operacion.rulesSave;
    }

    initSearch() {
    }

    initRuleObject() {
    }

    initFilter() {
    }

    initPermissions() {
    }

    goTaquilla(event, companyId:string) {
        event.preventDefault();
        let link = ['TaquillaSearh', {search: companyId}];
        this.router.navigate(link);
    }
    @ViewChild(OperacionSave)
    operacionSave:OperacionSave;

    dataOperation:any={};
    cargarData(event,data){
        event.preventDefault();
        this.dataOperation=data;
        if(this.operacionSave) {
            this.operacionSave.pendients=true;
            this.operacionSave.inAntena(data);
        }
    }
    formatDate(date, format) {
        if (date)
            return moment(date).format(format);
        return "-";
    }
    liberar(data) {
        this.httputils.onDelete('/pendings/' + this.dataOperation.id, this.dataOperation.id, this.dataList.list, this.error);
    }
}
