import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';

@Component({
    selector: 'empresa-save',
    templateUrl: 'app/empresa/save.html',
    styleUrls: ['app/empresa/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class EmpresaSave{

    public idModal:string;
    public save:any;

    form: ControlGroup;


    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){


    }
    submitForm(){
        this.save.emit(this.form);
    }
}

