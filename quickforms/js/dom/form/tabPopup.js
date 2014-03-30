define(['dom/form/form'],function(){
	quickforms.TabPopupElement = function(dom,formObj) // Create one of these for every control
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.parent = formObj;
		this.tabs = [];
		this.serialize = function()
		{
			return quickforms['currentForm'+this.formId].serialize();
		};
		this.summary = function(){
			var thisForm = $('#'+this.formId);
			var summary = "";
			for(var child in thisForm.children)
			{
				summary += thisForm.children[child].summary();
			}
			return summary;
		};
		this.appendButtons = function(newPageChild)
		{
			var parentPageId = this.parentPage.attr("id");
			var qformId = 'currentForm'+this.formId;
			var buttonsDiv = $('<div class="buttons"></div>');
			buttonsDiv.append('<a href="#'+parentPageId+'" data-role="button" data-inline="true" data-icon="back">Back</a>');
			buttonsDiv.append('<a href="#'+parentPageId+'" onclick="quickforms[\''+qformId+'\'].updateSummary()" data-role="button" data-inline="true" data-theme="b" data-icon="check">Submit</a>');
			newPageChild.append(buttonsDiv);
			newPageChild.prepend(buttonsDiv.clone(true));
			//newPageChild.prepend('<a href="#'+parentPageId+'" onclick="quickforms[\''+qformId+'\'].updateSummary()" data-role="button" data-inline="true" data-theme="b" data-icon="check">Submit</a>');
			//newPageChild.prepend('<a href="#'+parentPageId+'" data-role="button" data-inline="true" data-icon="back">Back</a>');
		};
		this.registerTabs = function(){
			var me = this;
			var lis = this.newPage.find("[data-role='navbar'] li a");
			lis.each(function(i,li){
				li = $(li);
				var tabObj = {};
				tabObj.dom = li;
				tabObj.childDivId = li.attr('href');
				li.parent().click(me.changeTabs);
				me.tabs.push(tabObj);
			});
			this.changeTabs({target:lis.first()[0]});
		};
		this.changeTabs = function(event)
		{
			var dom = $(event.target).closest('a');
			//var me = dom[0].parentObj;
			for(var i=0;i<me.tabs.length;i++)
			{
				var tab = me.tabs[i];
				if(tab.childDivId == dom.attr('href'))
				{
					$(tab.childDivId).show();
				}
				else
				{
					$(tab.childDivId).hide();
					tab.dom.removeClass('ui-btn-active');
				}
			}
			//window.clearInterval(me.tabCssInt);
			me.tabCssInt = window.setTimeout(function(){
				dom.addClass('ui-btn-active');
			},1);
		}
	}
	quickforms.form.domParsers.push(function(formObj){
		formObj.dom.find('.tabPopup').each(function(i,dom){
			dom = $(dom);
			
			var tabPopup = new quickforms.TabPopupElement(dom,formObj);
			formObj.addChild(tabPopup);
			tabPopup.href = dom.attr("href"); 
			tabPopup.id = tabPopup.href.substring(0,tabPopup.href.indexOf("."));
			tabPopup.parentPage = dom.parents('[data-role="page"],[data-role="dialog"]');
			tabPopup.pageId = "#"+tabPopup.id;
			tabPopup.formId = tabPopup.id+"_form";
			$(document).one('pageinit', tabPopup.pageId, function(){
				tabPopup.newPage = $(tabPopup.pageId);
				
				var newPageChild = tabPopup.newPage.children().first();
				
				//newPageChild.css('background','white');
				//newPageChild.css('max-width' ,'700px');
				newPageChild.addClass('ui-body-c')
				tabPopup.appendButtons(newPageChild);
				tabPopup.registerTabs();
				newPageChild.wrapInner("<form id='"+tabPopup.formId+"'></form>");
				quickforms.parseForm({"formId":tabPopup.formId,
									"app":formObj.app,
									"fact":formObj.fact});
				
				var newFormObj = quickforms['currentForm'+tabPopup.formId];
				newFormObj.summaryId = tabPopup.id+'_summary';
				newFormObj.type="dialogForm";
				formObj.finishedParsing();
				tabPopup.newPage.trigger('create',true);
				tabPopup.newPage.unbind('pageinit');
				
			});
			$.mobile.loadPage(tabPopup.href,{prefetch:true});
			
			dom.after('<div id="'+tabPopup.id+'_summary" class="ui-body ui-body-b"></div>');
			dom.attr("href","");
			dom.on("click",function(){
				$.mobile.changePage(tabPopup.href);
			});
		});
	});
});