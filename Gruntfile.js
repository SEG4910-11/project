//Gruntfile

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'Test1.html','Test2.html','Test3.html','Test4.html','Test5.html','Test6.html's]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', 'jshint');

};

