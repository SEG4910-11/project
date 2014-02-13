module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'palis3/js/designQuickForm.js', 'palis3/test/]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', 'jshint');

};
