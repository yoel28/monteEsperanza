import { bootstrap }      from '@angular/platform-browser-dynamic';
import { provide,enableProdMode }    from '@angular/core';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF} from '@angular/common';
import { globalService }   from './common/globalService';
import { AppComponent }   from './app.component';
import { ToastsManager,ToastOptions } from 'ng2-toastr/ng2-toastr';
import 'semantic';

let options = {
    toastLife: 4000,
};

enableProdMode();
bootstrap(AppComponent, [
    globalService,
    ToastsManager,
    provide(ToastOptions, { useValue: new ToastOptions(options)}),
    HTTP_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provide(APP_BASE_HREF, { useValue: '/' }),
    provide(AuthHttp, {
        useFactory: (http) => {
            return new AuthHttp(new AuthConfig({
                tokenName: 'bearer'
            }), http);
        },
        deps: [Http]
    })
]);
