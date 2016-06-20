import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';

@Component({
    selector: 'tag-save',
    templateUrl: 'app/tagRfid/save.html',
    styleUrls: ['app/tagRfid/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class TagSave{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    vehicle: Control;
    number: Control;


    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){
        this.vehicle = new Control("", Validators.compose([Validators.required]));
        this.number = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            vehicle: this.vehicle,
            number: this.number,
        });
    }
    submitForm(){
        this.save.emit(this.form);
    }
}
