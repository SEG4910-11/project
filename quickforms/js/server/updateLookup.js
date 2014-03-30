define(function(){
quickforms.updateLookupServer = function(app,lookup,values,callback){
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "POST",
		url: quickforms.quickformsUrl+'updateLookup'+quickforms.quickformsEnding,
		data: {app:app,lookup:lookup,values:values},
		async:false
	});
	serverQuery.fakeData = '[{"id":4}]';
	serverQuery.addSuccessListener(
		function(data){
			callback.call(me,data);
			});
	serverQuery.run();
	quickforms.serverQueries.push(serverQuery);
	return serverQuery;
	
};
});
