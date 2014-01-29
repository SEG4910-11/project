var app = 'palis3';
var quickforms = 'QuickForms3';
var labelID;


//This function reload the page to be edited adding the edit button beside each select field
function design(){

	//Hide the top and bottom buttons that appear on the original form 
	$('div.buttons').hide();
	
	//add back button to go back to the original page
	$('div.buttons').before('<a href="#" rel="external" onClick="location.reload();" data-role="button" data-inline="true" data-icon="back" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-hover-c ui-btn-down-c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Back</span><span class="ui-icon ui-icon-back ui-icon-shadow">&nbsp;</span></span></a><br/>');
	
	//Search for each select field
	$('div.ui-select').each(function(){
        var thisDom = $(this);
		var thisDomChildren= $(this).context.childNodes;
		//get the id of the select field
		for (i=0; i<thisDomChildren.length; i++)
		{
			var child= thisDomChildren[i];
			if(child.tagName=='SELECT')
			{
				var domId= thisDomChildren[i].id;
				var id= domId.toString();
			}
		};		
		//Add the edit button (pencil icon) beside each select field
	    thisDom.before('<a href="#" rel="external" id="'+id+'" onclick="editOption('+id+')" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-pencil ui-icon-shadow"></span></span></a>')
		});
		
		$('body').wrapInner('<p></p>');
	
}

// This function direct the user to the page where he/she can edit the options of a specific field
function editOption(domId){

	//save current field's label id for later use when redirecting back to the main editing page
	labelID= domId.id;
	//Hide everything in the page except for the label of the specified field
	$('label').each(function(){
		var thisDom = $(this);
		var DomFor= thisDom.attr('for');
		if(DomFor==domId.id)
		{
			//hide the main editing page
			$('p').hide();
			//append the label of the specific field was selected for editing to the specific editing page
			var labelText= thisDom.text();
			$('body').append('<h3>'+labelText+'</h3>');
			//append the back button that redirects the user to the main editing page
			$('h3').before('<button onClick="designPage()">Back</button>');
			
		}
	});
	
	getFieldOptions(app, 'education', labelID, location);
	

}

//This function retrieves the fields options from the database
//It accepts the application name, form name, paramid, callback
function getFieldOptions(appName, factName,paramid, callback) {
   
	  
	  
	  var url = '/'+quickforms+'/getFieldSelection.aspx?app='+appName+'&factTable='+factName+'&field='+paramid+'&updateId='+paramid;
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
						 
							displayEditingPage(data,paramid);
						
					}
                },
                error: function(data,status,xhr){
                    console.log(e1+e2+e3);
					   
					}
                }
        );
         
      
}

//This function is used to dynamically generate the edit mode of the design page of the form
function displayEditingPage(data, domId)
{
    if(isJSONString(data)){
		
        var json = JSON.parse(data);
		//If the list of fields is less than 9 fields display the fields without the scrolling box
		//if(json.length<9)
		//{
			$('h3').append('<table id=\x27'+domId+'\x27 ></table>');
		//Go through each option of a specific field and display it in a text box with the delete, up and down buttons beside it
        for(i=0;i<json.length;i++)
        {
			var id= json[i].id; //this variable is the id of the option
			var label= json[i].label;// this variable is the label of the option
			var selected= json[i].selected;
            var formName= 'design.html';
			
			if(i==0){
			
				$('table').append('<tr><td><a href="#" rel="external" onClick="" data-role="button" data-inline="true" data-icon="arrow-d" data-iconpos="notext"></a></td> <td><input id="'+id+'" class="'+domId+'" value="'+label+'" style="width: 300px; margin-left:20px;"></td></tr>');
		    }
			else{
			
				$('table').append('<tr><td><a href="#" rel="external" onClick="deleteLkup(\x27'+app+'\x27,\x27'+domId+'\x27,'+id+',\x27\x27)" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-delete ui-icon-shadow"></span></span></a> <a href="#" rel="external" onClick="" data-role="button" data-inline="true" data-icon="arrow-d" data-iconpos="notext"></a></td> <td><input id="'+id+'" class="'+domId+'" value="'+label+'" style="width: 300px; margin-left:20px;"></td></tr>');
		   
			}
		}
		//Display the new option textbox,add, and save buttons under the options of the field
		$('table').append('<tr><td></td><td><input id="'+domId+'" placeholder="New option..."  style="width: 300px; margin-left:20px;"></td></tr>');
		$('table').append('<tr><td></td><td><a href="#" rel="external" onClick="putLookup(\x27'+app+'\x27,\x27'+domId+'\x27,\x27design.html\x27)" data-role="button" data-inline="true" style="margin-left:20px;">Add</a><a href="#" rel="external" onClick="editLookup(\x27'+app+'\x27,\x27'+domId+'\x27,\x27design.html\x27)" data-role="button" data-inline="true" ">Save</a></td></tr>');
		
		//}
		
	/*	//otherwise display the options in a scrolling box
		else
		{
			
			for(i=0;i<json.length;i++)
        {
			var id= json[i].id;
			var label= json[i].label;
			var selected= json[i].selected;
            var formName= 'design.html';
			
		    $('table').append('<tr><td><a href="#" rel="external" onClick="deleteLkup(\x27'+app+'\x27,\x27'+domId+'\x27,'+id+',\x27design.html\x27)" data-role="button" data-inline="true" data-icon="delete" data-iconpos="notext"></a> <a href="#" rel="external" onClick="" data-role="button" data-inline="true" data-icon="arrow-u" data-iconpos="notext"></a> <a href="#" rel="external" onClick="" data-role="button" data-inline="true" data-icon="arrow-d" data-iconpos="notext"></a></td> <td><input id="'+id+'" class="'+domId+'" value="'+label+'" style="width: 300px;"></td></tr>');
		   
		}
		//Put the fields in a scrolling box
		var containerID= "container"+domId;
		$('table').wrap('<div id=\x27'+containerID+'\x27 class=\x27container\x27></div>');
		var containerId= '#'+containerID;
		//Display the new option textbox, add, and save buttons outside the scrolling box
		$( containerId ).after('<a href="#" rel="external" onClick="putLookup(\x27'+app+'\x27,\x27'+domId+'\x27,\x27design.html\x27)" data-role="button" data-inline="true" style="margin-left:145px;">Add</a><a href="#" rel="external" onClick="editLookup(\x27'+app+'\x27,\x27'+domId+'\x27,\x27design.html\x27)" data-role="button" data-inline="true" ">Save</a>');
		$( containerId ).after('<input id="'+domId+'" placeholder="New option..."  style="width: 300px; margin-left:145px;">');
		}*/
    }
    else
    {
        alertJSONError(data);
    }
}

//This function directs the user back to the main editing page
function designPage(){
	//remove everything in the specific editing page
	$('button').remove();
	$('table').remove();
	$('h3').remove();
	//show the main editing page
	$('p').show();
	
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
					
							refreshTable(lkup);
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

//This function refresh the options field on display after deleting one of them
function refreshTable(domId){

//Remove the current table
$('table').remove();
//Append the new table with the new options list
getFieldOptions(app, 'education', domId, location);
}
