module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				browser: true,
				curly: true,
				undef: true,
				unused: true,
				eqnull: true,
				devel: true,
				globals: {
					jQuery: true
				}
			},
			files: {
				src: ['src/**/*.js']
			}
		},
		uglify: {
			dist: {
				src: 'src/jquery.<%= pkg.name %>.js',
				dest: 'dist/jquery.<%= pkg.name %>.min.js'
			},
			options: {
				banner: '/*\n' +
						' * Tubber - A jQuery plugin for YouTube\n' +
						' * https://github.com/wyllyan/tubber/\n' +
						' * Version: 0.1.0\n' +
						' * Copyright (c) 2015 - Under the MIT License\n' +
						' */\n'
			}
		},
		watch: {
			src: {
				files: ['src/**/*.js'],
				tasks: ['jshint']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'uglify']);

}