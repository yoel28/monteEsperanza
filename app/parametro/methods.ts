import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';

@Component({
    selector: 'parametro-save',
    templateUrl: 'app/parametro/save.html',
    styleUrls: ['app/parametro/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class ParametroSave{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    key: Control;
    value: Control;
    type: Control;

    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.key = new Control("", Validators.compose([Validators.required]));
        this.value = new Control("", Validators.compose([Validators.required]));
        this.type = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            key: this.key,
            value: this.value,
            type: this.type,
        });
    }
    submitForm(){
        this.save.emit(this.form);
    }
}

