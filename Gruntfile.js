module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        src: 'development/js/modules/**.js',
        dest: 'development/js/main.js',
      },
    },
    uglify: {
      dist: {
        options: {
          banner: '// <%= grunt.template.today("dd/mm/yyyy") %> by <%= pkg.author %>\n',
          sourceMap: true,
        },
        src: '<%= concat.js.dest %>',
        dest: 'build/bluerain/js/main.min.js',
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
          cwd: 'development/style/scss',
          src: ['**.scss'],
          dest: 'development/style/css/',
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
          cwd: 'development/style/scss',
          src: ['**.scss'],
          dest: 'build/bluerain/style/css/',
          ext: '.min.css',
        }],
      },
    },
    watch: {
      scripts: {
        files: ['development/js/modules/**.js'],
        tasks: ['concat:js', 'uglify'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['development/style/scss/**.scss', 'development/style/scss/subfiles/_**.scss'],
        tasks: ['sass'],
      },
    },
    copy: {
      build: {
        expand: true,
        cwd: 'development',
        src: ['config/**', 'dependencies/**', 'images/**', 'js/*.js', 'style/**', 'templates/**', '*'],
        dest: 'build/bluerain/',
      },
    },
    zip: {
      theme: {
        expand: true,
        cwd: 'build',
        src: 'bluerain/**',
        dest: 'build/<%= pkg.name %>_v<%= pkg.version %>.zip',
      },
      minimal: {
        expand: true,
        cwd: 'build',
        src: ['bluerain/config/**', 'bluerain/dependencies/fontawesome/fonts/*', 'bluerain/dependencies/bootstrap/js/*.js', 'bluerain/images/**', 'bluerain/js/*.min.js', 'bluerain/style/css/*.min.css', 'bluerain/templates/**.twig.html', 'bluerain/*.yml', 'bluerain/*.theme', 'bluerain/*.php', 'bluerain/logo.svg'],
        dest: 'build/<%= pkg.name %>_minimal_v<%= pkg.version %>.zip',
      },
    },
  });
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['concat', 'uglify', 'sass', 'copy', 'zip']);
}
