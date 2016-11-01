import {Component, EventEmitter, OnInit} from '@angular/core';
import  {FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {RestController} from "../common/restController";
import {Http} from "@angular/http";
import {SELECT_DIRECTIVES} from 'ng2-select/ng2-select';
import {Search} from "../utils/search/search";
import {Xfile,Xcropit} from "../common/xeditable";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {globalService} from "../common/globalService";

declare var SystemJS:any;
@Component({
    selector: 'vehiculo-save',
    templateUrl: SystemJS.map.app+'/vehiculo/save.html',
    styleUrls: [SystemJS.map.app+'/vehiculo/styleVehiculo.css'],
    inputs:['idModal'],
    outputs:['save'],
    directives:[SELECT_DIRECTIVES,Search,Xfile,Xcropit]

})
export class VehiculoSave extends RestController implements OnInit{

    public idModal:string;
    public save:any;

    form: ControlGroup;

    plate: Control;
    weight: Control;
    vehicleType: Control;
    company: Control;
    chofer: Control;
    image: Control;


    dataCompany:string;
    dataChofer:string;

    constructor(public http:Http,public _formBuilder: FormBuilder,public toastr: ToastsManager, public myglobal:globalService) {
        super(http);
        this.save = new EventEmitter();
        this.setEndpoint('/vehicles/');
    }
    ngOnInit(){
        this.initForm();
        if(this.myglobal.existsPermission('32'))
            this.loadDataVehicleTypes();
    }
    initForm(){

        this.plate = new Control("", Validators.compose([Validators.required]));
        this.weight = new Control("", Validators.compose([Validators.required]));
        this.vehicleType = new Control("", Validators.compose([Validators.required]));
        this.company = new Control("", Validators.compose([Validators.required]));
        this.chofer = new Control("", Validators.compose([Validators.required]));
        this.image = new Control("");

        this.form = this._formBuilder.group({
            plate: this.plate,
            weight: this.weight,
            vehicleType: this.vehicleType,
            company: this.company,
            chofer:this.chofer,
            image: this.image,
        });

    }
    submitForm(){
        let that = this;
        let successCallback= response => {
            that.resetForm();
            that.save.emit(response.json());
            that.toastr.success('Guardado con éxito','Notificación')
        };
        let body = JSON.stringify(this.form.value);
        this.httputils.doPost(this.endpoint,body,successCallback,this.error);
    }
    resetForm(){
        let that=this;
        Object.keys(this).forEach(key=>{
            if(that[key] instanceof Control){
                that[key].updateValue(null);
                that[key].setErrors(null);
                that[key]._pristine=true;
            }
        })
    }

    //cargar data tipo de vehiculos
    public items:any = [];
    public vehicleTypes:any=[];
    //rfids?where[['op':'isNull','field':'vehicle']]

    loadDataVehicleTypes(){
        let successCallback= response => {
            Object.assign(this.vehicleTypes, response.json());
            this.vehicleTypes.list.forEach(obj=>{
                let icon = obj.icon?obj.icon:'fa fa-building-o';
                this.items.push({id:obj.id,text:"<i class='"+icon+"'></i> <strong>"+obj.title+"</strong> "+obj.detail});
            });
        };
        this.httputils.doGet('/search/type/vehicles/',successCallback,this.error);
    }
    public refreshValue(value:any):void {
        this.vehicleType.updateValue(value.id);
    }

    //cargar data de empresas disponibles.
    public searchEmpresa={
        title:"Empresa",
        idModal:"searchEmpresa",
        endpoint:"/search/companies/",
        placeholder:"Ingrese el RUC de la empresa",
        label:{name:"Nombre: ",detail:"RUC: "},
    }
    assignCompany(data){
        this.company.updateValue(data.id);
        this.dataCompany=data.title+", RUC: "+data.detail;
    }
    //formulario de imagen
    changeImage(data){
        this.image.updateValue(data);
    }


    //carga data de Chofer disponible ------------------------------------------
    public searchDrivers={
        title:"Chofer",
        idModal:"searchDrivers",
        endpoint:"/search/drivers/",
        placeholder:"Ingrese Chofer",
        label:{nombre:"Nombre: "},
    }
    assignChofer(data){
        this.chofer.updateValue(data.id)
        this.dataChofer=data.title + ", Teléfono: " + data.detail;
    }
    
}

