define(['dom/form/form'],function(){
quickforms.filterControl = function(url,divId){
    this.url = url;
    this.divId = divId;
    this.form = '';
    this.dom = $("#"+divId);
	var me = this;
    this.appendButtons = function(page){
        var parentPageId = this.parentPage.attr("id");
        var buttonsDiv = $('<div class="buttons"></div>');
        buttonsDiv.append('<a href="#'+parentPageId+'" onclick="quickforms.cancelFilter(\''+this.divId+'\')" data-role="button" data-inline="true" data-icon="back">Back</a>');
        buttonsDiv.append('<a href="#'+parentPageId+'" onclick="quickforms.updateFilter(\''+this.divId+'\')" data-role="button" data-inline="true" data-theme="b" data-icon="check">Filter</a>');
        buttonsDiv.append('<a href="#'+parentPageId+'" onclick="quickforms.clearFilter(\''+this.divId+'\')" data-role="button" data-inline="true"  data-icon="delete">Clear</a>');
        page.append(buttonsDiv);
        page.prepend(buttonsDiv.clone(true));
    };
	this.createFilterButton = function(){
		setTimeout(function(){ // timeout so table has time to load
			me.button = $('<a class="previous paginate_button paginate_button_disabled" style = "position:absolute;left:48%;top:35px">Filter</a>');
			$('#'+me.divId+'_paginate').prepend(me.button);
			me.button.on("click",function(){
					$.mobile.changePage(me.url);
			});
		},1);
	};
	this.scrubSerial = function(serial)
	{
		if(serial.endsWith('and '))
			serial = serial.substr(0,serial.length - 4);
		serial = serial.replace('and  and','and');
		return serial;
	};
};
quickforms.createFilter = function(url,divId)
{
	var dialogId = url.substring(0,url.indexOf(".")),
		filterObj = new quickforms.filterControl(url,divId);
	if($('#'+dialogId).length<=0) // sometimes called twice
	{
		filterObj.id = filterObj.url.substring(0,filterObj.url.indexOf("."));
		filterObj.parentPage = filterObj.dom.parents('[data-role="page"],[data-role="dialog"]');
		filterObj.pageId = "#"+filterObj.id;
		filterObj.formId = filterObj.id+"_form";
		$(document).one('pageinit', filterObj.pageId, function(){
				filterObj.newPage = $(filterObj.pageId);
				var newPageChild = filterObj.newPage.children().first();
				quickforms.tableControl.list[divId]['filter'] = filterObj;
				newPageChild.addClass('ui-body-c');
				filterObj.appendButtons(newPageChild);
				newPageChild.wrapInner("<form id='"+filterObj.formId+"'></form>");
				
				quickforms.parseForm({"formId":filterObj.formId,
														"app":quickforms.app,
														"fact":"filter"+filterObj.id});
				var newFormObj = quickforms['currentForm'+filterObj.formId];
				newFormObj.type="dialogForm";
				filterObj.form = newFormObj;
				newFormObj.tableId = divId;
				newFormObj.completedListeners.push(function(){quickforms.updateFilter(divId);});
				filterObj.newPage.trigger('create',true);
				filterObj.newPage.unbind('pageinit');
		});
		$.mobile.loadPage(filterObj.url,{prefetch:true});
	}
};
quickforms.updateFilter = function(divId){
	var tableControl = quickforms.tableControl.list[divId],
		form = tableControl.filter.form,
		serial = '';
	tableControl.oldWhereclause = tableControl.oldWhereclause || tableControl.params.whereclause;
	for(var i in form.children)
	{
		var child = form.children[i];
		if(child.dom.parents('div[class*="range"]').length == 0 && child.included)
		{
			if(i>0 || tableControl.oldWhereclause.length>0)
				serial +=" and ";
			if(child.dom.hasClass('date'))
			{
				serial += 'convert(varchar,'+child.name+',101)'+"='"+child.dom.val()+"'";
			}
			else if(child.dom.hasClass('range'))
			{
				if(child.left.val())
				{
					serial += child.left.attr('name')+">='"+child.left.val()+"'";
				}			
				if(child.right.val())
				{
					if(child.left.val())
						serial += " and ";
					serial += child.right.attr('name')+"<='"+child.right.val()+"'";
				}
			}
			else 
			{
				serial += child.name+"='"+child.dom.val()+"'";
			}
		}
	}
	serial = tableControl.filter.scrubSerial(serial);
	//$('#ui-datepicker-div').remove();
	tableControl.params.whereclause = tableControl.oldWhereclause + serial;
	var oldCallback = tableControl.params.callback;
	tableControl.params.callback = function(){
		oldCallback();
		tableControl.filter.createFilterButton();
	};
	quickforms.loadTable(tableControl.params);
	
};
quickforms.clearFilter = function(divId){
        
        var tableControl = quickforms.tableControl.list[divId],
        filter = tableControl.filter;
		filter.newPage.dialog("close");
		for(var i=0;i<filter.form.children.length;i++)
		{
			var child = filter.form.children[i];
			setCookie(child.parent.id + child.name,'',1);
		}
        window.setTimeout(function(){
			filter.newPage.remove();
			$(document).one('pageinit', filter.pageId, function(){
				$.mobile.changePage(filter.url);	
			});
			quickforms.createFilter(filter.url,filter.divId);
        },50);
};
quickforms.cancelFilter = function(divId)
{
	//$('#ui-datepicker-div').remove();
	var tableControl = quickforms.tableControl.list[divId];
	quickforms.loadTable(tableControl.params);
};
quickforms.form.domParsers.push(function(formObj){
    
    $('div[class="range"]').each(function(i,dom){
        dom = $(dom);
		
		var rangeCheck = $('<input type="checkbox" data-inline="true"/>');
		rangeCheck.checkboxradio();
        var rangeObj = new quickforms.RangeElement(dom,formObj);
        rangeObj.left = $(rangeObj.dom.find("input,select")[0]);
        rangeObj.right = $(rangeObj.dom.find("input,select")[1]);
		dom.on('click',function(){
			rangeObj.included = true;
			var label = $('label[for="'+rangeObj.dom[0].id+'"]');
			if(label.length>0)
			{
				if(label[0].innerHTML.indexOf("Included")==-1)
					label[0].innerHTML += " (Included)";
			}
		});
		
        formObj.addChild(rangeObj);
		window.setTimeout(function(){formObj.finishedParsing();},1);
    });
	formObj.completedListeners.push(function(){
		for(var i in formObj.children)
		{
			var child = formObj.children[i];
				
			child.dom.on('change',function(){
				var obj = formObj.childMap[$(this)[0].id];
				obj.included = true;
				var label = $('label[for="'+obj.dom[0].id+'"]');
				if(label.length>0)
				{
					if(label[0].innerHTML.indexOf("Included")==-1)
						label[0].innerHTML += " (Included)";
				}
			});
			if(!isNull(getCookie(formObj.id+child.name)))
				child.dom.trigger('change');
		}
		var tableControl = quickforms.tableControl.list[formObj.tableId],
			filter = tableControl.filter;
		filter.completed = true;
	});
});
quickforms.RangeElement = function(dom,formObj)
{
	quickforms.DomElement.call(this,dom); // super call to get parent attributes
	var me = this;
	this.parent = formObj;
	this.serialize = function()
	{
		return '';
	};
	this.summary = function()
	{
		return '';
	};
};
});