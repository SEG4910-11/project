///
/// Turn this variable to false if just running UI
var queryServer = true;
/// Turn this variable to false if just running UI
///
var app = 'palis3';
var quickforms = 'QuickForms3'
getChildrenScripts(app);

$(function(){
	if(queryServer)
	{
		var loginPage = "/"+app+"/index.html"
		if(getCookie('username') == "" && window.location.pathname != loginPage)
		{
			window.location = loginPage;
		}
	}
});
//window.onbeforeunload = unauthenticate;
//function unauthenticate()
//{
//	setCookie('username','',1);
//}

function getFieldSelection(appName, factName,paramid, callback) {
    $.ajaxSetup({ cache: false });
    var updateid = null;
    if(isNull(paramid))
    {
       updateid = getParameterByName('id')
    }
    else
    {
        updateid=paramid;
    }
    if(isNull(updateid)==false) // updateid isnt null
    {
        var hiddenId = $('<input type=hidden id="'+factName+'Key" name="'+factName+'Key" value='+updateid+' />')
        $('form').append(hiddenId);
        loadUpdateData(appName,factName,updateid,callback);
    }
	else
	{	
		$('.deleteButton').hide();
	}
    // Find all children within the form that have the "select" tag
    var len = $('select').length;
    var count = 0;
    $('select,.combobox').each(function(){
         var thisDom = $(this);
         var domId = thisDom.attr("id");
		var url = '/'+quickforms+'/getFieldSelection.aspx?app='+appName+'&factTable='+factName+'&field='+domId+'&updateId='+updateid;
         // Asynchronously get the fields from the controller 
		  $.ajax({
                type: 'GET',
                async: true,
                cache: false,
                timeout: 3000,
                url: url,
                data: {},
                success: function(data,status,xhr){
                    if(data != ""){
						// replace the current select dom elements with the JSON supplied from the controller
						if (thisDom[0].tagName == 'SELECT') 
							convertJSONtoSelect(thisDom,data);
						else if(thisDom[0].tagName == 'UL')
						   convertJSONtoUl(thisDom,data,domId);
						if(thisDom.hasClass('combobox'))
							convertJSONtoComboBox(thisDom,data,domId);
						count += 1;
						if(count == len)
						{
							//$.getScript('js/jquery.mobile-1.1.1.min.js');  /// add the jquery mobile api after inserting 
							/// required or else css will not be applied to the select tags.
							$('form').trigger('create');
							if(isNull(callback)==false)
								callback();
						}
					}
                },
                error: function(data,status,xhr){
                    console.log(e1+e2+e3);
					count += 1;
					if(count == len){
						alert('Sorry, Palis seems to be having some technical difficulties at the moment. Please contact lpeyton@uottawa.ca to resolve the issue.');
						$('form').trigger('create');    
					}
                }
        });
         
      }); 
      
    var myDate = new Date();
    var prettyDate =(myDate.getMonth()+1) + '/' + myDate.getDate() + '/' +
    myDate.getFullYear();
    $( ".date" ).val(prettyDate);
    $( ".date" ).datepicker({
								onClose: function ()
								{
									$('select').show()
								}
			});
	$( ".date" ).attr('onclick','disable_selects()');
    $(".birthdate").datepicker({ yearRange: '-105:+1',changeYear: true,defaultDate: '01/01/1943' });
}
function convertJSONtoSelect(thisDom, data)
{
    if(isJSONString(data)){
		thisDom.children().remove();
        var json = JSON.parse(data);
        for(i=0;i<json.length;i++)
        {
            thisDom.append($('<option value='+json[i].id+' '+json[i].selected+'>'+json[i].label+'</option>'));
        }
        thisDom.selectmenu('refresh', true);
    }
    else
    {
        alertJSONError(data);
    }
}
function convertJSONtoUl(thisDom, data, domId)
{
    if(isJSONString(data)){
		thisDom.children().remove();
        var json = JSON.parse(data);
        for(i=0;i<json.length;i++)
        {
            thisDom.append($('<LI value='+json[i].id+'> <a href="#dialog_' + domId + '_' + json[i].id + '" data-rel="dialog">'+json[i].label+'</a></LI>'));
        }
        thisDom.listview('refresh');
    }
    else
    {
        alertJSONError(data);
    }
}
function convertJSONtoComboBox(thisDom, data, domId)
{
    if(isJSONString(data))
    {
        var json=JSON.parse(data);
        $('<ul id="'+domId+'_target" data-role="listview" data-inset="true" data-theme="b" ></ul>').insertAfter('#'+domId);
        $('#'+domId+'_target').listview();
        thisDom.autocomplete({
                source: json,
                target: $('#'+domId+'_target'),
                callback: function(e) {
                    var selected = $(e.currentTarget);
                    thisDom.val(selected.html());
                    thisDom.autocomplete('clear');
                },
                minLength: 0
        });
        thisDom.click(function(e)
        {
            if($('#'+domId+'_target').children().length<=0)
                thisDom.keyup();
            else
                $('#'+domId+'_target').html('');
        });
    }
}
function getResultSet(appName, queryLab, prms, callback) {
    $.ajaxSetup({ cache: false });
	$.ajax({
	  type: 'GET',
	  url: '/'+quickforms+'/getResultSet.aspx',
	  data: {app:appName,query: queryLab, params : prms},
	  success: function(data,status,xhr){
			// return the json data back to the form specific controller
			callback(data);
	  },
	  error: function(xhr, status, e){
		alert('Sorry, Palis seems to be having some technical difficulties at the moment. Please contact lpeyton@uottawa.ca to resolve the issue.');
		callback('Error: '+e);
	  }
	});
}
function executeQuery(appName, queryLab, prms, callback) {
    $.ajaxSetup({ cache: false });
	$.ajax({
	  type: 'GET',
	  url: '/'+quickforms+'/executeQuery.aspx',
	  dataType: 'html',
	  data: {app:appName,query: queryLab, params : prms},
	  success: function(data,status,xhr){
			// return the json data back to the form specific controller
			if(isNull(callback) == false)
				callback(data);
	  },
	  error: function(xhr, status, e){
		alert('Sorry, Palis seems to be having some technical difficulties at the moment. Please contact lpeyton@uottawa.ca to resolve the issue.');
		callback('Error: '+e);
	  }
	});
}
function loadTableData(appName,factName, queryName, parameterList, callback)
{
    getResultSet(appName,queryName,parameterList,
        function(data){
            if(isJSONString(data))
            {
                var json = JSON.parse(data); 
                var liProto = $('#mainData li');
                for(i=0;i<json.length-1;i++)
                {
                    var liNew = liProto.clone();
                    liNew.appendTo('#mainData');
                }

                for(i=0;i<json.length;i++)
                {   
                   // var thisLi = $('#mainData li').eq(i);
                   var updateLink = $('#mainData li:eq('+i+') a');
                   var liHandle = $('#mainData li:eq('+i+')');
                   var leafHandle = $('#mainData li:eq('+i+') td:not(:has(*))');
                   var updateHref=updateLink.attr('href')+'?id='+json[i]['id'];
                   
                   updateLink.attr('href',updateHref); // add the id to the update link
                   updateLink.children('table').attr('onclick',"window.location='"+updateHref+"'"); 
                   // Must make the table have an on click because IE sucks
                   
                   liHandle.attr('id',json[i]['id']); // add the data id to the li row
                   liHandle.append('<input type=hidden value='+json[i]['id']+'>');
                   
                   leafHandle.each(function(){ // find each leaf node and replace it with data
                           if($(this).attr('id')!= null)
                           {
                                $(this).html('');
                                $(this).append(json[i][$(this).attr('id')]);
                           }
                    });
                }
            }
            else
            {
                alertJSONError(data);
            }
             //$.getScript('js/jquery.mobile-1.1.1.min.js');  /// add the jquery mobile api after loading lookups 
                        /// required or else css will not be applied to the <li>
             $('form').trigger('create');
		if(callback != null)
             callback();
        }
    );
    if(getParameterByName("insertedRow")=="true")
    {
        window.setTimeout(function(){highlightMostRecent()},500);
    }
}
function highlightMostRecent()
{
        //var liProto = $('#mainData li:eq(0)');
        var updatedId = getParameterByName('id');
		
        $('#mainData tbody tr').each(function(i, dom)
		{
			var data = $('#mainData').dataTable().fnGetData( dom );
			if(data.id == updatedId)
			{
				$(dom).effect("highlight", {}, 2000);
				$(dom).attr('tabindex',1);
				$(dom).focus();
			}
		});
}
function putFact (appName, factName, location)
{

    //// append the information about the app and the fact table to the form
    $('<input />').attr('type', 'hidden')
            .attr('name', 'app')
            .attr('value', appName)
            .appendTo('form');
    var username=getCookie('userid');
    $('<input />').attr('type', 'hidden')
            .attr('name', 'AddedByID')
            .attr('value', username)
            .appendTo('form');    
    	var serialized = $('form').serialize();
	$('input[type=checkbox]:not(:checked)').each(function(i,dom){
		console.log(dom);
		serialized += '&'+$(dom).attr('id')+'=-1';
	});
	serialized +='&facttable='+factName;
     	serialized = serialized.replace(/%2B/g,'%20');
	$.ajax({
	  type: 'POST',
	  url: '/'+quickforms+'/putFact.aspx',
	  data: serialized,
	  success: function(data,status,xhr){
            /*saveComboboxValues(appName);
            var json;
            if(isJSONString(data))
            {
                    json = JSON.parse(data);*/
                    window.location.href = location +"?insertedRow=true&id="+data;
            /*}
            else
            {
                    window.alert("Row not saved : "+data);
            }*/
	  },
	  error: function(xhr, status, e)
	  {
			alert('Sorry, Palis seems to be having some technical difficulties at the moment. Please contact lpeyton@uottawa.ca to resolve the issue.');
            if(queryServer)
            {
               window.alert("Row not saved, could not connect to server: "+e);
            }
            else
            {
               window.location.href = location;
            }
	  }
	});
      
    return false;
}
function saveComboboxValues(appName)
{
    $('.combobox').each(function(i,dom){
        $.ajax({
                type: 'POST',
                async: false,
                cache: false,
                timeout: 3000,
                url: '/'+quickforms+'/putComboBox.aspx',
                data: {app:appName,lookupTable: $(dom).attr('id'), value : $(dom).val()},
                success: function(data,status,xhr){
                    console.log(data);
                },
                error: function(data,status,xhr){
					alert('Sorry, Palis seems to be having some technical difficulties at the moment. Please contact lpeyton@uottawa.ca to resolve the issue.');
                    console.log(data+" "+xhr);
                }
        });
    });
}
function loadReportInTable(appName,factName, queryName, parameterList,callback)
{
    getResultSet(appName,queryName,parameterList,
        function(data){
		var clipBoardData = "";
            if(isJSONString(data))
            {
                var json = JSON.parse(data); 
                var liProto = $('#'+queryName+' table tbody tr');
				if(json.length == 0)
				{
					liProto.children().remove();
				}
					for(i=0;i<json.length-1;i++)
					{
						var liNew = liProto.clone();
						liNew.appendTo('#'+queryName+' table tbody');
					}

					for(i=0;i<json.length;i++)
					{   
					   var leafHandle = $('#'+queryName+' table tbody tr:eq('+i+') td:not(:has(*))');

					   leafHandle.each(function(){ // find each leaf node and replace it with data
							   if($(this).attr('id')!= null)
							   {
						  clipBoardData += json[i][$(this).attr('id')] +"\t";
									$(this).html('');
									$(this).append(json[i][$(this).attr('id')]);
							   }
						});
						clipBoardData += "\r\n";
					}
				$('body').append('<input type="hidden" id="clip'+queryName+'" value="'+clipBoardData+'" />');
				if(isNull(callback) == false)
				{
					callback(json);
				}
            }
            else
            {
                alertJSONError(data);
            }
            // $.getScript('js/jquery.mobile-1.1.1.min.js');  /// add the jquery mobile api after loading lookups 
                        /// required or else css will not be applied to the <li>s
        }
    );
}
function loadUpdateData(appName,factName,updateid,callback)
{
    getResultSet(appName, factName+'_get_row', factName+'Key:'+updateid, function(data){
        if(isJSONString(data)){
            var json = JSON.parse(data);
            $('form').find('input,textarea,checkbox').each(function(){
                var thisDom = $(this);
				var val = json[0][thisDom.attr('id')];
				if(thisDom.hasClass('date') || thisDom.hasClass('birthdate'))
					val = val.split(" ")[0];
			if(thisDom.attr('type') == "checkbox")
			{
				if(val == "1")
				thisDom.attr('checked',true).checkboxradio("refresh");
			}
			else
			{
                		thisDom.attr('value',val);
			}
            });
		if($('select').length == 0 && isNull(callback)==false)
		{
			callback();
		}
        }
        else
        {
            alertJSONError(data);
        }
    });
}

