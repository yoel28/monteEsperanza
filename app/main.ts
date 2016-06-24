import { bootstrap }      from '@angular/platform-browser-dynamic';
import { provide,enableProdMode }    from '@angular/core';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { globalService }   from './common/globalService';
import { AppComponent }   from './app.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';


enableProdMode();
bootstrap(AppComponent, [
    globalService,
    ToastsManager,
    HTTP_PROVIDERS,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provide(AuthHttp, {
        useFactory: (http) => {
            return new AuthHttp(new AuthConfig({
                tokenName: 'bearer'
            }), http);
        },
        deps: [Http]
    })
]);
