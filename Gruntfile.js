module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'palis3/js/designQuickForm.js', 'palis3/test/QUnit.css', 'palis3/test/QUnit.js', 'palis3/test/Testing.html', 'palis3/test/Testing2.html', 'palis3/test/quickforms2Test.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', 'jshint');

};
