import {Component, provide, ViewChild, OnInit} from '@angular/core';
import { Router,RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { contentHeaders } from './common/headers';
import { AccountLogin }         from './account/account';
import { AccountRecover }         from './account/account';
import { AccountActivate }         from './account/account';
import { AccountRecoverPassword }         from './account/account';

import { Empresa }         from './empresa/empresa';
import { EmpresaTimeLine }         from './empresa/empresa';
import { TipoEmpresa }         from './tipoEmpresa/tipoEmpresa';
import { TipoVehiculo }         from './tipoVehiculo/tipoVehiculo';
import { Dashboard }         from './dashboard/dashboard';
import { User }         from './user/user';
import { Taquilla }         from './taquilla/taquilla';
import {Operacion, OperacionMonitor}         from './operacion/operacion';
import { Profile }         from './profile/profile';
import { Rol }         from './rol/rol';
import { Parametro }         from './parametro/parametro';
import { Regla }         from './regla/regla';
import { TipoRecarga }         from './tipoRecarga/tipoRecarga';
import {Recarga, RecargaLibro}         from './recarga/recarga';
import { RecargaIngresos }         from './recarga/recarga';
import { TagRfid }         from './tagRfid/tagRfid';
import { Vehiculo }         from './vehiculo/vehiculo';
import { Permiso }         from './permiso/permiso';
import { PermisosRol }         from './permiso/permiso';
import {globalService} from "./common/globalService";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {TipoBasura} from "./tipoBasura/tipoBasura";
import {Antenna} from "./antena/antenna";
import {Ruta} from "./ruta/ruta";
import {RestController} from "./common/restController";
import {Http} from "@angular/http";
import {ReporteGrupos} from "./reportes/reportes";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {OperacionSave} from "./operacion/methods";
import {ReporteDescargasGrupos} from "./reportes/reporteDG";
import moment from "moment/moment";
import {ReporteGruposVehiculos} from "./reportes/reporteGV";
import {ReporteDescargasRutas} from "./reportes/reporteDR";
import {ReporteDescargasBasura} from "./reportes/reporteDB";
import {GruposRutas} from "./reportes/gruposRutas";
import {EmpresaMorosos} from "./empresa/companyMorosos";
import {Caja} from "./recarga/caja";
import {TipoServicio} from "./tipoServicio/tipoServicio";
import {Servicio} from "./servicio/servicio";
import {OperacionPendiente} from "./operacion/pendiente/pendiente";

declare var SockJS:any;
declare var Stomp:any;
let  version='/V04';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.html',
  styleUrls:['app/app.css'],
  directives: [ROUTER_DIRECTIVES,OperacionSave],
  providers: [
    ROUTER_PROVIDERS,Operacion,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
  ]
})
@RouteConfig([
  { path: version+'/account/login',  name: 'AccountLogin',  component: AccountLogin, useAsDefault: true },
  { path: version+'/account/active/:id/:token',  name: 'AccountActivate',  component: AccountActivate },
  { path: version+'/account/recover',  name: 'AccountRecover',  component: AccountRecover },
  { path: version+'/account/recoverPassword/:id/:token',  name: 'AccountRecoverPassword',  component: AccountRecoverPassword },

  { path: version+'/users',   name: 'User', component: User },
  { path: version+'/dashboard',   name: 'Dashboard', component: Dashboard },
  { path: version+'/taquilla',   name: 'Taquilla', component: Taquilla },
  { path: version+'/vehiculos',   name: 'Vehiculo', component: Vehiculo },
  { path: version+'/vehiculos/:companyId',   name: 'VehiculoCompany', component: Vehiculo },
  { path: version+'/taquilla/:search',   name: 'TaquillaSearh', component: Taquilla },

  { path: version+'/cliente',   name: 'Empresa', component: Empresa },
  { path: version+'/cliente/morosos',   name: 'EmpresaMorosos', component: EmpresaMorosos },
  { path: version+'/perfil',   name: 'Profile', component: Profile },
  { path: version+'/cliente/:ruc',   name: 'EmpresaTimeLine', component: EmpresaTimeLine },

  { path: version+'/operacion',   name: 'Operacion', component: Operacion },
  { path: version+'/operacion/pendiente',   name: 'OperacionPendiente', component: OperacionPendiente },
  { path: version+'/operacion/monitor',   name: 'OperacionMonitor', component: OperacionMonitor },
  { path: version+'/roles',   name: 'Rol', component: Rol },
  { path: version+'/factura',   name: 'RecargaIngresos', component: RecargaIngresos },
  { path: version+'/caja',   name: 'Caja', component: Caja },

  { path: version+'/reporte/grupos',   name: 'ReporteGrupos', component: ReporteGrupos },
  { path: version+'/reporte/grupos/rutas',   name: 'GruposRutas', component: GruposRutas },
  { path: version+'/reporte/toneladas',   name: 'ReporteDescargasGrupos', component: ReporteDescargasGrupos },
  { path: version+'/reporte/vehiculos',   name: 'ReporteGruposVehiculos', component: ReporteGruposVehiculos },
  { path: version+'/reporte/rutas',   name: 'ReporteDescargasRutas', component: ReporteDescargasRutas },
  { path: version+'/reporte/basura',   name: 'ReporteDescargasBasura', component: ReporteDescargasBasura },

  { path: version+'/permisos',   name: 'Permiso', component: Permiso },
  { path: version+'/permisos/rol',   name: 'PermisoRol', component: PermisosRol },
  { path: version+'/parametro',   name: 'Parametro', component: Parametro },
  { path: version+'/regla',   name: 'Regla', component: Regla },
  { path: version+'/recargas',   name: 'Recarga', component: Recarga },
  { path: version+'/libro',   name: 'RecargaLibro', component: RecargaLibro },
  { path: version+'/tipoRecarga',   name: 'TipoRecarga', component: TipoRecarga },
  { path: version+'/tipoBasura',   name: 'TipoBasura', component: TipoBasura },
  { path: version+'/tipo/servicio',   name: 'TipoServicio', component: TipoServicio },
  { path: version+'/servicio',   name: 'Servicio', component: Servicio },
  { path: version+'/grupo',   name: 'TipoEmpresa', component: TipoEmpresa },
  { path: version+'/tipoVehiculo',   name: 'TipoVehiculo', component: TipoVehiculo },
  { path: version+'/tagRfid',   name: 'TagRfid', component: TagRfid },
  { path: version+'/antenas',   name: 'Antenna', component: Antenna },
  { path: version+'/rutas',   name: 'Ruta', component: Ruta },
  { path: '/**', redirectTo: ['Dashboard'] }

])
export class AppComponent extends RestController implements OnInit{
  public saveUrl:string;
    public rulesOperacion={};

