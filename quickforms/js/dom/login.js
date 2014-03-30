
define(['dom/form/form','server/getFactData','helper/md5'],
function (){
	quickforms.loadCss(quickforms.loginCss);
	quickforms.loginControl = function()
	{
		quickforms.currentLogin = this;
		var me = this;
		if(!isNull(getParameterByName('invalidLogin')))
		{
			$('form').prepend("<p style='color:red'>Incorrect username password combination</p>");
		}
		
		/**Versioning - Modify build number (incrementaly) for every commit to SVN. Found in app config  */
		$('#versioning').html( 'Version ' + quickforms.version + ' (build ' + quickforms.build + ')');
		/**End - Versioning*/
		if(!isNull(getCookie('userpass')))
		{
			$('#username').val(getCookie('usernameRemember'));
			$('#password').val('fdsafdsafa');
			if(quickforms.jqueryMobileEnable){$('#rememberMe').attr('checked','checked').checkboxradio('refresh');}
			
		}
					   
		this.logIn = function()
		{
			this.md5edPass = '';
			var cookiePass = getCookie('userpass');
			this.successLocation = $('input[type="button"]').attr('href');
			$('input[type="button"]').attr('href','#');
			if(isNull(cookiePass))
				this.md5edPass = md5($('#password').val());
			else
				this.md5edPass = cookiePass;
			this.username = $('#username').val();
			var prms = "username='"+this.username+"' and password='"+this.md5edPass+"'";
			quickforms.getFactData({queryName:'getUserByPassword',
                                                whereclause:prms,
                                                callback:this.loginSuccess
                                            });
		};
		this.loginSuccess = function(data)
		{
			var rememberChecked = $('#rememberMe').attr('checked');
			if(isJSONString(data))
			{
				me.success = true;
				var json=JSON.parse(data);
				setCookie("userid",json[0].teamMembersKey,1);
				setCookie("userRole",json[0].userRoleLabel,1);
				if(rememberChecked == 'checked')
				{
					setCookie('userpass',me.md5edPass,365);
					setCookie('username',me.username,365);
					setCookie('usernameRemember',me.username,365);
				}
				else
				{
					setCookie('username',me.username,1);
					setCookie('userpass','',1);
				}
				window.location = me.successLocation;
			}
			else
			{
				me.success = false;
				window.location = 'index.html?invalidLogin=true';
			}
		}
		
		$(document).keypress(function(e) {
			if(e.which == 13) { // Press enter to log in 
				quickforms.currentLogin.logIn();
			}
		});
	};
	quickforms.setupLogin = function()
	{
		new quickforms.loginControl();
	};
	quickforms.getFakeFactData = '[{"teamMembersKey":1,"username":"admin","userRole":3}]';
});
