// Обязательная обёртка
module.exports = function(grunt) {

    // Задачи
    grunt.initConfig({
        jsDir: 'public/javascripts/',
        jsDistDir: 'dist/javascripts/',
        cssDir: 'public/stylesheets/',
        cssDistDir: 'dist/stylesheets/',
        // Склеиваем
        concat: {
            main: {
                src: [
                    '/public/lib/**/*.js',
                    'public/javascripts/*.js'  // Все JS-файлы в папке
                ],
                dest: 'build/scripts.js'
            }
        },
        // Сжимаем
        uglify: {
            main: {
                files: {
                    // Результат задачи concat
                    'build/scripts.min.js': '<%= concat.main.dest %>'
                }
            }
        }
    });

    // Загрузка плагинов, установленных с помощью npm install
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Задача по умолчанию
    grunt.registerTask('default', ['concat', 'uglify']);
};