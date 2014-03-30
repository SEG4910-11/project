define(function(){
quickforms.serverQueries = [];
quickforms.ServerQuery = function(params)
{
	if(!params) params = {};
	if(typeof params.contentType == 'undefined') params.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
	if(typeof params.processData == 'undefined') params.processData = true;
	this.params = params;
	this.successListeners = [];
	this.errorListeners = [];
	this.returnedData = "";
	this.run = function()
	{
		$.ajaxSetup({ cache: false });
		var me = this;
		if(quickforms.offline == false){
			if(quickforms.dataTransferType == 'jsonp' && this.params.method == 'POST') {this.params.method = 'GET'; this.params.data +="&debug=true";}
			$.ajax({
			  type: this.params.method,
			  url: this.params.url,
			  dataType: quickforms.dataTransferType,
			  data: this.params.data,
			  async: this.params.async || true,
			  contentType: this.params.contentType,
			  processData: this.params.processData,
			  success: function(data,status,xhr){
				me.success.call(me,data);
			  },
			  error: function(xhr, status, e){
				me.error.call(me,""+ e);
			  }
			});
		}
		else
		{
			window.setTimeout(function(){
				me.success.call(me,me.fakeData);
			},1);
		}
	};
	this.success = function(data)
	{
		this.returnedData = data;
		for(var i in this.successListeners)
		{
			this.successListeners[i](data);
		}
	};
	this.error = function(data)
	{
		for(var i in this.errorListeners)
		{
			this.errorListeners[i](data);
		}
	};
	this.addSuccessListener = function(func)
	{
		this.successListeners.push(func);
	}
	this.addErrorListener = function(func)
	{
		this.errorListeners.push(func);
	}
	quickforms.serverQueries.push(this);
};
});