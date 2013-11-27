var quickforms = 'QuickForms3'
var queryServer = true;

function putLookup(appName, lkupName, option, location)
{
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
					success: function(data,status,xhr){
					
							window.location.reload();
							return status;
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
   
}
