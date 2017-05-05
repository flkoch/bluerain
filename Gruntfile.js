module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-zip');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        src: 'js/modules/*.js',
        dest: 'js/main.js',
      },
    },
    uglify: {
      dist: {
        options: {
          banner: '// <%= grunt.template.today("dd/mm/yyyy") %> by <%= pkg.author %>\n',
          sourceMap: true,
        },
        src: '<%= concat.js.dest %>',
        dest: 'js/main.min.js',
      },
    },
    sass: {
      dev: {
        options: {
          sourceMap: true,
          outputStyle: 'expanded',
        },
        files: [{
          expand: true,
          cwd: 'style/scss',
          src: ['**.scss'],
          dest: 'style/css/',
          ext: '.css',
        }],
      },
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed',
        },
        files: [{
          expand: true,
          cwd: 'style/scss',
          src: ['**.scss'],
          dest: 'style/css/',
          ext: '.min.css',
        }],
      },
    },
    watch: {
      scripts: {
        files: ['js/modules/**.js'],
        tasks: ['concat:js', 'uglify'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['style/scss/**.scss', 'style/scss/subfiles/_**.scss'],
        tasks: ['sass:dev'],
      },
    },
    zip: {
      theme: {
        src: ['dependencies/fontawesome/**', 'dependencies/bootstrap/js/*.js', 'images/**', 'js/*.min.js', 'style/css/**.min.css', 'templates/**', 'bluerain.*.yml', 'logo.svg'],
        dest: 'installer/<%= pkg.name %>_v<%= pkg.version %>.zip',
      },
      dev: {
        src: ['dependencies/**', 'images/**', 'js/**', 'style/**', 'templates/**', 'bluerain.*.yml', 'logo.svg'],
        dest: 'installer/<%= pkg.name %>_v<%= pkg.version %>.dev.zip',
      },
    },
  });
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['concat', 'uglify', 'sass', 'zip']);
}
