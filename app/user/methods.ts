import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';

@Component({
    selector: 'user-save',
    templateUrl: 'app/user/save.html',
    styleUrls: ['app/user/style.css'],
    inputs:['idModal'],
    outputs:['save'],
})
export class UserSave{

    public idModal:string;
    public save:any;

    form: ControlGroup;
    username: Control;
    name: Control;
    email: Control;
    password: Control;
    phone: Control;


    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){

        this.username = new Control("", Validators.compose([Validators.required]));
        this.name = new Control("", Validators.compose([Validators.required]));
        this.email = new Control("", Validators.compose([Validators.required]));
        this.password = new Control("", Validators.compose([Validators.required]));
        this.phone = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            username: this.username,
            name: this.name,
            email: this.email,
            password: this.password,
            phone: this.phone,
        });

    }
    submitForm(){
        this.save.emit(this.form);
    }
}
