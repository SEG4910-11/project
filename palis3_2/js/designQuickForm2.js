///
/// Turn this variable to false if just running UI
var queryServer = true;

var app = 'palis3';
var quickforms = 'QuickForms3'
getChildrenScripts(app);


//This function retrieves the fields options from the database
//It accepts the application name, form name, paramid, callback
//Note: This function was reused from the client's code, some tweaking was done on it to make it work for our application
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
    var len = $('Select').length;
    var count = 0;
    $('Select').each(function(){
         var thisDom = $(this);
         var domId = thisDom.attr("id");
		 var label=  $('label#' + domId).html();
		 convertJSONtoSelect(thisDom,domId, label);
		 /*var url = '/'+quickforms+'/getFieldSelection.aspx?app='+appName+'&factTable='+factName+'&field='+domId+'&updateId='+updateid;
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
						var tag= thisDom[0].tagName;
						if ( tag == 'TABLE') 
							convertJSONtoSelect(thisDom,data,domId);
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
        }); */
         
      });
      
}

//This function is used to dynamically generate the edit mode of the design page of the form
function convertJSONtoSelect(thisDom, domId, label)
{
    if(isJSONString(data)){
		thisDom.children().remove();
        var json = JSON.parse(data);
		
		thisDom.append('<option id='+domId+' value ="1">'+label+'</option>');
    }
    else
    {
        alertJSONError(data);
    }
}

//This function is used to make an ajax request to the controller in order to add a new option to a specific field
//The function accepts the application name, lookup table name, and the html page name
function putLookup(appName, lkupName, location)
{
	//Look for the textbox where the option is added
	$("input").each(function(){
         var thisDom = $(this);
         var domId = thisDom.attr("id");
		 var option;
		 //when the textbox is found, get the label of the new option
		 if(domId== lkupName)
		 {
			option= thisDom.attr("value");
			//If the label is empty notify the user that he's attempting to add an empty option
			if(option=="")
			{
				alert("The field's option is empty");
				return "";
			}
			else
			{
			//make an ajax request and add the new option
			$.ajax({
					type: 'POST',
					url: '/'+quickforms+'/putLkup.aspx',
					data: {app:appName,tbl: lkupName, label : option},
					//In successful addition refresh the page
					success: function(data,status,xhr){
					
							window.location.reload();
							return status;
					},
					//In case of error alert the user
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
		 }}
		 })
   
}

//This function is used to make an ajax request to the controller in order to edit an option to a specific field
//The function accepts the application name, lookup table name, and the html page name
function editLookup(appName, lkupName, location)
{
	//Look for the textbox where the option is edited
	$("input").each(function(){
         var thisDom = $(this);
         var domClass = thisDom.attr("class");
		 var array=domClass.split(" ");
		 var lkup= array[0];
		 var option;
		 var rowId;
		 //when the textbox is found, get the label of the edited option
		 if(lkup == lkupName)
		 {
			option= thisDom.attr("value");
			rowId= thisDom.attr("id");
			//make an ajax request and edit the label of the option
			$.ajax({
					type: 'POST',
					url: '/'+quickforms+'/editLkup.aspx',
					data: {app:appName,tbl: lkupName, label : option, id : rowId},
					success: function(data,status,xhr){
					
							window.location.reload();
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
		 }
		 })
   
}

//This function is used to make an ajax request to the controller in order to delete an option to a specific field
//The function accepts the application name, lookup table name, and the html page name
function deleteLkup(appName,lkup,id,redirect)
{
		//make an ajax request and delete the option with the given id
		 $.ajax({
					type: 'POST',
					url: '/'+quickforms+'/deleteLkup.aspx',
					data: {app:appName,tbl: lkup, row : id},
					success: function(data,status,xhr){
					
							window.location = redirect;
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
							window.redirect.reload();
						}
					}
					});
}

function getChildrenScripts(root)
{
    $.ajaxSetup({async: false});
    $.getScript('/'+root+'/js/quickforms-helpers.js');
    $.getScript('/'+root+'/js/jqm.autoComplete.js');
    $.ajaxSetup({async: true});
}