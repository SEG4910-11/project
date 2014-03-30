define(function(){
quickforms.getLookupCsv = function(app,field, filter){
	var me = this; // caller
        filter = filter || '';
	var serverQuery = new quickforms.ServerQuery({
		method: "GET",
		url: quickforms.quickformsUrl+'getLookupCsv'+quickforms.quickformsEnding,
		data: {app:app,
				field: field,
				filter:filter}
	});
	var hiddenIFrameID = 'hiddenDownloader',
		iframe = $("#"+hiddenIFrameID);
	if (iframe.length==0) {
		iframe = $('<iframe></iframe>');
		iframe[0].id = hiddenIFrameID;
		iframe[0].style.display = 'none';
		document.body.appendChild(iframe[0]);
	}
	quickforms.serverQueries.push(serverQuery);
	if(quickforms.offline == false){
		iframe.attr('src',serverQuery.params.url+'?app='+app+'&field='+field+'&filter='+filter);
	}
	
};
});
