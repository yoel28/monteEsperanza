import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';

@Component({
    selector: 'operacion-save',
    templateUrl: 'app/operacion/save.html',
    styleUrls: ['app/operacion/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class OperacionSave{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    recharge: Control;
    vehicle: Control;
    weightIn: Control;
    weightOut: Control;

    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.recharge = new Control("", Validators.compose([Validators.required]));
        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.weightIn = new Control("", Validators.compose([Validators.required]));
        this.weightOut = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            recharge: this.recharge,
            vehicle: this.vehicle,
            weightIn: this.weightIn,
            weightOut: this.weightOut,
        });
    }
    submitForm(){
        this.save.emit(this.form);
    }
}
