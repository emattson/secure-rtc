module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      build: {
        files: {
          'build/secure-rtc.js': ['src/index.js']
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! secure-rtc <%= grunt.template.today("dd-mm-yy") %> */\n',
        mangle: true
      },
      build: {
        files: {
          'build/secure-rtc.min.js': ['build/secure-rtc.js']
        }
      }
    },

    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      src: ['src/**/*.js'],
      grunt: ['Gruntfile.js']
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('build', ['eslint', 'browserify', 'uglify']);
  grunt.registerTask('default', ['karma']);

};