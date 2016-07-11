/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        'app', // 'dist',
    '@angular':                   'node_modules/@angular',
    'rxjs':                       'node_modules/rxjs',
    'angular2-jwt':               'node_modules/angular2-jwt',
    'notifications':              'node_modules/angular2-notifications',
    'highcharts':                 'node_modules/highcharts',
    'ng2-highcharts':             'node_modules/ng2-highcharts',
    'ng2-select':                 'node_modules/ng2-select',
    'ng2-bootstrap':              'node_modules/ng2-bootstrap',
    'ng2-file-upload':            'node_modules/ng2-file-upload',
    'ng2-uploader':               'node_modules/ng2-uploader',
    'ng2-imageupload':            'node_modules/ng2-imageupload',
    'ng2-toastr':                 'node_modules/ng2-toastr',
    'moment':                     'node_modules/moment',
    'jquery' :                    'node_modules/jquery/dist',
    'angular2-highcharts' :       'node_modules/angular2-highcharts',
    //'highcharts/highstock.src':   'https://cdn.rawgit.com/highcharts/highcharts-dist/v4.2.1/highstock.js',
    'semantic' :                  'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.1.8/semantic.min.js'

  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-jwt':               { main:  'angular2-jwt.js',defaultExtension: 'js' },
    'notifications':              { main: 'components.js', defaultExtension: 'js' },
    'ng2-highcharts':             { defaultExtension: 'js' },
    'highcharts':                 { defaultExtension: 'js' },
    'ng2-select':                 { defaultExtension: 'js' },
    'ng2-file-upload':            { main:'ng2-file-upload',defaultExtension: 'js' },
    'ng2-uploader':               { main:'ng2-uploader',defaultExtension: 'js' },
    'ng2-bootstrap':              { main: 'ng2-bootstrap',defaultExtension: 'js' },
    'ng2-imageupload':            { main: 'index.js',defaultExtension: 'js' },
    'moment':                     { main: 'moment.js',defaultExtension: 'js' },
    'ng2-toastr':                 { defaultExtension: 'js' },
    'jquery':                     { main: 'jquery.min.js', defaultExtension: 'js' },
    'angular2-highcharts' :       { main: 'index',format: 'cjs', defaultExtension: 'js' }


  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];
  // Add package entries for angular packages
  ngPackageNames.forEach(function(pkgName) {
    packages['@angular/'+pkgName] = { main: pkgName + '.umd.js', defaultExtension: 'js' };
  });
  var config = {
    map: map,
    packages: packages
  }
  System.config(config);
})(this);