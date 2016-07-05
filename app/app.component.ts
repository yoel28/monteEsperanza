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
import { Rol }         from './rol/rol';
import { Parametro }         from './parametro/parametro';
import { Regla }         from './regla/regla';
import { TipoRecarga }         from './tipoRecarga/tipoRecarga';
import { Recarga }         from './recarga/recarga';
import { TagRfid }         from './tagRfid/tagRfid';
import { Vehiculo }         from './vehiculo/vehiculo';
import { Permiso }         from './permiso/permiso';
import { PermisosRol }         from './permiso/permiso';
import {globalService} from "./common/globalService";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";

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
  { path: '/taquilla/:search',   name: 'TaquillaSearh', component: Taquilla },

  { path: '/empresas',   name: 'Empresa', component: Empresa },
  { path: '/empresas/:ruc',   name: 'EmpresaTimeLine', component: EmpresaTimeLine },

  { path: '/operacion',   name: 'Operacion', component: Operacion },
  { path: '/roles',   name: 'Rol', component: Rol },

  { path: '/permisos',   name: 'Permiso', component: Permiso },
  { path: '/permisos/rol',   name: 'PermisoRol', component: PermisosRol },
  { path: '/parametro',   name: 'Parametro', component: Parametro },
  { path: '/regla',   name: 'Regla', component: Regla },
  { path: '/recargas',   name: 'Recarga', component: Recarga },
  { path: '/tipoRecarga',   name: 'TipoRecarga', component: TipoRecarga },
  { path: '/tipoEmpresa',   name: 'TipoEmpresa', component: TipoEmpresa },
  { path: '/tipoVehiculo',   name: 'TipoVehiculo', component: TipoVehiculo },
  { path: '/tagRfid',   name: 'TagRfid', component: TagRfid },
  { path: '/**', redirectTo: ['Dashboard'] }

])
export class AppComponent {

  constructor(private router: Router,public myglobal:globalService) {
    //TODO:Cambiar URL a PRODUCCION
    //localStorage.setItem('urlAPI','http://ec2-54-197-11-239.compute-1.amazonaws.com:8080/api');
    //localStorage.setItem('url','http://ec2-54-197-11-239.compute-1.amazonaws.com:8080');
    localStorage.setItem('urlAPI','http://192.168.0.91:8080/api');
    localStorage.setItem('url','http://192.168.0.91:8080');
    router.subscribe(this.successHandler, this.failureHandler);
  }
  successHandler(){
    console.log("entro");

  }
  failureHandler(){
    console.log("entro2");
  }

  logout(event) {
    event.preventDefault();
    localStorage.removeItem('bearer');
    contentHeaders.delete('Authorization');
    let link = ['AccountLogin', {}];
    this.router.navigate(link);

  }
  validToken(){
    if(localStorage.getItem('bearer'))
        return true;
    return false;
  }

}
