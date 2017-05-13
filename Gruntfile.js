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
        tasks: ['concat:js', 'uglify', 'copy:dev-js'],
        options: {
          spawn: false,
        },
      },
      css: {
        files: ['development/style/scss/**.scss', 'development/style/scss/subfiles/_**.scss'],
        tasks: ['sass', 'copy:dev-sass'],
      },
    },
    copy: {
      build: {
        expand: true,
        cwd: 'development',
        src: ['config/**', 'dependencies/**', 'images/**', 'js/*.js', 'style/**', 'templates/**', '*'],
        dest: 'build/bluerain/',
      },
      'dev-sass': {
        expand: true,
        cwd: 'development',
        src: 'style/css/*',
        dest: 'build/bluerain/',
      },
      'dev-js': {
        expand: true,
        cwd: 'development',
        src: 'js/*.js',
        dest: 'build/bluerain/',
      },
    },
    zip: {
      theme: {
        cwd: 'build/',
        src: 'build/bluerain/**',
        dest: 'build/<%= pkg.name %>_v<%= pkg.version %>.zip',
      },
      minimal: {
        cwd: 'build/',
        src: ['build/bluerain/config/**', 'build/bluerain/dependencies/fontawesome/fonts/*', 'build/bluerain/dependencies/bootstrap/js/*.js', 'build/bluerain/images/**', 'build/bluerain/js/*.min.js', 'build/bluerain/style/css/*.min.css', 'build/bluerain/templates/**.twig.html', 'build/bluerain/*.yml', 'build/bluerain/*.theme', 'build/bluerain/*.php', 'build/bluerain/logo.svg'],
        dest: 'build/<%= pkg.name %>_minimal_v<%= pkg.version %>.zip',
      },
    },
  });
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['concat', 'uglify', 'sass', 'copy:build', 'zip']);
}
