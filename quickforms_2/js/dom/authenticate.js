
define(['helper/helper','dom/form/text'],
function (){
	
	var loginPage = "/"+quickforms.app+"/index.html"
	var username = getCookie('username'),
		userId = getCookie('userid');
	if(isNull(username) 
		&& window.location.pathname != loginPage
		&& !quickforms.offline)
	{
		window.location = loginPage;
	}
	else
	{
		var header = $('div[data-role="header"]'),
			logoutDiv = $('<div class="ui-btn-right" data-role="controlgroup" data-type="horizontal" ></div>'),
			logoutButton = $('<a href="#"  data-role="button" data-theme="c" onclick="quickforms.logout()">Logout</a>');
		header.children().first().append(' - '+username);
		header.append (logoutDiv);
		logoutDiv.append(logoutButton);
		header.trigger('create');
		//quickforms.form.domParsers.push(function(formObj){
                    var addedBy = $('<input type="hidden" name="addedBy" value="'+userId+'" />');
                    $('form').append(addedBy);
                //    var texObj = new quickforms.TextElement(addedBy,formObj);
			//texObj.parseDom(formObj);
           //     });
		
		
	}
	quickforms.logout = function()
	{
		setCookie('username','',1);
		window.location = loginPage;
	}
});
