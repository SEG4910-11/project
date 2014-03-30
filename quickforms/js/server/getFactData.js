define(['server/server'],function(){
quickforms.getFakeFactData = '[{"id":1,"form":"test","Car Type":"Mazda","My Rating":"80%"},{"id":2,"form":"test","Car Type":"Volvo","My Rating":"90%"},{"id":3,"form":"test","Car Type":"Audi","My Rating":"40%"}]';
quickforms.getFactData = function (params) { // appName*, queryName, params*,whereclause*, callback
        params.appName = params.appName || quickforms.app;
        params.params = params.params || '';
        params.whereclause = params.whereclause || '' ;
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "GET",
		url: quickforms.quickformsUrl+'getResultSet'+quickforms.quickformsEnding,
		data: {app:params.appName,
                        queryLabel: params.queryName,
                        params: params.params,
                        whereclause: params.whereclause
                        }
	});
	serverQuery.fakeData = quickforms.getFakeFactData;
	serverQuery.addSuccessListener(
		function(data){
			params.callback.call(me,data);
			});
	serverQuery.addErrorListener(
		function(data){
			params.callback.call(me,data);
			});
	serverQuery.run();
	quickforms.serverQueries.push(serverQuery);
	return serverQuery;
}
});