  constructor(public router: Router,http: Http,public myglobal:globalService,public toastr: ToastsManager,public operacion:Operacion) {
      super(http)
    //TODO:Cambiar URL a PRODUCCION
    //localStorage.setItem('urlAPI','http://vertedero.aguaseo.com:8080/api');
    //localStorage.setItem('url','http://vertedero.aguaseo.com:8080');
      
    localStorage.setItem('urlAPI','http://dev.aguaseo.com:8080/api');
    localStorage.setItem('url','http://dev.aguaseo.com:8080');

    //localStorage.setItem('urlAPI','http://192.168.0.114:8080/api');
    //localStorage.setItem('url','http://192.168.0.114:8080');
    //localStorage.setItem('ws','ws//192.168.0.91:8080');
    let that=this;
    router.subscribe(
        function(data){
          if(that.isPublic() && !localStorage.getItem('bearer')){
            that.myglobal.init=true;
          }
          else if(that.isPublic() && localStorage.getItem('bearer'))
          {
              let link = ['Dashboard', {}];
              that.router.navigate(link);
          }
          else if(!that.isPublic() && !localStorage.getItem('bearer'))
          {
              that.saveUrl = that.router.currentInstruction.component.routeName;
              let link = ['AccountLogin', {}];
              that.router.navigate(link);
          }
          else if(that.saveUrl)
          {
              let link = [that.saveUrl, {}];
              that.saveUrl = null;
              that.router.navigate(link);

          }

           if(that.myglobal.getParams('VERSION_CACHE')!=localStorage.getItem('VERSION_CACHE') && (that.myglobal.init && localStorage.getItem('bearer')))
           {
               localStorage.setItem('VERSION_CACHE',that.myglobal.getParams('VERSION_CACHE'))
               location.reload(true);
           }

        },function(error){
          console.log("entro2");
        }
    );//this.onSocket();
  }
    ngOnInit(){
        this.operacion.initModel();
        this.rulesOperacion = this.operacion.rulesSave;
    }