function loadTabularData(appName,factName, queryName, parameterList, callback)
{
	getResultSet(appName,queryName,parameterList,
        function(data){
            if(isJSONString(data))
            {
                var json = JSON.parse(data); 
				if(json.length>0)
				{
				   // var aaData = {"aaData":json};
					var columns = [];
					for(var key in json[0])
					{
						var obj = { sTitle: key , mData: key};
						if(key == "id" || key == "form")
							obj = { sTitle: key , mData: key, bVisible: false};
						 columns.push(obj);
					}
					var oTable = $('#mainData').dataTable({
 					"sDom":'<"top"lf<"clear">ip<"clear">>rt<"bottom"ip<"clear">' ,
						"bProcessing": true,
					"aaSorting": [],
						"iDisplayLength": 50,
						"sPaginationType": "full_numbers",
						"aaData": json,
					"aoColumns": columns,
					"sDom":'<"top"lf<"clear">ip<"clear">>rt<"bottom"ip<"clear">' ,
						 "fnCreatedRow": function( nRow, aData, iDataIndex ) {	
						 }
					} );	
				  
					
					// make the row clickable
					$('#mainData tbody tr').click( function () {
						var aData = oTable.fnGetData( this );
						//alert( aData.id ); // assuming the id is in the first column
						window.location = aData.form+".html?id="+ aData.id;
					} );
                }
                
            }
            else
            {
				$('#mainData').remove();
                alertJSONError(data);
            }
             //$.getScript('js/jquery.mobile-1.1.1.min.js');  /// add the jquery mobile api after loading lookups 
                        /// required or else css will not be applied to the <li>
             $('form').trigger('create');
			 if(isNull(callback)==false)
             callback();
        }
    );
    if(getParameterByName("insertedRow")=="true")
    {
        window.setTimeout(function(){highlightMostRecent()},500);
    }
}
function deleteRow(app,fact,redirect)
{
	if(confirm('Delete this record?'))
	{
		var id = getParameterByName('id');
		executeQuery(app,'delete_'+fact,fact+'Key:'+id,function(){
			window.location = redirect;
		});
		
	}
}

function getChildrenScripts(root)
{
    $.ajaxSetup({async: false});
    $.getScript('/'+root+'/js/quickforms-helpers.js');
    $.getScript('/'+root+'/js/jqm.autoComplete.js');
    $.ajaxSetup({async: true});
}