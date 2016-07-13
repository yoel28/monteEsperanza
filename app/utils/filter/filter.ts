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

                if(that.form.value[key+'Cond'].substr(-1)=="%" && that.form.value[key+'Cond'].substr(0,1)=="%"){
                    op=that.form.value[key+'Cond'].substr(1,that.form.value[key+'Cond'].length -2)
                    value = "%"+value+"%";
                }
                else if(that.form.value[key+'Cond'].substr(0,1)=="%")
                {
                    op=that.form.value[key+'Cond'].substr(1)
                    value = "%"+value;
                }
                else if(that.form.value[key+'Cond'].substr(-1)=="%")
                {
                    op=that.form.value[key+'Cond'].slice(0,-1);
                    value = value+"%";
                }
                else
                    op=that.form.value[key+'Cond']

                if(that.rules[key].type !='number')
                    value = "'"+value+"'";
                if(that.rules[key].double)
                    value=value+"d";

                dataWhere+="['op':'"+op+"','field':'"+key+"','value':"+value+"],";
            }

        });
        let where = encodeURI("["+dataWhere.slice(0,-1)+"]");
        dataWhere="&where="+where;

        this.where.emit(dataWhere);
    }
    setCondicion(cond,id){
        (<Control>this.form.controls[id+'Cond']).updateValue(cond);
    }
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
}