  public urlPublic=['AccountLogin','AccountActivate','AccountRecover','AccountRecoverPassword'];
  public isPublic(){
    let data = this.router.currentInstruction.component.routeName;
    let index = this.urlPublic.findIndex(obj=>obj == data);
    if(index>-1)
        return true;
    return false;
  }

  logout(event) {
    event.preventDefault();
      let that = this;
      let successCallback= response => {
          this.myglobal.init=false;
          localStorage.removeItem('bearer');
          contentHeaders.delete('Authorization');

          let link = ['AccountLogin', {}];
          this.router.navigate(link);
      }
      this.httputils.doPost('/logout',null,successCallback,this.error);

  }
  profile(event) {
    event.preventDefault();
    let link = ['Profile', {}];
    this.router.navigate(link);

  }
  validToken(){
    if(localStorage.getItem('bearer'))
        return true;
    return false;
  }
    loadPermisos(event){
        event.preventDefault();
        this.myglobal.loadMyPermissions();
    }
    activeMenuId:string;
    activeMenu(event,id){
        event.preventDefault();
        if(this.activeMenuId==id)
            this.activeMenuId="";
        else
            this.activeMenuId=id;

    }
    onSocket(){
        let ws = new SockJS(localStorage.getItem("url")+"/stomp");
        let client = Stomp.over(ws);
        let that=this;

        client.connect({}, function() {
            client.subscribe("/topic/read", function(message) {
                let str = JSON.parse(message.body);
                if(str['entrada']){
                    that.toastr.success('Placa: '+str['entrada'].vehiclePlate,'Vehículo Entrando');
                }
            });
        });


    }
    @ViewChild(OperacionSave)
    operacionSave:OperacionSave;

    dataOperation:any={};
    inAnt(event){
        event.preventDefault();
        let that= this;
        let successCallback= response => {
            that.dataOperation=response.json();
            if(that.operacionSave)
            {
                that.operacionSave.inAntena(that.dataOperation['entrada']);
            }

        }
        this.httputils.doGet('/in/operations',successCallback,this.error);
    }
    outAnt(event,data?){
        event.preventDefault();
        let that= this;
        if(!data){
            let successCallback= response => {
                that.dataOperation=response.json();
                if(that.operacionSave)
                {
                    that.operacionSave.outAntena(that.dataOperation['salida'] || {});
                }
            }
            this.httputils.doGet('/out/operations',successCallback,this.error);
        }
        else{
            that.dataOperation.operations=[];
            that.dataOperation.operations.push(data);
            if(that.operacionSave)
            {
                that.operacionSave.outAntena(that.dataOperation || {});
            }
        }

    }

    public monitor:any={};
    public monitorInterval:any;
    public enableMonitor:boolean=false;
    loadMonitor(){
        let that= this;
        if(!that.enableMonitor && localStorage.getItem('bearer'))
        {
            that.where="&where="+encodeURI("[['op':'isNull','field':'weightOut']]");
            that.max=10;
            that.monitorInterval=setInterval(()=>{
                if(localStorage.getItem('bearer'))
                {
                    that.onloadData('/operations/',that.monitor)
                }
                else{
                    clearInterval(that.monitorInterval);
                }
            }, 10000)
        }
        that.enableMonitor=true;
    }
    formatDate(date,format){
        if(date)
            return moment(date).format(format);
        return "";
    }


}
