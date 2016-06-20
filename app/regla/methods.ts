import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';

@Component({
    selector: 'regla-save',
    templateUrl: 'app/regla/save.html',
    styleUrls: ['app/regla/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class ReglaSave{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    rule: Control;
    name: Control;


    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.rule = new Control("", Validators.compose([Validators.required]));
        this.name = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            rule: this.rule,
            name: this.name,
        });
    }
    submitForm(){
        this.save.emit(this.form);
    }
}

