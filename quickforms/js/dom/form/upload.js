
define(['dom/form/form','server/putLookup','server/getLookupCsv'],
function (){
	quickforms.FileElement = function(dom,formObj) // Create one of these for every control
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.parent = formObj;
		this.file = "";
		this.lookup="";
                this.filter=getParameterByName('filter') ||'';
		dom.on('change',function(eventData){
			me.changeSelection($(this));
		});
		this.changeSelection = function(file)
		{
			$(file[0].files).each(function(i,file){
				me.file = file;
			});
		};
		this.serialize = function(multiple)
		{
			
			return '';
		};
		this.summary = function(multiple)
		{
			
			return '';
		};
		this.downloadMostRecent = function()
		{
			quickforms.getLookupCsv(quickforms.app,this.lookup,this.filter);
		};
	}
	quickforms.form.domParsers.push(function(formObj){
		var fileDom = formObj.dom.find('input[type="file"]');
		fileDom.each(function(i,dom){
			dom = $(dom);
			var fileObj = new quickforms.FileElement(dom,formObj);
			formObj.addChild(fileObj);
			window.setTimeout(function(){formObj.finishedParsing();},1);
		});
	});
	quickforms.putLookup = function(context, lookup)
	{
		var form = $(context).parents("form").attr("id"),
			formObj = quickforms['currentForm'+form],
			fileData = new FormData(),
			uploadObj;

		for(var i in formObj.children)
		{
			var child = formObj.children[i];
			if(child.file)
			{
				uploadObj = child;
				fileData.append('csvFile',child.file)
				if(!lookup)
					lookup = child.file.name.replace(".csv","");
				uploadObj.lookup=lookup;
			}
		}
		fileData.append('app',quickforms.app);
		fileData.append('field',lookup);
                fileData.append('filter',uploadObj.filter);
		quickforms.initLoadingGif();
		quickforms.putLookupServer(fileData,function(data){
			quickforms.hideLoadingGif();
			if(data.indexOf('Error')>=0)
				quickforms.toast(data);
			else
			{
				window.setTimeout(function(){uploadObj.downloadMostRecent();},1000);
				quickforms.toast("CSV File Successfully Uploaded");
			}
			//toast.fadeIn(400).delay(2000).fadeOut(400);
		});

		return false;
	}
});
