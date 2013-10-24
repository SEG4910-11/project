var patient={}
$(function(){
	var username = getCookie('username');
      var header = $('#header');
	header.append('Patient - '+username);
	var pid=getCookie('patientId');
	var km=getCookie('Kilometers');
        if(pid=='' || pid=='null' || pid==null)
        {
            pid = getParameterByName('id');
            setCookie('patientId',pid,1);
        }
	if(pid != null)
	{
            getResultSet(app, 'get_patient_details', 'PatientsKey='+pid, function(data){
               var json = JSON.parse(data)[0];
               var headerLeft = $('#headerLeft');
               //var title = $('#title');
               var bDate = new Date.fromISO(json.birth);
               var cDate = new Date();
			   var age = cDate.getFullYear() - bDate.getFullYear();
			   //var lastDigits = bDate.getFullYear();
               headerLeft.append(json.last_name +", "+ json.first_name+", "+ json.gender_label + ", " + age+"Yr, "+ json.Kilometers+ " kms");
			   patient.first_name=json.first_name;
			   patient.last_name=json.last_name;
			   patient.Kilometers=json.Kilometers;
			   patient.age=json.age;
			   patient.gender_label=json.gender_label;
				if(setValue)
				setValue();
				setCookie('kms',json.Kilometers,1);
               //title.append(json.first_name +" "+ json.last_name);
            });

		if($('form').length>0 && document.location.pathname != "/palis3/patient/patientinfo.html")
		{
			$('form').append('<input type=hidden id=PatientKey name=PatientKey value='+pid+' />');
		}
	}
});
function setValue()
		{
		$('#Kilometers').val(patient.Kilometers);	
		
		}
function goBack()
{
    setCookie('patientId','',1);
    window.location='../patients.html';
}
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
function patientFieldSelection()
{
    var pid=getCookie('patientId');
    if(pid=='')
        getFieldSelection(app,'patients');
    else
        getFieldSelection(app,'patients',pid);
}