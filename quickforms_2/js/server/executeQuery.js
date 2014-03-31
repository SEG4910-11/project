define(['server/server'],function(){
quickforms.executeQuery = function (appName, queryLab, prms, callback) {
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "GET",
		url: quickforms.quickformsUrl+'executeQuery'+quickforms.quickformsEnding,
		data: {app:appName,
				queryLabel: queryLab,
				params: prms
				}
	});
	serverQuery.fakeData = quickforms.getFakeFactData;
	serverQuery.addSuccessListener(
		function(data){
			callback.call(me,data);
			});
	serverQuery.addErrorListener(
		function(data){
			callback.call(me,data);
			});
	serverQuery.run();
	quickforms.serverQueries.push(serverQuery);
	return serverQuery;
}
});