define(['jquery/jquery.dataTables','server/getFactData'],function(){
quickforms.tableControl = quickforms.tableControl || {list:{}};
quickforms.loadTable = function(params) //appName, queryName, parameterList, callback, domId*, whereclause*
{
	params.appName = params.appName || quickforms.app;
	params.parameterList = params.parameterList || '';
	params.callback = params.callback || function(){};
	params.domId = params.domId || 'mainData';
	params.whereclause = params.whereclause || '1=1';
	
	quickforms.loadCss(quickforms.jqueryDataTableCss);
	quickforms.tableControl.list[params.domId]=quickforms.tableControl.list[params.domId]||{
		params:params,
		dom:$('#'+params.domId),
		callback:quickforms.loadTable
	};
	var appendTableData = function(data){
		var mainTable = $('#'+params.domId);
		if(mainTable.children().length>0)
		{
			mainTable.dataTable().fnDestroy();
			mainTable.html('');
		}
		if(!isJSONString(data))
		{
			if(data.indexOf(']')>=0) // returned array is empty
			{
					quickforms.hideLoadingGif();
					data = '[["No Data"]]';
			}
			else
			{
					alertJSONError(data);
					return;
			}
		}
		var json = JSON.parse(data); 
		
		var columns = [];
		var percentWidth = 0;
		for(var key in json[0])
		{
				percentWidth+=1;
		}
		percentWidth = (100/percentWidth)+"%";
		//percentWidth = 0;
		for(var key in json[0])
		{
				var obj = { sTitle: key , mData: key, sWidth : percentWidth };
				if(key == "id" || key == "form")
						obj = { sTitle: key , mData: key, bVisible: false};
				 columns.push(obj);
		} 
		mainTable.css("max-width","none");
		mainTable.addClass('display');

		var oTable = mainTable.dataTable( {  
				"sDom":'<"top"lfi>rt<"bottom"ip<"clear">',
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
										// hide the bottom add button if the number of records displayed is less than 15 
										if (oSettings._iDisplayEnd
														% oSettings._iDisplayLength >= 15) {
												$('a.btmAdd').show();
										} else {
												$('a.btmAdd').hide();
										}
								},
								"sDom":'<"top"lf<"clear">ip<"clear">>rt<"bottom"ip<"clear">'

		} );	


		// make the row clickable
		$('#'+params.domId+' tbody tr').click( function () {
			var aData = oTable.fnGetData( this );
			//alert( aData.id ); // assuming the id is in the first column
			window.location = aData.form+".html?id="+ aData.id;
		} );
		quickforms.highlightMostRecent(params);
		quickforms.hideLoadingGif();
		oTable.fnDraw(true);
		

		params.callback();
	};
	appendTableData('[["No Data"]]');
        quickforms.initLoadingGif();
	setTimeout(function(){
		if(isNull(quickforms.tableControl.list[params.domId].filter) || quickforms.tableControl.list[params.domId].filter.completed)
			quickforms.getFactData({app:params.appName,
									queryName:params.queryName,
									params:params.parameterList,
									whereclause:params.whereclause,
									callback:appendTableData});
	},1);
};
quickforms.highlightMostRecent = function(params)
{
	var updatedId = getParameterByName('rowId');
	if(isNull(updatedId) == false)
	{
		$('#'+params.domId+' tbody tr').each(function(i, dom)
		{
			var data = $('#'+params.domId).dataTable().fnGetData( dom );
			if(data.id == updatedId)
			{
				dom = $(dom);
				dom.addClass('highlighted');
				window.setTimeout(function(){dom.removeClass('highlighted')},1500);
			}
		});
	}
}
});