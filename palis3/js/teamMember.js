function putTeam()
{
    var userPass=$('#Password');
    var userPassConfirm=$('#user_pass_confirm');
    if(userPass.val().length != 32)
    {
        var md5pass=md5(userPass.val())
        userPass.val(md5pass);
    }
    userPassConfirm.val(md5(userPassConfirm.val()));
	
    if(userPass.val()==userPassConfirm.val())
    {
		userPassConfirm.remove();
        $.ajaxSetup({async:false});
        putFact(app,'teammember','teams.html');
        //$('#factTable').remove();
        //putFact(app,'user_roles','teams.html');
       
        $.ajaxSetup({async:true});
    }
    else
    {
        alert("Passwords do not match.");
    }
}
$(function(){ 
	// Hide delete button if this is an insert rather than a delete
    if(isNull(getParameterByName('id')) || (getCookie('username') != 'palisadmin'))
    {
        $('#deleteTeamButton').hide()
    }
	if(isNull(getParameterByName('id'))==false)
	{
		$('#UserName').textinput('disable');
	}
	// Remove Old password if updating team member
    getFieldSelection(app,'teammember',null,function(){
		if(isNull(getParameterByName('id')) == false)
		{
			$('#Password').val('');
		}
	});
});

function removeTeam()
{
    var result = confirm("Delete team member?");
    if(result == true)
    {
        executeQuery(app,'deactivateTeamMember', 'id='+getParameterByName('id'), 
            function(data)
            {
                window.location="teams.html";
            }
        );
    }
}