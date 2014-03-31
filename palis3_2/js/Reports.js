google.load('visualization', '1', {packages: ['corechart']});

function drawVisualization() {
      	
      	// Define Colors
      	
      var backColor = '#ffffff';
      var axisColor = '#3e3e3e';
      var gridlinesColor = '#ffffff';
      var axisTitleColor = '#333333';
      var color1 = '#db4d4c';
      var color1Muted = '#583534';
      var color2 = '#db844e';
      var color2Muted = '#';
      var color3 = '#eda637';
      var color3Muted = '#5d4d30';
      var color4 = '#a7a737';
      var color4Muted = '#';
      var color5 = '#86aa65';
      var color5Muted = '#444e3d';
      var color6 = '#8aabaf';
      var color6Muted = '#';
      var color7 = '#69c8ff';
      var color7Muted = '#';
      var color8 = '#3e3e3e';
      var color8Muted = '#3e3e3e';
      var color9 = '#4bb3d3';
      var color9Muted = '#4bb3d3';
      	
        // Create and populate the data table.
      var data_column = new google.visualization.arrayToDataTable([
    ['Age', 'Male', 'Female', 'Transgender'],
    ['0-2',   3,       2,           0],
    ['3-5',   4,       1,         0],
    ['6-12',   2,       5,           0],
    ['13-20',   3,       3,         0],
    ['21-35',   6,       3,           1],
    ['36-50',   2,       8,         2],
    ['51-65',   1,       5,           1],
	['66-80',   9,       3,           0],
	['81+',   4,       6,           0]
  ]);
  
    // *********************//
    // *** CREATE CHARTS ***//
    // *********************//
  	new google.visualization.ColumnChart(document.getElementById('columnChart')).
      draw(data_column,
           {height:450,
           	width: '100%',
			vAxis: {maxValue: 100},
            backgroundColor: backColor,
            chartArea:{width:"70%",height:"80%"},
            hAxis: {title: 'Age', textStyle: {color: axisTitleColor}},
            vAxis: {title: '# of Visits', gridlines: {count: 5, color: gridlinesColor}, baselineColor:axisColor, textStyle:{color: axisTitleColor}},
            colors: [ color1, color2, color3, color4, color5, color6, color7, color8]}
      );
        
      
       }
      google.setOnLoadCallback(drawVisualization);
      
	   var chartResizeTimer;
       
       window.onresize = function adjustSize() {
              clearTimeout(chartResizeTimer);
              chartResizeTimer = setTimeout(drawVisualization(), 100);
               };
               
       $(document).on('pageshow','[data-role=page]', function(){
  drawVisualization();
});