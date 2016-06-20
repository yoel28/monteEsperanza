import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';

@Component({
    selector: 'tipoEmpresa-save',
    templateUrl: 'app/tipoEmpresa/save.html',
    styleUrls: ['app/tipoEmpresa/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class TipoEmpresaSave{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    title: Control;
    icon: Control;


    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){

        this.title = new Control("", Validators.compose([Validators.required]));
        this.icon = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            title: this.title,
            icon: this.icon,
        });

    }
    submitForm(){
        this.save.emit(this.form);
    }
}
