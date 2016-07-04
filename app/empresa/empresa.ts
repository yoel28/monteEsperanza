import {Component, ViewChild, ElementRef} from '@angular/core';
import {Router, RouteParams}           from '@angular/router-deprecated';
import { Http } from '@angular/http';
import {RestController} from "../common/restController";
import {EmpresaSave} from "./methods";
import {TipoEmpresaSave} from "../tipoEmpresa/methods";
import {Search} from "../utils/search/search";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {RecargaTimeLine} from "../recarga/methods";
import {Xeditable} from "../common/xeditable";

@Component({
    selector: 'empresa',
    templateUrl: 'app/empresa/index.html',
    styleUrls: ['app/empresa/style.css'],
    directives:[EmpresaSave,TipoEmpresaSave,Search,Xeditable]
})
export class Empresa extends RestController{
    
    constructor(public router: Router,public http: Http,public toastr: ToastsManager) {
        super(http,toastr);
        this.setEndpoint('/companies/');
    }
    ngOnInit(){
        this.validTokens();
        this.max = 9;
        this.loadData();
    }
    public rules={
        'id': {'type':'text','disabled':true,'display':false,'title':'' },
        'name':{'type':'text','display':null,'title':'Nombre de la empresa','mode':'inline'},
        'ruc':{'type':'text','display':null,'title':'Ruc de la empresa','mode':'inline' },
        'responsiblePerson':{'type':'text','display':null,'title':'Persona Responsable','mode':'inline'},
        'phone':{'type':'number','display':null,'title':'Telefono','mode':'inline'},
        'address':{'type':'text','display':null,'title':'Direccion','mode':'inline'},
    };

    public dataSelect:string;

    public searchTipoEmpresa={
        title:"Tipo Empresa",
        idModal:"searchTipoEmpresa",
        endpointForm:"/search/type/companies/",
        placeholderForm:"Ingrese el tipo empresa",
        labelForm:{name:"Nombre: ",detail:"Detalle: "},
    }
    
    validTokens(){
        if(!localStorage.getItem('bearer'))
        {
            let link = ['AccountLogin', {}];
            this.router.navigate(link);
        }
    }

    assignTipoEmpresa(data){
        let index = this.dataList.list.findIndex(obj => obj.id == this.dataSelect);
        this.onPatch('companyType',this.dataList.list[index],data.id);
    }

    assignEmpresa(data){
        this.dataList.list.unshift(data);
        this.dataList.list.pop();
    }

    goTaquilla(companyRuc:string) {
        let link = ['TaquillaSearh', {search:companyRuc}];
        this.router.navigate(link);
    }

    goTimeLine(companyRuc:string) {
        let link = ['EmpresaTimeLine', {ruc:companyRuc}];
        this.router.navigate(link);
    }

}

@Component({
    selector: 'empresa-timeline',
    templateUrl: 'app/empresa/timeLine.html',
    styleUrls: ['app/empresa/style.css'],
    directives :[RecargaTimeLine]
})
export class EmpresaTimeLine extends RestController{
    public paramsTimeLine={
        'offset':0,
        'max':8,
        'ruc':''
    };
    constructor(params:RouteParams,public router: Router,http: Http) {
        super(http);
        this.paramsTimeLine.ruc = params.get('ruc');
    }

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            console.log ("bottom wii");
        } catch(err) { }
    }
    ngAfterViewChecked() {
        this.scrollToBottom();
    }
}