module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({    
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        //mangle: false,
        //sourceMap: true,
        compress: {
          drop_console: true
        }
      },
      js: {
        files: [{
            expand: true,    // ingresar a las subcarpetas
            cwd: './',  // ruta de nuestro javascript fuente          
            src: ["**/*.js","!node_modules/**","!build/**","!assets/**",'!Gruntfile.js'],     // patrón relativo a cwd
            dest: 'build/'  // destino de los archivos compresos
            //ext: ".js"
        }]
      }              
    },
    cssmin: {
        target: {
            files: [{
            expand: true,
            cwd: './',
            src: ["**/*.css","!node_modules/**","!build/**","!assets/**"],
            dest: 'build/'
            }]
        }
    },
    htmlmin: {
        dist: {
            options: {
                removeComments: true,
                caseSensitive:true,
                collapseWhitespace: true
            },
            files: [{
                expand: true,
                cwd: './',
                src: ["**/*.html","!node_modules/**","!build/**","!assets/**"],
                dest: 'build/'
            }]
        }
    },
      concat: {
          options: {
              separator: ';',
              sourceMap:true,
          },
          dist: {
              src: ['build/**/*.js',"!build/built.js"],
              dest: 'build/built.js',
          },
      },
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks("grunt-ts");

  // Default task(s).
  grunt.registerTask('default', ['uglify','cssmin','htmlmin','concat']);

};
