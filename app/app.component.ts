import {Component, provide} from '@angular/core';
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
import { Operacion }         from './operacion/operacion';
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

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.html',
  styleUrls:['app/app.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
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

  { path: '/empresas',   name: 'Empresa', component: Empresa },
  { path: '/perfil',   name: 'Profile', component: Profile },
  { path: '/empresas/:ruc',   name: 'EmpresaTimeLine', component: EmpresaTimeLine },

  { path: '/operacion',   name: 'Operacion', component: Operacion },
  { path: '/roles',   name: 'Rol', component: Rol },
  { path: '/factura',   name: 'RecargaIngresos', component: RecargaIngresos },

  { path: '/permisos',   name: 'Permiso', component: Permiso },
  { path: '/permisos/rol',   name: 'PermisoRol', component: PermisosRol },
  { path: '/parametro',   name: 'Parametro', component: Parametro },
  { path: '/regla',   name: 'Regla', component: Regla },
  { path: '/recargas',   name: 'Recarga', component: Recarga },
  { path: '/libro',   name: 'RecargaLibro', component: RecargaLibro },
  { path: '/tipoRecarga',   name: 'TipoRecarga', component: TipoRecarga },
  { path: '/tipoBasura',   name: 'TipoBasura', component: TipoBasura },
  { path: '/tipoEmpresa',   name: 'TipoEmpresa', component: TipoEmpresa },
  { path: '/tipoVehiculo',   name: 'TipoVehiculo', component: TipoVehiculo },
  { path: '/tagRfid',   name: 'TagRfid', component: TagRfid },
  { path: '/antenas',   name: 'Antenna', component: Antenna },
  { path: '/rutas',   name: 'Ruta', component: Ruta },
  { path: '/**', redirectTo: ['Dashboard'] }

])
export class AppComponent extends RestController{

  public saveUrl:string;

  constructor(public router: Router,http: Http,public myglobal:globalService) {
      super(http)
    //TODO:Cambiar URL a PRODUCCION
    //localStorage.setItem('urlAPI','http://vertedero.aguaseo.com:8080/api');
    //localStorage.setItem('url','http://vertedero.aguaseo.com:8080');
    localStorage.setItem('urlAPI','http://192.168.0.91:8080/api');
      localStorage.setItem('url','http://192.168.0.91:8080');
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

        },function(error){
          console.log("entro2");
        }
    );
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
    this.httputils.onSave('/logout',null,null);
    this.myglobal.init=false;
    localStorage.removeItem('bearer');
    contentHeaders.delete('Authorization');

    let link = ['AccountLogin', {}];
    this.router.navigate(link);

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
        this.myglobal.myPermissions();
    }

}
