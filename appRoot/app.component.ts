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
import {CustomRouterOutlet} from "./common/CustomRouterOutlet";
import {Help} from "./help/help";
import {Events} from "./event/event";


declare var SockJS:any;
declare var Stomp:any;
declare var SystemJS:any;

@Component({
  selector: 'my-app',
  templateUrl: SystemJS.map.app+'/app.html',
  styleUrls:[SystemJS.map.app+'/app.css'],
  directives: [ROUTER_DIRECTIVES,OperacionSave,CustomRouterOutlet],
  providers: [
    ROUTER_PROVIDERS,Operacion,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
  ]
})
@RouteConfig([
  { path: '/account/login',  name: 'AccountLogin',  component: AccountLogin, useAsDefault: true },
  { path: '/account/active/:id/:token',  name: 'AccountActivate',  component: AccountActivate },
  { path: '/account/recover',  name: 'AccountRecover',  component: AccountRecover },
  { path: '/account/recoverPassword/:id/:token',  name: 'AccountRecoverPassword',  component: AccountRecoverPassword },

  { path: '/users',   name: 'User', component: User },
  { path: '/dashboard',   name: 'Dashboard', component: Dashboard },
  { path: '/taquilla',   name: 'Taquilla', component: Taquilla },
  { path: '/vehiculos',   name: 'Vehiculo', component: Vehiculo },
  { path: '/vehiculos/:companyId',   name: 'VehiculoCompany', component: Vehiculo },
  { path: '/taquilla/:search',   name: 'TaquillaSearh', component: Taquilla },

  { path: '/cliente',   name: 'Empresa', component: Empresa },
  { path: '/cliente/morosos',   name: 'EmpresaMorosos', component: EmpresaMorosos },
  { path: '/perfil',   name: 'Profile', component: Profile },
  { path: '/cliente/:ruc',   name: 'EmpresaTimeLine', component: EmpresaTimeLine },

  { path: '/operacion',   name: 'Operacion', component: Operacion },
  { path: '/operacion/pendiente',   name: 'OperacionPendiente', component: OperacionPendiente },
  { path: '/operacion/monitor',   name: 'OperacionMonitor', component: OperacionMonitor },
  { path: '/roles',   name: 'Rol', component: Rol },
  { path: '/factura',   name: 'RecargaIngresos', component: RecargaIngresos },
  { path: '/caja',   name: 'Caja', component: Caja },

  { path: '/reporte/grupos',   name: 'ReporteGrupos', component: ReporteGrupos },
  { path: '/reporte/grupos/rutas',   name: 'GruposRutas', component: GruposRutas },
  { path: '/reporte/toneladas',   name: 'ReporteDescargasGrupos', component: ReporteDescargasGrupos },
  { path: '/reporte/vehiculos',   name: 'ReporteGruposVehiculos', component: ReporteGruposVehiculos },
  { path: '/reporte/rutas',   name: 'ReporteDescargasRutas', component: ReporteDescargasRutas },
  { path: '/reporte/basura',   name: 'ReporteDescargasBasura', component: ReporteDescargasBasura },

  { path: '/permisos',   name: 'Permiso', component: Permiso },
  { path: '/permisos/rol',   name: 'PermisoRol', component: PermisosRol },
  { path: '/parametro',   name: 'Parametro', component: Parametro },
  { path: '/regla',   name: 'Regla', component: Regla },
  { path: '/recargas',   name: 'Recarga', component: Recarga },
  { path: '/libro',   name: 'RecargaLibro', component: RecargaLibro },
  { path: '/tipoRecarga',   name: 'TipoRecarga', component: TipoRecarga },
  { path: '/tipoBasura',   name: 'TipoBasura', component: TipoBasura },
  { path: '/tipo/servicio',   name: 'TipoServicio', component: TipoServicio },
  { path: '/servicio',   name: 'Servicio', component: Servicio },
  { path: '/grupo',   name: 'TipoEmpresa', component: TipoEmpresa },
  { path: '/tipoVehiculo',   name: 'TipoVehiculo', component: TipoVehiculo },
  { path: '/tagRfid',   name: 'TagRfid', component: TagRfid },
  { path: '/antenas',   name: 'Antenna', component: Antenna },
  { path: '/rutas',   name: 'Ruta', component: Ruta },
  { path: '/ayuda',   name: 'Help', component: Help },
  { path: '/eventos',   name: 'Event', component: Events },
  { path: '/**', redirectTo: ['Dashboard'] }

])
export class AppComponent extends RestController implements OnInit{
  public saveUrl:string;
    public rulesOperacion={};

  constructor(public router: Router,http: Http,public myglobal:globalService,public toastr: ToastsManager,public operacion:Operacion) {
      super(http)
      let url="https://dev.aguaseo.com:8080";

      localStorage.setItem('urlAPI',url+'/api');
      localStorage.setItem('url',url);

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
        if(this.operacionSave)
        {
            this.operacionSave.loadInAnt();
        }
    }
    outAnt(event,data?){
        event.preventDefault();
        if(this.operacionSave)
        {
            this.operacionSave.loadOutAnt(null,data);
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
