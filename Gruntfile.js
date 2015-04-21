module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8000,
                    base: './'
                }
            }
        },
        gjslint: {
            options: {
              flags: [ '--disable 110' ],
              reporter: {
                name: 'console'
              }
            },
            js: {
                src: ['lib/*/*.js', 'src/*.js']
            }
        },
        uglify: {
          options: {
            beautify: true,
            report: 'min',
            sourceMap: true,
            sourceMapIncludeSources: true
          },
          js: {
            files: {
              'dist/js/deploy.js': [
                      'lib/effects/object.js', 
                      'lib/*/*.js', 
                      'src/*.js'
                      ]
            }
          }
        },
        watch: {
            prod: {
                files: ['**/*.js', 'html/**/*.html', '!dist/js/*'],
                tasks: ['uglify:js', 'gjslint:js', 'preprocess:prod']
            },
            dev: {
                files: ['**/*.js', 'html/**/*.html', '!dist/js/*'],
                tasks: ['gjslint:js', 'preprocess:dev']
           }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            prod: {
                tasks: ['watch:prod']
            },
            dev: {
                tasks: ['watch:dev']
            }
        },
        preprocess: {
            dev: {
                src: './html/dev/index.html',
                dest: './index.html'
            },
            prod: {
                src: './html/prod/index.html',
                dest: './index.html'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-gjslint');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-preprocess');

    grunt.registerTask('prod', ['gjslint', 'uglify', 'connect', 'preprocess:prod', 'concurrent:prod']);
    grunt.registerTask('dev', ['gjslint', 'connect', 'preprocess:dev', 'concurrent:dev']);
    grunt.registerTask('default', ['dev']);
}
