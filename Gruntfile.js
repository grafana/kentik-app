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
      graph_panel_js_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['panel/kentik-graph/*.js'],
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
          src: [
            '**/*.js',
            '!src/directives/*.js',
            '!src/filters/*.js',
            "!panel/kentik-graph/*.js"
          ],
          dest: 'dist'
        }]
      },
    },

    typescript: {
      build: {
        src: [
          'dist/**/*.ts',
          "!src/panel/kentik-graph/spec/**/*",
          "!**/*.d.ts"
        ],
        dest: 'dist/',
        options: {
          module: 'system', //or commonjs
          target: 'es5', //or es5
          rootDir: 'dist/',
          sourceRoot: 'dist/',
          // keepDirectoryHierarchy: false,
          declaration: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          sourceMap: true,
          noImplicitAny: false,
        }
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
    'copy:graph_panel_js_to_dist',
    'typescript:build',
    'babel',
    'jshint',
    'jscs'
    ]);
};
