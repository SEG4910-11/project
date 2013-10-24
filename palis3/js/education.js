$(function(){
    //$('title').html($('title').html()+getCookie('username'));
    $('#header').html($('#header').html()+getCookie('username'));
	addParticipants();
});
function addParticipants()
{
   var partTitle= $('#numParticipantsTitle');
   var count = 0;
   count += parseInt($('#MedPart').val(),10);
   count += parseInt($('#NursePart').val(),10);
   count += parseInt($('#AlliedPart').val(),10);
   count += parseInt($('#MixedPart').val(),10);
   partTitle.html('Number Of Participants: ('+count+')');
}
function loadEducationReport()
{
	var userId = getCookie('userid');
    loadYearSelect(function(){
        var yearParam = getParameterByName("year");
		var json = JSON.parse($('#yearSelectJSON').val());
        var yearId = $("#year").val();
        if(yearParam != null)
        {
            $("#year option").filter(function() {
                //may want to use $.trim in here
                return $(this).val() == yearParam; 
            }).attr('selected', true);
            yearId = yearParam;
            $('#year').selectmenu('refresh',true);
        }
        var username = getCookie('username');
		var year = json[yearId].fYear;
        loadReportInTable(app,'education','Education','fYear:'+year+';AddedById:'+userId);
        loadReportInTable(app,'education','SummaryEducation','fYear:'+year+';AddedById:'+userId);
    });
    removeTabs();
}
function loadMonthlyReport()
{
    loadMonthSelect(function(){
	var monthParam = getParameterByName("month");
	var month = JSON.parse($('#monthSelectJSON').val());
	var monthId = $("#month").val();
	var year = "";
	 if(monthParam != null)
        {
            $("#month option").filter(function() {
                //may want to use $.trim in here
                return $(this).val() == monthParam; 
            }).attr('selected', true);
		monthId=monthParam;
            $('#month').selectmenu('refresh',true);
        }
        var userId = getCookie('userid');
		var jsonMonth = month[monthId].MonthNum;
		var jsonYear = month[monthId].fYear;
        loadReportInTable(app,'education','MonthlyEducation','fYear:'+jsonYear+';fact_education.MonthNum:'+jsonMonth,function(rData1){
			loadReportInTable(app,'education','SummaryMonthlyEducation','fYear:'+jsonYear+';fact_education.MonthNum:'+jsonMonth,function(rData2){
				var clipData = loadMonthlyClipboardData(rData1,rData2);
				$('#clipMonthlyEducation').val(clipData);
			});
		});
        
		
		loadReportInTable(app,'education','MonthlyConsultationProvidersNc','fYear:'+jsonYear+';MonthNum:'+jsonMonth,function(rData1){
			loadReportInTable(app,'education','SummaryNonCaseBased','fYear:'+jsonYear+';MonthNum:'+jsonMonth,function(rData2){
				var clipData = loadMonthlyClipboardData(rData1,rData2);
				$('#clipMonthlyConsultationProvidersNc').val(clipData);
			});
		});
        
		
		loadReportInTable(app,'education','MonthlyConsultationProviders','fact_consultation.fYear:'+jsonYear+';fact_consultation.MonthNum:'+jsonMonth,function(rData1){
			loadReportInTable(app,'education','SummaryCaseBased','fact_consultation.fYear:'+jsonYear+';fact_consultation.MonthNum:'+jsonMonth,function(rData2){
				var clipData = loadMonthlyClipboardData(rData1,rData2);
				$('#clipMonthlyConsultationProviders').val(clipData);
			});
		});
		
		loadReportInTable(app,'education','SummaryDiagnosis','A.fYear:'+jsonYear+';A.MonthNum:'+jsonMonth,function(rData1){
			loadReportInTable(app,'education','SummaryDiagnosisTotal','A.fYear:'+jsonYear+';A.MonthNum:'+jsonMonth,function(rData2){
				var clipData = loadMonthlyClipboardData(rData1,rData2);
				$('#clipSummaryDiagnosis').val(clipData);
			});
		});
    });
    removeTabs();
}
function loadMonthlyClipboardData(d1,d2)
{
	var clipData = "";
	$(d1).each(function(i,dom){
		var j = 0;
		for(var prop in dom)
		{
			if(j>0)
				clipData += dom[prop]+"\t";
			j++;
		}
		clipData += "\r\n";
	});
	$(d2).each(function(i,dom){
		for(var prop in dom)
		{
				clipData += dom[prop]+"\t";
		}
		clipData += "\r\n";
	});
	return clipData;
}
function loadYearSelect(callback)
{
    getResultSet(app,'SummaryEducationYears','AddedById:'+getCookie('userid'),function(data){
        if(isJSONString(data))
        {
            $('#year').children().remove();
			$('#yearSelectJSON').val(data);
            var json = JSON.parse(data);
            for(i=0;i<json.length;i++)
            {
                $('#year').append($('<option value='+i+'>'+json[i].fYear+'</option>'));
            }
		$('#year').selectmenu("refresh");
            callback();
        }
    });
}
function loadMonthSelect(callback)
{
    getResultSet(app,'ListFactYearMonth','AddedById:'+getCookie('userid'),function(data){
        if(isJSONString(data))
        {
            $('#month').children().remove();
		$('#monthSelectJSON').val(data);
            var json = JSON.parse(data);
            for(i=0;i<json.length;i++)
            {
                $('#month').append($('<option value='+i+'>'+json[i].fYear+'-'+(json[i].MonthNme)+'</option>'));
            }
		$('#month').selectmenu("refresh");
            callback();
        }
    });
}
function changeReport()
{
   var year = $("#year").val();
   window.location = "Reports.html?year="+year;
}
function changeMonthReport()
{
   var month = $("#month").val();
   window.location = "ReportsMonthly.html?month="+month;
}
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
function isJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function education()
{
    var username = getCookie('username');
    var userid = getCookie('userid');
    var queryLabel = 'ListNonCaseForms';
    if(username == 'palisadmin')
        queryLabel = 'ListNonCaseForms';
    loadTabularData(app,'education',queryLabel,'AddedById:'+userid,function(){
        $('#mainData a').each(function(i,data){
            var jdata= $(data);
            var href=jdata.attr('href');
            var link=jdata.find('#fact_name').html()+'Form';
            jdata.attr('href',link+href);
            $(jdata.children()[0]).attr('onclick','window.location="'+link+href+'"');
        });
    });
    getResultSet(app,'getAvailableForms','user='+username,
    function(data)
    {
    if(isJSONString(data))
    {
        var json = JSON.parse(data);
        $('.availableForms').html('');
        $(json).each(function(i,row)
        {
            $('#availableForms').append('<li><a href="'+row.form_url+'" rel="external">'+row.form_name+'</a></li>');
        });
        $('#availableForms').listview('refresh');
    }
    });
    removeTabs();
}
function removeTabs()
{
    var username = getCookie('username');
    if(username == 'hmiloff')
    {
        $('#patientsTab').parent().removeClass('ui-grid-c');
        $('#patientsTab').parent().addClass('ui-grid-b');
        $('#patientsTab').remove();
		$(".ui-block-d").removeClass(".ui-block-d").addClass('ui-block-c');
    }
}