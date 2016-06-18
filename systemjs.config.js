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
    'highcharts/highstock.src':   'node_modules/highcharts/highstock.js'

  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-jwt':               { main:  'angular2-jwt.js',defaultExtension: 'js' },
    'notifications':              { main: 'components.js', defaultExtension: 'js' },
    'ng2-highcharts':             { defaultExtension: 'js' },
    'highcharts':                 { defaultExtension: 'js' },
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