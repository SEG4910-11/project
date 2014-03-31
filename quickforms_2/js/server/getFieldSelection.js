define(function(){
quickforms.getFieldSelection = function(app,fact,field,id,callback){
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "GET",
		url: quickforms.quickformsUrl+'getFieldSelection'+quickforms.quickformsEnding,
		data: {app:app,
				factTable: fact,
				field: field,
				updateid : id || ""
				}
	});
	serverQuery.fakeData = '[{"id":"1","selected":"selected","label":"Not Specified"},{"id":"2","selected":"","label":"Audi"},{"id":"3","selected":"","label":"Volvo"}]';
	serverQuery.field = field;
	serverQuery.addSuccessListener(
		function(data){
			callback.call(me,serverQuery.field,data);
			});
	quickforms.serverQueries.push(serverQuery);
	serverQuery.run();
	return serverQuery;
	
};
});