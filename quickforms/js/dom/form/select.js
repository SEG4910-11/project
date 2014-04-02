
define(['dom/form/form',
	'server/getFieldSelection'],
function (){
	quickforms.SelectElement = function(dom,formObj,multiple) // Monitors select activity
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.multiple = multiple;
		this.parent = formObj;
		this.selectedField='';
		this.measure = dom.attr("measure");
                this.offline = dom.attr("offline");
		if(this.multiple==true)
				this.selectedField = [];
		dom.on('change',function(eventData){
			me.changeSelection();
		});
		this.changeSelection = function()
		{
			me.label = '';
			if(me.multiple==true)
			{
				me.selectedField = [];
				me.label = [];
			}
			me.dom.find(":selected").each(function () {
				if(me.multiple==false)
				{
					me.selectedField = $(this).val();
					me.label +=$(this).text() ;
				}
				else
				{
					me.selectedField.push($(this).val());
					me.label.push($(this).text());
				}
				
			});
		};
		this.serialize = function()
		{
			if(this.multiple)
			{
				var retVal = '';
				for(var i=0;i<this.selectedField.length;i++)
				{
					if(i>0) retVal+= "&";
					retVal += this.name+'='+this.selectedField[i];
				}
				return retVal;
			}
			if(isNull(this.selectedField))
				return '';
				
			var retVal = this.name+'='+this.selectedField;
			if(this.measure)
				retVal += this.name+'Measure='+this.label;
			return retVal;
		};
		this.summary = function(multi)
		{
			if(this.label)
			{
				if(this.multiple)
				{
					var multiLabel = "";
					for(var i in this.label)
					{
						multiLabel += this.label[i]+"<br />";
					}
					return multiLabel;
				}
				return this.label + "<br />";
			}
			return '';
		};
		this.filter = function()
		{
			if(this.measure)
				return this.name +'=\''+this.label+'\'';
			return this.name +'=\''+this.selectedField+'\'';
		};
	}
	quickforms.form.domParsers.push(function(formObj){
		
		var selects = formObj.dom.find('select');
		
		selects.each(function(i,sel){
			sel = $(sel);
			if(!isNull(sel.attr('name')))
			{
				var selObj = new quickforms.SelectElement(sel,formObj,sel.attr('multiple')=='multiple');
				formObj.addChild(selObj);
                                if(isNull(selObj.offline))
                                {
                                    selObj.query = quickforms.getFieldSelection.call(selObj,formObj.app,
											formObj.fact,
											sel.attr('name'),
											formObj.updateId,
											quickforms.addSelectAttributes);
                                }
                                else
                                {
                                    selObj.dom.attr("data-native-menu",quickforms.dataNativeMenu);
                                    selObj.dom.selectmenu('refresh');
                                    selObj.parent.finishedParsing();
                                }
			}
		});
	});
	quickforms.addSelectAttributes = function(fieldId,data)
	{
		var selectField = this; // selObj
		var parent = selectField.parent;
		selectField.remembered = getCookie(parent.id+selectField.name);
		quickforms.convertJSONtoSelect(selectField,data);
		
		selectField.dom.attr("data-native-menu",quickforms.dataNativeMenu);
		selectField.dom.selectmenu('refresh');
		parent.finishedParsing();
	}
	quickforms.convertJSONtoSelect = function(field,data)
	{
		if(isJSONString(data)){
			field.dom.children().remove();
			field.addedData = [];
			var json = JSON.parse(data);
			for(var i=0;i<json.length;i++)
			{
				if((!field.parent.updateId && field.multiple) || (!isNull(field.remembered) && isNull(field.parent.updateId)))
					json[i].selected = "";
				if(!isNull(field.remembered) && field.remembered == json[i].id && isNull(field.parent.updateId))
					json[i].selected = "selected";
				field.addedData.push({type:'option',
						id:json[i].id,
						selected:json[i].selected,
						label:json[i].label});
				field.dom.append($('<option value='+json[i].id+' '+json[i].selected+'>'+json[i].label+'</option>'));

				if(json[i].selected)
				{
					field.changeSelection();
				}
			}
		}
		else
		{
			if(data == ']')
				field.parent.finishedParsing();
			else
				throw data;
		}
	}
});
