import {Component, EventEmitter, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import {SMDropdown, DateRangepPicker} from "../../common/xeditable";
import {RestController} from "../../common/restController";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../../common/globalService";
import {isNumeric} from "rxjs/util/isNumeric";

declare var SystemJS:any;
declare var jQuery:any;
@Component({
    selector: 'filter',
    templateUrl: SystemJS.map.app+'/utils/filter/index.html',
    styleUrls: [SystemJS.map.app+'/utils/filter/style.css'],
    directives:[SMDropdown,DateRangepPicker],
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
        endpoint: "sin endpoint",
        placeholder: "sin placeholder"
    };
    //objecto del search actual
    public search:any={};
    //lista de operadores condicionales
    public  cond = {
        'text': [
            {'id':'eq','text':'Igual que'},
            {'id':'isNull','text':'Nulo'},
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
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'ge','text':'Mayor Igual'},
            {'id':'gt','text':'Mayor que'},
            {'id':'le','text':'Menor Igual'},
            {'id':'lt','text':'Menor que'},
        ],
        'time':[
            {'id':'eq','text':'Igual que'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'ge','text':'Mayor Igual'},
            {'id':'gt','text':'Mayor que'},
            {'id':'le','text':'Menor Igual'},
            {'id':'lt','text':'Menor que'},
        ],
        'object':[
            {'id':'eq','text':'Igual que'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
        ],
        'boolean':[
            {'id':'eq','text':'Igual que'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
        ],
        'date':[
            {'id':'eq','text':'En rango'},
            {'id':'ne','text':'Fuera de rango'},
            {'id':'isNull','text':'Nulo'},
        ],
        'email': [
            {'id':'eq','text':'Igual que'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'%like%','text': 'Contiene'},
            {'id':'like%','text': 'Comienza con'},
            {'id':'%like','text': 'Termina en'},
            {'id':'%ilike%','text': 'Contiene(i)'},
            {'id':'ilike%','text': 'Comienza con(i)'},
            {'id':'%ilike','text': 'Termina en(i)'}
        ],
        'select': [
            {'id':'eq','text':'Igual que'},
            {'id':'ne','text':'Diferente que'},
            {'id':'isNull','text':'Nulo'},
        ],
        'textarea': [
            {'id':'eq','text':'Igual que'},
            {'id':'isNull','text':'Nulo'},
            {'id':'ne','text':'Diferente que'},
            {'id':'%like%','text': 'Contiene'},
            {'id':'like%','text': 'Comienza con'},
            {'id':'%like','text': 'Termina en'},
            {'id':'%ilike%','text': 'Contiene(i)'},
            {'id':'ilike%','text': 'Comienza con(i)'},
            {'id':'%ilike','text': 'Termina en(i)'}
        ],
    }
    //foormato de fecha
    public paramsDate={'format':"DD-MM-YYYY","minDate":"01-01-2016"};
    public date={};
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
                let condicion = "eq";
                if((that.rules[key].type == 'text' || that.rules[key].type == 'textarea') && !that.rules[key].object)
                    condicion = '%ilike%';
                that.data[key+'Cond'] = new Control(condicion);
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
    @ViewChild('find') find:ElementRef;

    getLoadSearch(data){

        this.findControl="";
        this.dataList={};
        this.max=5;
        this.search=data;
        this.getSearch();
        setTimeout(()=>{
            if(this.find && this.find.nativeElement)
             this.find.nativeElement.focus();
        },500);
    }
    //accion al dar click en el boton de buscar del formulario en el search
    getSearch(event?,value=''){
        if(event)
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
    //Cargar data
    assignDate(data,key){
        this.data[key].updateValue(data);
    }
    
    // public search=
    //
    //     {
    //         title:"Vehiculo",
    //         idModal:"searchVehicle",
    //         endpoint:"/search/vehicles/",
    //         placeholder:"Ingrese la placa del vehiculo",
    //         label:{'name':"Placa: ",'detail':"Empresa: "},
    //         where:"&where="+encodeURI("[['op':'isNull','field':'tag.id']]")
    //     }
    
    
    submitForm(event) {
        event.preventDefault();
        let dataWhere=[];
        let that=this;
        Object.keys(this.rules).forEach( key=>{
            if ((this.form.value[key] && this.form.value[key] != "") || that.form.value[key + 'Cond'] == 'isNull')
            {
                let whereTemp:any = {};//Fila de where para un solo elemento
                let whereTemp2:any;//Fila para codificiones multiples

                whereTemp.op = that.form.value[key + 'Cond'];//condicion
                whereTemp.field = that.rules[key].key || key;//columna

                if (that.rules[key].subType)//si existe un subtype lo agregamos
                {
                    whereTemp.type = that.rules[key].subType;
                }

                if (whereTemp.op != 'isNull')// si es diferente de nulo, carge el value
                {
                    whereTemp.value = that.form.value[key];//valor

                    if (whereTemp.op.substr(0, 1) == "%")//inicia con
                    {
                        whereTemp.op = whereTemp.op.substr(1);
                        whereTemp.value = "%" + whereTemp.value;
                    }

                    if (whereTemp.op.substr(-1) == "%")//termina en
                    {
                        whereTemp.op = whereTemp.op.slice(0, -1);
                        whereTemp.value = whereTemp.value + "%";
                    }

                    if ( (that.rules[key].type == 'number' || that.rules[key].type == 'time') && isNumeric(whereTemp.value))// tipo numerico...
                    {
                        whereTemp.value = parseFloat(whereTemp.value);
                        if (that.rules[key].double)
                        {
                            whereTemp.type = 'double';
                        }
                    }

                    if (that.rules[key].type == 'boolean' )
                    {
                        whereTemp.value = whereTemp.value == 'true';
                    }

                    if (that.rules[key].type == 'date')//si es tipo date..
                    {
                        whereTemp.type='date';

                        whereTemp2={};
                        if (this.data[key + 'Cond'].value == 'eq') // Si esta en rango..
                        {
                            whereTemp.value = that.form.value[key].start;
                            whereTemp.op = 'ge';

                            whereTemp2.value = that.form.value[key].end;
                            whereTemp2.op='le';

                            whereTemp2.field = whereTemp.field;
                            whereTemp2.type = whereTemp.type;

                        }
                        if (this.data[key + 'Cond'].value == 'ne')// para fechas fuera del rango
                        {
                            whereTemp2.or=[];

                            whereTemp.value = that.form.value[key].start;
                            whereTemp.op    =  'le';

                            whereTemp2.or.push(Object.assign({},whereTemp));

                            whereTemp.value = that.form.value[key].end;
                            whereTemp.op    =  'ge';

                            whereTemp2.or.push(Object.assign({},whereTemp));

                            whereTemp = Object.assign({},whereTemp2);

                            whereTemp2=null;
                        }

                    }

                    if (that.rules[key].object) // si es un objecto y existe el id
                    {
                        whereTemp.value=null;
                        if(that.searchId[key] && that.searchId[key].id)
                            whereTemp.value = that.searchId[key].id;
                    }
                }

                if (that.rules[key].object) // si es un objecto y existe el id
                {
                    whereTemp.field = that.rules[key].paramsSearch.field;
                }

                if(that.rules[key].join){
                    whereTemp=Object.assign({},{'join':that.rules[key].join,'where':[whereTemp]});
                    if(whereTemp2)
                        whereTemp2=Object.assign({},{'join':that.rules[key].join,'where':[whereTemp2]});
                }

                if(that.rules[key].whereparse){
                    if(whereTemp)
                        Object.assign(whereTemp,that.rules[key].whereparse(whereTemp));
                    if(whereTemp2)
                        Object.assign(whereTemp2,that.rules[key].whereparse(whereTemp2));

                }

                dataWhere.push(whereTemp);
                if(whereTemp2)
                {
                    dataWhere.push(whereTemp2);
                }
            }
        });
        let where = "&where="+encodeURI(JSON.stringify(dataWhere).split('{').join('[').split('}').join(']'));
        this.whereFilter.emit(where);
    }
    //reset
    onReset(event) {
        event.preventDefault();
        this.date={};
        this.searchId={};
        this.keys.forEach(key=>{
            if(this.form.controls[key]){
                (<Control>this.form.controls[key]).updateValue("");
                (<Control>this.form.controls[key]).setErrors(null);
            }
        })
        this.whereFilter.emit("");
    }
    //guardar condicion en el formulario
    setCondicion(cond,id){
        (<Control>this.form.controls[id+'Cond']).updateValue(cond);
    }
    searchLength() {
        if(this.searchId)
            return Object.keys(this.searchId).length
        return 0;
    }
    searchIdKeys(){
        return Object.keys(this.searchId);
    }
    setValueSelect(data,key){
        this.data[key].updateValue(data);
        if(data=='-1')
            this.data[key].updateValue(null);

    }

    private _classCol(lg = 12, md = 12, sm = 12, xs = 12) {
        let _lg = lg == 0 ? 'hidden-lg' : 'col-lg-' + lg;
        let _md = md == 0 ? 'hidden-md' : 'col-md-' + md;
        let _sm = sm == 0 ? 'hidden-sm' : 'col-sm-' + sm;
        let _xs = xs == 0 ? 'hidden-xs' : 'col-xs-' + xs;

        return ' ' + _lg + ' ' + _md + ' ' + _sm + ' ' + _xs;
    }

    private _classOffset(lg = 0, md = 0, sm = 0, xs = 0) {
        return ' col-lg-offset-' + lg + ' col-md-offset-' + md + ' col-sm-offset-' + sm + ' col-xs-offset-' + xs;
    }

}

