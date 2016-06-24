import {Component, EventEmitter, NgZone} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Http} from "@angular/http";
import {RestController} from "../common/restController";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';
import {ImageUpload, ImageResult, ResizeOptions} from 'ng2-imageupload';




@Component({
    selector: 'empresa-save',
    templateUrl: 'app/empresa/save.html',
    styleUrls: ['app/empresa/style.css'],
    directives: [SELECT_DIRECTIVES,ImageUpload],
    inputs:['idModal'],
    outputs:['save'],
})
export class EmpresaSave extends RestController{

    public idModal:string;
    public save:any;
    
    form: ControlGroup;
    name:Control;
    ruc:Control;
    responsiblePerson:Control;
    phone:Control;
    address:Control;
    image:Control;
    companyType:Control;

    public companyTypes:any=[];
    
    
    constructor(public http:Http,public _formBuilder: FormBuilder) {
        super(http);
        this.setEndpoint('/companies/');
        this.loadDataCompanyTypes();
        this.initForm();
        this.save = new EventEmitter();

        // this.uploadProgress = 0;
        // this.uploadResponse = {};
        // this.zone = new NgZone({ enableLongStackTrace: false });
    }
    
    initForm(){

        this.name = new Control("", Validators.compose([Validators.required]));
        this.ruc = new Control("", Validators.compose([Validators.required]));
        this.responsiblePerson = new Control("", Validators.compose([Validators.required]));
        this.phone = new Control("", Validators.compose([Validators.required]));
        this.address = new Control("", Validators.compose([Validators.required]));
        this.image = new Control("", Validators.compose([Validators.required]));
        this.companyType = new Control("", Validators.compose([Validators.required]));
        
        this.form = this._formBuilder.group({
            name: this.name,
            ruc: this.ruc,
            responsiblePerson: this.responsiblePerson,
            phone: this.phone,
            address: this.address,
            image: this.image,
            companyType: this.companyType,
        });
    }
    submitForm(){
        let successCallback= response => {
            this.save.emit(response.json());
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }

    //---------------------tipo de companias------------------------------------------------

    public items:any = [];
    loadDataCompanyTypes(){
        let successCallback= response => {
            Object.assign(this.companyTypes, response.json());
            this.companyTypes.list.forEach(obj=>{
                let icon = obj.icon?obj.icon:'fa fa-building-o';
                this.items.push({id:obj.id,text:"<i class='"+icon+"'></i> <strong>"+obj.title+"</strong> "+obj.detail});
            });
        };
        this.httputils.doGet('/search/type/companies/',successCallback,this.error);
    }
    public refreshValue(value:any):void {
        this.companyType.updateValue(value.id);
    }

    //----------imagen------------------------------------------------

    src: string = "";
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 100,
        resizeMaxWidth: 100
    };

    selected(imageResult: ImageResult) {
        this.src = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.image.updateValue(this.src);
    }

    // public URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
    // public uploader:FileUploader = new FileUploader({url: this.URL});
    // public hasBaseDropZoneOver:boolean = false;
    // public hasAnotherDropZoneOver:boolean = false;
    //
    // public fileOverBase(e:any):void {
    //     this.hasBaseDropZoneOver = e;
    // }
    //
    // public fileOverAnother(e:any):void {
    //     this.hasAnotherDropZoneOver = e;
    // }
    // uploadFile: any;
    // uploadProgress: number;
    // uploadResponse: Object;
    // zone: NgZone;
    // options: Object = {
    //     url: 'http://localhost:10050/upload'
    // };
    //
    //
    //
    // handleUpload(data): void {
    //     this.uploadFile = data;
    //     this.zone.run(() => {
    //         this.uploadProgress = data.progress.percent;
    //     });
    //     let resp = data.response;
    //     if (resp) {
    //         resp = JSON.parse(resp);
    //         this.uploadResponse = resp;
    //     }
    // }
}

