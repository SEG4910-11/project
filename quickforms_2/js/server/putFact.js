define(function(){
quickforms.putFactServer = function(data,callback){
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "POST",
		url: quickforms.quickformsUrl+'putFact'+quickforms.quickformsEnding,
		data: data,
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
