define(['jquery/jquery.dataTables','server/getFactData'],function(){
quickforms.loadTableReport = function(params) //appName *, queryName, crossTabs *, parameterList*, callback*
{
	params.appName = params.appName || quickforms.app;
	params.parameterList = params.parameterList || '';
	params.callback = params.callback || function(){};
	params.crossTabs = params.crossTabs || [];
	
	quickforms.loadCss(quickforms.jqueryDataTableCss);
	quickforms.initLoadingGif();
	
	var createTable = function(data)
	{
		var mainTable = $('#mainData');
		if(isJSONString(data))
		{
			var json = JSON.parse(data),
				columns = [],
				percentWidth = 0;
			for(var key in json[0])
			{
				percentWidth+=1;
			}
			percentWidth = (100/percentWidth)+"%";
			//percentWidth = 0;
			for(var key in json[0])
			{
				var obj = { sTitle: key , mData: key, sWidth : percentWidth };
				//if(key == "id")
				//	obj = { sTitle: key , mData: key, bVisible: false};
				 columns.push(obj);
			} 
			if($.fn.DataTable.fnIsDataTable( mainTable[0] ) == true)
			{
				mainTable.dataTable().fnDestroy(); 
				mainTable.html("");
			}
			mainTable.css("max-width","none");
			//mainTable.attr('width','100%');
			mainTable.addClass('display');
			
			var oTable = mainTable.dataTable( {  
				"bProcessing": true,
				"iDisplayLength": 50,
				"sPaginationType": "full_numbers",
				"aaSorting": [[0,"desc"]],	
				"aaData": json,    
				"sScrollX": "100%",
				"sScrollXInner": "101%",
				"bScrollCollapse": true,
				"aoColumns": columns,
				"fnDrawCallback" : function(oSettings) {
					drawCallback(mainTable);
				},
				"sDom" : '<"top"i<"filter_result"><"clear"><"filter_button"><"clear">>rt<"bottom"<"clear">>'		
			} );	
	   
			quickforms.hideLoadingGif();

			oTable.fnDraw(true);
		}
		else
		{
			mainTable.remove();
			alertJSONError(data);
		}
		
		params.callback();
        
	};
	quickforms.getFactData({app:params.appName,
                                queryName:params.queryName,
                                params:params.parameterList,
                                callback:createTable,
                                whereclause:params.whereclause
                                });
	var drawCallback = function(table)
	{
		for(var i =0;i<params.crossTabs.length;i++)
		{
			var tab = params.crossTabs[i],
				headerRow = table.find('thead tr th'),
				columns = [];
			headerRow.each(function(j,val){
				if($(val).attr('aria-label').indexOf(tab)>=0)
				{
					columns.push(j+1);
				}
			});
			for(var j=0;j<columns.length;j++)
			{
				
				var col = table.find('tr td:nth-child('+columns[j]+')'),
					curCategory = "";
				col.each(function(k,row)
				{
					row = $(row);
					row.css('color','black');
					if(row.text() == curCategory)
					{
						row.css('color',row.css('background-color'));				
						//row.css("background-color","white");
					}
					else
					{
						curCategory = row.text();
					}
				});
			}
		}
	}
};


});