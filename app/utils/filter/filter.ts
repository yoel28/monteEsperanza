import {Component, EventEmitter} from '@angular/core';
import {FormBuilder, ControlGroup, Control, Validators} from "@angular/common";
import forEach = require("core-js/fn/array/for-each");
import {SMDropdown} from "../../common/xeditable";

@Component({
    selector: 'filter',
    templateUrl: 'app/utils/filter/index.html',
    styleUrls: ['app/utils/filter/style.css'],
    directives:[SMDropdown],
    inputs: ['rules', 'params'],
    outputs: ['where'],
})
export class Filter {

    public rules:any = {};
    public params:any = {
        title: "",
        idModal: "",
        endpointForm: "",
        placeholderForm: ""
    };

    public where:any;
    form:ControlGroup;
    data:any = [];
    keys:any = {};

    constructor(public _formBuilder:FormBuilder) {
        this.where = new EventEmitter();
    }

    ngOnInit() {
        this.loadForm();
    }

    loadForm() {
        Object.keys(this.rules).forEach((key)=> {
            if (this.rules[key].search) {
                this.data[key] = [];
                this.data[key] = new Control("");

                this.data[key+'Cond'] = [];
                this.data[key+'Cond'] = new Control("eq");
                //(<Control>this.form.controls[key+'Cond']).updateValue('eg');
            }
        });
        this.form = this._formBuilder.group(this.data);
        this.keys = Object.keys(this.rules);
    }

    submitForm(data) {
        let dataWhere="";
        Object.keys(this.rules).forEach( key=>{
            if(data.value[key] && data.value[key]!="")
                dataWhere+="['op':'"+data.value[key+'Cond']+"'," +
                    "'field':'"+key+"'," +
                    "'value':'"+data.value[key]+"'],";
        });

        this.where="&where=["+dataWhere.slice(0,-1)+"]";

        this.where.emit(this.form);
    }
    setCondicion(cond,id){
        (<Control>this.form.controls[id+'Cond']).updateValue(cond);
    }
    public  cond = {
            'text': [
                {'id':'eq','text':'Igual que'},
                {'id':'ne','text':'Diferente que'},
                {'id':'%like%','text': 'Contiene'},
                {'id':'%like','text': 'Comienza con'},
                {'id':'like%','text': 'Termina en'},
                {'id':'%ilike%','text': 'Contiene(i)'},
                {'id':'%ilike','text': 'Comienza con(i)'},
                {'id':'ilike%','text': 'Termina en(i)'}
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
                {'id':'%like','text': 'Comienza con'},
                {'id':'like%','text': 'Termina en'},
                {'id':'%ilike%','text': 'Contiene(i)'},
                {'id':'%ilike','text': 'Comienza con(i)'},
                {'id':'ilike%','text': 'Termina en(i)'}
            ],
        }
}

