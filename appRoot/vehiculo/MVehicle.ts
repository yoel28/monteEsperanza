import {globalService} from "../common/globalService";
import {ModelBase} from "../common/modelBase";
import {MCompany} from "../empresa/MCompany";
import {MDrivers} from "../drivers/MDrivers";
import {MTypeVehicle} from "../tipoVehiculo/MTypeVehicle";
import {Save} from "../utils/save/save";

export class MVehicle extends ModelBase{
    public rules={};

    public vehicleType:any;
    public company:any;
    public driver:any;

    constructor(public myglobal:globalService){
        super('VEH','/vehicles/',myglobal);
        this.initModel();
    }
    modelExternal() {
        this.vehicleType = new MTypeVehicle(this.myglobal);
        this.company = new MCompany(this.myglobal);
        this.driver = new MDrivers(this.myglobal);
    }
    initRules(){
        this.rules['tags'] = {
            'type': 'list',
            'maxLength': '35',
            'prefix':'TAG',
            'value':[],
            'update': this.permissions.update,
            'search': this.permissions.filter,
            'visible': this.permissions.visible,
            'key': 'tags',
            'title': 'Tag',
            'refreshField':{
                'icon':'fa-refresh',
                'endpoint':'/antennas/read',
                'tagFree':this.permissions.tagFree || true, // TODO: quitar true
                'instance':null,//tipo list van a mantener la instancia para poder manipular el objecto
                'callback':function (rule,newData) {
                    if(newData && newData.forEach){
                        newData.forEach(ant=> {
                            if(ant.tags){
                                ant.tags.forEach(tag => {

                                    if(tag.plate){
                                        rule.refreshField.instance.addValue({
                                            'id': -2,
                                            'value': tag.epc,
                                            'title': ant.way + '(' + (ant.reference) + ') Asignado al vehiculo '+tag.plate
                                        });
                                    }
                                    else {
                                        rule.refreshField.instance.addValue({
                                            'id': ant.id,
                                            'value': tag.epc,
                                            'title': ant.way + '(' + (ant.reference) + ')'
                                        });
                                    }
                                })
                            }
                        });
                    }
                    if(newData.error)
                        this.myglobal.toastr.error(newData.error,'Notificación');
                }.bind(this),
            },
            'placeholder': 'Tags',
        };

        this.rules['image']={
            'type': 'image',
            'update':this.permissions.update,
            'visible':this.permissions.visible,
            'key': 'image',
            'title': 'Imagen',
            'placeholder': 'Imagen',
        };

        this.rules['plate']={
            'type': 'text',
            'callBack':function(save:Save,value:string){
                let where = "?where="+encodeURI('[["op":"eq","field":"plate","value":"'+value+'"]]');
                let successCallback =(response)=>{
                    save.keyFindData = '';
                    let data = response.json();
                    if(data.count == 1){
                        data = data.list[0];
                        save.id = data.id;
                        save.params.updateField=true;
                        Object.assign(save.dataSelect,data);

                        save.data['weight'].updateValue(data.weight);

                        data['tags'].forEach(tag=>{
                            save.rules['tags'].refreshField.instance.addValue(
                                {
                                    'id': -1,
                                    'value': tag.number,
                                    'title': 'Tag Asignado'
                                }
                            );
                        });


                        save.search = {'key':'vehicleType'};
                        save.getDataSearch({id:data.vehicleTypeId,title:data.vehicleTypeTitle,detail:data.vehicleTypeDetail});
                        save.search = {'key':'company'};
                        save.getDataSearch({id:data.companyId,title:data.companyName,detail:data.companyRuc});
                        save.search = {'key':'chofer'};
                        save.getDataSearch({id:data.choferId,title:data.choferPhone,detail:data.choferNombre});



                    }
                };
                if(save.id){
                    save.resetForm();
                    save.data['plate'].updateValue(value);
                }
                else
                {
                    save.keyFindData = 'plate';
                    save.httputils.doGet('/vehicles/'+where,successCallback,save.error);
                }

            },
            'icon':'fa fa-font',
            'required':true,
            'maxLength':'35',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'plate',
            'title': 'Placa',
            'placeholder': 'Placa del vehículo',
        };

        this.rules['weight']={
            'type': 'number',
            'step':'0.0001',
            "double":true,
            'icon':'fa fa-font',
            'update':this.permissions.update,
            'search':this.permissions.filter,
            'visible':this.permissions.visible,
            'key': 'weight',
            'title': 'Peso Tara',
            'placeholder': 'Peso Tara del vehículo',
        };

        this.rules['vehicleType'] = this.vehicleType.ruleObject;
        this.rules['vehicleType'].update=this.permissions.update;

        this.rules['company']=this.company.ruleObject;
        this.rules['company'].update=this.permissions.update;

        this.rules['chofer']=this.driver.ruleObject;
        this.rules['chofer'].update=this.permissions.update;
        this.rules['chofer'].required=false;

        this.rules = Object.assign({},this.rules,this.getRulesDefault())
    }
    initPermissions() {
        this.permissions['tagFree'] =  this.myglobal.existsPermission(this.prefix+'_TAG_FREE');
    }
    initParamsSearch() {
        this.paramsSearch.title="Buscar vehículo";
        this.paramsSearch.placeholder="Ingrese vehículo";
        this.paramsSearch.label.title="Cliente: ";
        this.paramsSearch.label.detail="Placa: ";
    }
    initParamsSave() {
        this.paramsSave.title="Agregar vehículo"
    }
    initRuleObject() {
        this.ruleObject.title="Vehículo";
        this.ruleObject.placeholder="Ingrese vehículo";
        this.ruleObject.key="vehicle";
        this.ruleObject.code="vehicleId";
    }
    initRulesSave() {
        this.rulesSave = Object.assign({},this.rules);


        delete this.rules['tags'];
        delete this.rulesSave.enabled;
        delete this.rulesSave.image;
    }

}
