import { Component } from '@angular/core';
import { Router,RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { contentHeaders } from './common/headers';

import { AccountLogin }         from './account/account';
import { AccountSignup }         from './account/account';

import { Empresa }         from './empresa/empresa';
import { TipoEmpresa }         from './tipoEmpresa/tipoEmpresa';
import { TipoVehiculo }         from './tipoVehiculo/tipoVehiculo';
import { Dashboard }         from './dashboard/dashboard';
import { User }         from './user/user';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.html',
  styleUrls:['app/app.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS
  ]
})
@RouteConfig([
  { path: '/account/login',  name: 'AccountLogin',  component: AccountLogin, useAsDefault: true },
    
  { path: '/account/signup',  name: 'AccountSignup',  component: AccountSignup},
    
  { path: '/user',   name: 'User', component: User },
  { path: '/dashboard',   name: 'Dashboard', component: Dashboard },
  { path: '/empresa',   name: 'Empresa', component: Empresa },
  { path: '/tipoEmpresa',   name: 'TipoEmpresa', component: TipoEmpresa },
  { path: '/tipoVehiculo',   name: 'TipoVehiculo', component: TipoVehiculo },

])
export class AppComponent {

  constructor(private router: Router) {
      localStorage.setItem('urlAPI','http://ec2-54-197-11-239.compute-1.amazonaws.com:8080/api');
  }
  logout() {
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
