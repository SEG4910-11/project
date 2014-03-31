define(['google/google-jsapi','server/getFactData'],function(){
quickforms.loadGraphReport = function(params) //appName *, queryName, parameterList*, callback*
{
	params.appName = params.appName || quickforms.app;
	params.parameterList = params.parameterList || '';
	params.callback = params.callback || function(){};
	var apiLoadCallback = function()
	{
		quickforms.getFactData({app:params.appName,
                                        queryName:params.queryName,
                                        params:params.parameterList,
                                        whereclause:params.whereclause,
			callback:function(data){
				var json = JSON.parse(data);
				//var columns
				var dataTable = new google.visualization.arrayToDataTable(convertObjectToArray(json));
				var options = {
				 height: dataTable.getNumberOfRows() * 40,
				};

				var chart = new google.visualization.BarChart(
							document.getElementById('chart'));
				chart.draw(dataTable, options);
			}
                    });
	}
	var convertObjectToArray = function(json)
	{
		var retArray=[],
			header=[];
		for(var col in json[0])
		{
			header.push(col);
		}
		retArray.push(header);
		for(var i=0;i<json.length;i++)
		{
			var row = json[i];
			var rowArray = [];
			for(var col in row)
			{
				if(isNumber(row[col]))
					rowArray.push(parseInt(row[col]));
				else
					rowArray.push(row[col]);
			}
			retArray.push(rowArray);
		}
		return retArray;
	}
	google.load('visualization', '1', {callback:apiLoadCallback,packages: ['corechart']});
	
};
quickforms.extendClass('ServerQuery',function(obj){
	var oldRun = obj.run;
	obj.run = function()
	{
		obj.fakeData='[{"Car":"Mazda","Rating (%)":"60"},{"Car":"Audi","Rating (%)":"30"},{"Car":"Volvo","Rating (%)":"10"}]';
		oldRun.call(obj);
	}
	//multiObj.fakeData='[{"id":"1","selected":"selected","label":"Not Specified"},{"id":"2","selected":"","label":"Audi"},{"id":"3","selected":"","label":"Volvo"}]';
	//console.log('extending multi data');
});
});