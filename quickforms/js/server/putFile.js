define(function(){
quickforms.putFile = function(data,callback){
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "POST",
		url: quickforms.quickformsUrl+'putFile'+quickforms.quickformsEnding,
		contentType:false,
		processData: false,
		data: data,
		async:false
	});
	serverQuery.fakeData = '[{"id":4}]';
	serverQuery.addSuccessListener(
		function(data){
			if(callback)
				callback.call(me,data);
			});
	serverQuery.addErrorListener(
		function(data){
			if(callback)
				callback.call(me,'Error : '+data);
			});
	serverQuery.run();
	quickforms.serverQueries.push(serverQuery);
	return serverQuery;
	
};
});
