module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({

    clean: ["dist"],

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.js', '!**/*.scss'],
        dest: 'dist'
      },
      img_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['img/*'],
        dest: 'dist/src/'
      },
      pluginDef: {
        expand: true,
        src: ['plugin.json', 'README.md'],
        dest: 'dist',
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'plugin.json', 'readme.md'],
        tasks: ['default'],
        options: {spawn: false}
      },
    },

    babel: {
      options: {
        sourceMap: true,
        presets:  ["es2015"],
        plugins: ['transform-es2015-modules-systemjs', "transform-es2015-for-of"],
      },
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['**/*.js', '!src/directives/*.js', '!src/filters/*.js'],
          dest: 'dist',
          ext:'.js'
        }]
      },
    },

    jshint: {
      source: {
        files: {
          src: ['Gruntfile.js', 'src/**/*.js'],
        }
      },
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish'),
        ignores: [
          'node_modules/*',
          'dist/*',
        ]
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "dist/css/kentik.dark.css": "src/sass/kentik.dark.scss",
          "dist/css/kentik.light.css": "src/sass/kentik.light.scss",
        }
      }
    }
  });

  grunt.registerTask('default', ['clean', 'sass', 'copy:src_to_dist', 'copy:pluginDef', 'jshint', 'babel']);
};
