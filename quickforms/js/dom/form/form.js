define(['server/putFact','server/getFactData'],function(){
quickforms.form = {
	domParsers : []
};
quickforms.FormElement = function(dom,app,fact) // Maintains all QF's form objects
{
	quickforms.DomElement.call(this,dom); // super call to get parent attributes
	this.children = [];
        this.childMap = {};
	this.app = app || quickforms.app;
	this.fact = fact;
	this.type="mainForm";
	this.childrenFinished = 0;
        this.completedListeners = [];
	this.updateSummary = function()
	{
		var summary = "",
			summaryDom = $('#'+this.summaryId);
		if(summaryDom.length>0)
		{
			for(var child in this.children)
			{
				summary += this.children[child].summary();
			}
			summaryDom.html(summary);
		}
	};
	this.serialize = function()
	{
		var formSerialized = "",
			childAdded = [];
		for (var i=0;i<this.children.length;i++)
		{
			var child = this.children[i],
				childSerial = child.serialize();
			if(isNull(childSerial) == false)
				childAdded.push(childSerial);
				//formSerialized += childSerial;
		}
		for(var i=0;i<childAdded.length;i++)
		{
			if(i>0)
				formSerialized += "&";
			formSerialized += childAdded[i];
		}
		return formSerialized;
	};
	this.finishedParsing = function()
	{
		this.childrenFinished +=1;
		this.checkLoadingGif();
	};
	this.checkLoadingGif = function()
	{
		if(this.childrenFinished == this.children.length)
		{
			quickforms.hideLoadingGif();
                        for(var i=0;i<this.completedListeners.length;i++)
                        {
                            this.completedListeners[i]();
                        }
		}
		this.updateSummary();
	}
	this.scrubFormDataString = function(data)
	{
		data = data.replace("&&","&");
		if(data.charAt(data.length-1) == "&")
			data = data.substring(0,data.length-1);
		return data;
	};
        this.addChild = function(child)
        {
            this.children.push(child);
            this.childMap[child.dom[0].id] = child;
        };
	this.getUpdateRow = function(callback)
	{
		var me = this;
		if(isNull(this.updateId))
		{
			callback.call(quickforms);
		}
		else
		{
                        var queryLabel = this.fact+"_get_row";
                        var prms = "updateId="+this.updateId;
			quickforms.getFactData({queryName:queryLabel, 
                                                params:prms,
                                                callback: function(data){
                                                    me.updateRow = JSON.parse(data)[0];
                                                    callback.call(quickforms);
                                                }
                                            });
		}
	}
};
quickforms.parseForm = function(params)//formId,app,fact
{
	var formDom = $('#'+params.formId);
	quickforms.app = params.app || quickforms.app;
	var formObj = new quickforms.FormElement(formDom,quickforms.app,params.fact);
	formObj.updateId = getParameterByName('id');
	formObj.id = 'currentForm'+params.formId;
	quickforms.initLoadingGif();
	
	formObj.getUpdateRow(function(){
		for (var i=0;i<this.form.domParsers.length; i++)
		{
			this.form.domParsers[i](formObj);
		}
		formObj.checkLoadingGif();
	});
	quickforms[formObj.id] = formObj;
	quickforms.loadCss("quickforms/form.css");
};
quickforms.putFact = function(context, redirect)
{
	context = $(context);
	context.attr('html','');
	var formId = context.parents('form')[0].id;
	var formObj = quickforms['currentForm'+formId];
	var formSerialized = "app="+formObj.app+"&";
	quickforms.redirectUrl = redirect;
	
	formSerialized += "factTable="+formObj.fact+"&updateid="+formObj.updateId+"&";
	formSerialized += formObj.serialize();
	formSerialized = formObj.scrubFormDataString(formSerialized);
	
	quickforms.putFactServer.call(formObj,formSerialized,quickforms.formRedirect);
	if(quickforms.offline)
	{
		$.mobile.activePage.append('<div id="offlineInfo">Data sent to server : <br />'+formSerialized+'</div>');
		window.setTimeout(function(){$('#offlineInfo').remove()},5000);
	}
};
quickforms.formRedirect = function(data)
{
	if(quickforms.redirectUrl != null)
	{
		var json = JSON.parse(data);
		window.location = quickforms.redirectUrl+"?rowId="+json[0].id;
		
		//$.mobile.changePage(quickforms.redirectUrl+"?id="+json[0].id);
	}
	
};
});