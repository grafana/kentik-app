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
      pluginDef: {
        expand: true,
        src: ['README.md'],
        dest: 'dist',
      }
    },

    watch: {
      rebuild_all: {
        files: ['src/**/*', 'readme.md'],
        tasks: ['watchTask'],
        options: {spawn: false}
      },
    },

    babel: {
      options: {
        presets:  ["es2015"],
      },
      dist: {
        options: {
          sourceMap: true,
          plugins: ['transform-es2015-modules-systemjs', "transform-es2015-for-of"]
        },
        files: [{
          cwd: 'src',
          expand: true,
          src: ['**/*.js', '!src/directives/*.js', '!src/filters/*.js'],
          dest: 'dist',
          ext:'.js'
        }]
      },
      distTestNoSystemJs: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['**/*.js'],
          dest: 'dist/test',
          ext: '.js'
        }]
      },
      distTestsSpecsNoSystemJs: {
        files: [{
          expand: true,
          cwd: 'specs',
          src: ['**/*.js'],
          dest: 'dist/test/specs',
          ext: '.js'
        }]
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
          'dist/test/specs/test-main.js',
          'dist/test/specs/*_specs.js'
        ]
      }
    },

    jshint: {
      source: {
        files: {
          src: ['src/**/*.js'],
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

    jscs: {
      src: ['src/**/*.js'],
      options: {
        config: ".jscs.json",
      },
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

  grunt.registerTask('default', [
    'clean',
    'sass',
    'copy:src_to_dist',
    'copy:pluginDef',
    'jshint',
    'jscs',
    'babel',
    'mochaTest'
  ]);

  grunt.registerTask('watchTask', [
    'clean',
    'sass',
    'copy:src_to_dist',
    'copy:pluginDef',
    'babel',
    'jshint',
    'jscs'
  ]);
};
