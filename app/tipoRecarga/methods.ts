import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';

@Component({
    selector: 'tipoRecarga-save',
    templateUrl: 'app/tipoRecarga/save.html',
    styleUrls: ['app/tipoRecarga/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class TipoRecargaSave{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    title: Control;
    detail: Control;
    icon: Control;

    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.title = new Control("", Validators.compose([Validators.required]));
        this.detail = new Control("", Validators.compose([Validators.required]));
        this.icon = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            title: this.title,
            icon: this.icon,
            detail: this.detail,
        });
    }
    submitForm(){
        this.save.emit(this.form);
    }
}

