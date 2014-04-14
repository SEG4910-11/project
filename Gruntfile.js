//Gruntfile

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'testF1.html','testF2.html','testF3.html','testF4.html','testF5.html','testF6.html','testF7.html','testF8.html','testF9.html','testF10.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', 'jshint');

};

