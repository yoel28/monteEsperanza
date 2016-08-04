import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import forEach = require("core-js/fn/array/for-each");
import {SMDropdown} from "../../common/xeditable";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";

@Component({
    selector: 'filter',
    templateUrl: 'app/utils/filter/index.html',
    styleUrls: ['app/utils/filter/style.css'],
    directives:[SMDropdown],
    inputs: ['rules', 'params'],
    outputs: ['whereFilter'],
})
export class Filter extends RestController implements OnInit{

    //objeto con las reglas de modelo
    public rules:any = {};
    //parametro de salida
    public whereFilter:any;
    //Parametros para visualizar el modal
    public params:any = {
        title: "sin titulo",
        idModal: "nomodal",
        endpointForm: "sin endpoint",
        placeholderForm: "sin placeholder"
    };
    //objecto del search actual
    public search:any={};
    //lista de operadores condicionales
    public  cond = {
        'text': [
            {'id':'eq','text':'Igual que'},
            {'id':'ne','text':'Diferente que'},
            {'id':'%like%','text': 'Contiene'},
            {'id':'like%','text': 'Comienza con'},
            {'id':'%like','text': 'Termina en'},
            {'id':'%ilike%','text': 'Contiene(i)'},
            {'id':'ilike%','text': 'Comienza con(i)'},
            {'id':'%ilike','text': 'Termina en(i)'}
        ],
        'number':[
            {'id':'eq','text':'Igual que'},
            {'id':'ne','text':'Diferente que'},
            {'id':'ge','text':'Mayor Igual'},
            {'id':'gt','text':'Mayor que'},
            {'id':'le','text':'Menor Igual'},
            {'id':'lt','text':'Menor que'},
        ],
        'object':[
            {'id':'eq','text':'Igual que'},
            {'id':'ne','text':'Diferente que'},
        ],
        'date':[
            {'id':'eq','text':'Igual que'},
            {'id':'ne','text':'Diferente que'},
            {'id':'ge','text':'Mayor Igual'},
            {'id':'gt','text':'Mayor que'},
            {'id':'le','text':'Menor Igual'},
            {'id':'lt','text':'Menor que'},
        ],
        'email': [
            {'id':'eq','text':'Igual que'},
            {'id':'ne','text':'Diferente que'},
            {'id':'%like%','text': 'Contiene'},
            {'id':'like%','text': 'Comienza con'},
            {'id':'%like','text': 'Termina en'},
            {'id':'%ilike%','text': 'Contiene(i)'},
            {'id':'ilike%','text': 'Comienza con(i)'},
            {'id':'%ilike','text': 'Termina en(i)'}
        ],
        'select': [//TODO: hacer un select para este parametro
            {'id':'eq','text':'Igual que'},
            {'id':'ne','text':'Diferente que'},
        ],
    }
    //Lista de id search
    public searchId:any={};
    public findControl:string="";//variable en el value del search
    //formulario generado
    form:ControlGroup;
    data:any = [];
    keys:any = {};

    constructor(public _formBuilder:FormBuilder,public http: Http,public toastr: ToastsManager, public myglobal:globalService) {
        super(http,toastr);
        this.whereFilter = new EventEmitter();
    }
    ngOnInit() {
        this.loadForm();
    }
    loadForm() {
        let that = this;
        Object.keys(this.rules).forEach((key)=> {
            if (that.rules[key].search) {
                that.data[key] = [];
                that.data[key] = new Control("");

                that.data[key+'Cond'] = [];
                that.data[key+'Cond'] = new Control("eq");
                if(that.rules[key].object)
                {
                    that.data[key].valueChanges.subscribe((value: string) => {
                        if(value && value.length > 0){
                            that.search=that.rules[key];
                            that.findControl = value;
                            that.dataList=[];
                            that.setEndpoint(that.rules[key].paramsSearch.endpoint+value);
                            if( !that.searchId[key]){
                                that.loadData();
                            }
                            else if(that.searchId[key].detail != value){
                                that.loadData();
                                delete that.searchId[key];
                            }
                            else{
                                this.findControl="";
                                that.search = [];
                            }
                        }else{
                            that.findControl="";
                            if(that.searchId[key])
                                delete that.searchId[key];
                        }
                    });
                }
            }
        });
        this.form = this._formBuilder.group(this.data);
        this.keys = Object.keys(this.rules);
    }

    //Al hacer click en la lupa guarda los valores del objecto
    getLoadSearch(event,data){
        event.preventDefault();
        this.findControl="";
        this.search=data;
    }
    //accion al dar click en el boton de buscar del formulario en el search
    getSearch(event,value){
        event.preventDefault();
        this.setEndpoint(this.search.paramsSearch.endpoint+value);
        this.loadData();
    }
    //accion al dar click en el boton de cerrar el formulario
    searchQuit(event){
        event.preventDefault();
        this.search={};
        this.dataList={};
    }
    //accion al seleccion un parametro del search
    getDataSearch(data){
        this.searchId[this.search.key]={'id':data.id,'title':data.title,'detail':data.detail};
        (<Control>this.form.controls[this.search.key]).updateValue(data.detail);
        this.dataList=[];
    }
    
    // public search=
    //
    //     {
    //         title:"Vehiculo",
    //         idModal:"searchVehicle",
    //         endpointForm:"/search/vehicles/",
    //         placeholderForm:"Ingrese la placa del vehiculo",
    //         labelForm:{'name':"Placa: ",'detail':"Empresa: "},
    //         where:"&where="+encodeURI("[['op':'isNull','field':'tag.id']]")
    //     }
    
    
    submitForm(event) {
        event.preventDefault();
        let dataWhere="";
        let that=this
        Object.keys(this.rules).forEach( key=>{
            if(this.form.value[key] && this.form.value[key]!="")
            {
                let value="";
                let op="";

                value= that.form.value[key];
                op=that.form.value[key+'Cond']
                
                if(op.substr(0,1)=="%")
                {
                    op=op.substr(1);
                    value = "%"+value;
                }
                if(op.substr(-1)=="%")
                {
                    op=op.slice(0,-1);
                    value = value+"%";
                }
                
                if(that.rules[key].type !='number')
                    value = "'"+value+"'";
                
                if(that.rules[key].double)
                    value=value+"d";
                
                if(that.rules[key].object)
                {
                    value = this.searchId[key].id || null;
                    key = that.rules[key].paramsSearch.field;
                }

                dataWhere+="['op':'"+op+"','field':'"+key+"','value':"+value+"],";
            }

        });
        let where = encodeURI("["+dataWhere.slice(0,-1)+"]");
        dataWhere="&where="+where;

        this.whereFilter.emit(dataWhere);
    }
    //reset
    onReset(event) {
        event.preventDefault();
        this.keys.forEach(key=>{
            if(this.form.controls[key]){
                (<Control>this.form.controls[key]).updateValue("");
                (<Control>this.form.controls[key]).setErrors(null);

                (<Control>this.form.controls[key+'Cond']).updateValue("eq");
            }
        })
        this.whereFilter.emit("");
    }
    //guardar condicion en el formulario
    setCondicion(cond,id){
        (<Control>this.form.controls[id+'Cond']).updateValue(cond);
    }
    searchLength()
    {
        if(this.searchId)
            return Object.keys(this.searchId).length
        return 0;
    }
    searchIdKeys(){
        return Object.keys(this.searchId);
    }
}

