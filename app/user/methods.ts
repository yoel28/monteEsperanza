import { Component,EventEmitter } from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {ResizeOptions, ImageUpload, ImageResult} from "ng2-imageupload/index";

@Component({
    selector: 'user-save',
    templateUrl: 'app/user/save.html',
    styleUrls: ['app/user/style.css'],
    inputs:['idModal'],
    outputs:['save'],
    directives:[ImageUpload]
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
    image: Control;


    constructor(public _formBuilder: FormBuilder) {
        this.initForm();
        this.save = new EventEmitter();
    }
    initForm(){

        this.username = new Control("", Validators.compose([Validators.required,Validators.maxLength(10)]));
        this.name = new Control("", Validators.compose([Validators.required]));
        this.email = new Control("", Validators.compose([Validators.required]));
        this.password = new Control("", Validators.compose([Validators.required]));
        this.phone = new Control("", Validators.compose([Validators.required]));
        this.image = new Control("", Validators.compose([Validators.required]));

        this.form = this._formBuilder.group({
            username: this.username,
            name: this.name,
            email: this.email,
            password: this.password,
            phone: this.phone,
            image: this.image,
        });

    }
    submitForm(){
        this.save.emit(this.form);
    }
    //----------imagen------------------------------------------------
    src: string = "";
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 60,
        resizeMaxWidth: 60
    };

    selected(imageResult: ImageResult) {
        this.src = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.image.updateValue(this.src);
    }
}
