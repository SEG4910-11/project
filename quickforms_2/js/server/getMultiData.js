define(function(){
quickforms.getMultiData = function (appName,fact, field, lookup,updateId, callback) {
	var me = this; // caller
	var serverQuery = new quickforms.ServerQuery({
		method: "GET",
		url: quickforms.quickformsUrl+'getMultiData'+quickforms.quickformsEnding,
		data: {app:appName,
				fact: fact,
				field: field,
				lookup: lookup,
				updateid:updateId
				}
	});
	serverQuery.fakeData = '[{"coursesSemester":"Fall","coursesCategory":"ADM3313","coursesLabel":"Entrepreneurial Mind: New Venture Creation","coursesKey":"13","coursesType":"other","coursesOrder":"1","selected":""},{"coursesSemester":"Fall","coursesCategory":"HIS2129","coursesLabel":"Technology, Society and Environment since 1800 *","coursesKey":"14","coursesType":"other","coursesOrder":"1","selected":""},{"coursesSemester":"Fall","coursesCategory":"PHY1122","coursesLabel":"Fundamentals of Physics II *","coursesKey":"15","coursesType":"eng","coursesOrder":"1","selected":""},{"coursesSemester":"Winter","coursesCategory":"SEG3103","coursesLabel":"Software Quality Assurance *","coursesKey":"16","coursesType":"required","coursesOrder":"1","selected":""}]';
	if(callback){
		serverQuery.addSuccessListener(
			function(data){
				callback.call(me,data);
				});
	}
	serverQuery.run();
	quickforms.serverQueries.push(serverQuery);
	return serverQuery;
};
});