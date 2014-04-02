
define(['dom/form/form'],
function (){
	quickforms.CheckboxElement = function(dom,formObj,label) // Monitors checkbox activity
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.parent = formObj;
		this.label = label;
		this.selectedField = -1;
		dom.on('change',function(eventData){
			me.changeSelection($(this));
			quickforms.form.updateRadios(me.parent,me.name);
		});
		if(dom.attr('type') == "radio")
		{
			var legendDom = dom.parents('fieldset').find('legend');
			this.label = legendDom.text() + ': '+this.label;
			formObj.radioGroups = formObj.radioGroups || {}
			formObj.radioGroups[this.name] = formObj.radioGroups[this.name] || [];
			formObj.radioGroups[this.name].push(this);
		}
		this.changeSelection = function(check)
		{
			if(check.is(":checked") == true) {
			    me.selectedField = check.val();   
				me.checked = true;
			}
			else{
				me.checked = false;
				me.selectedField = 0;
			}
			
		};
		this.serialize = function(multiple)
		{
			if(multiple)
				return this.name+'='+this.selectedField;
			else
			{
				if(this.checked)
					return this.name+'='+this.selectedField;
			}
			return '';
		};
		this.summary = function(multiple)
		{
			if(multiple && this.checked == true)
			{
				return this.label;
			}
			if(this.checked == true){
			
				return this.label + "<br />";
			}
			return '';
		};
	}
	quickforms.form.domParsers.push(function(formObj){
		
		var checks = formObj.dom.find('input[type="checkbox"],input[type="radio"]');
		
		checks.each(function(i,chek){
			chek = $(chek);
			if(!isNull(chek.attr('name')))
			{
				var checkLabel = chek.siblings('label[for="'+chek.attr('id')+'"]');
				
				var chekObj = new quickforms.CheckboxElement(chek,formObj,checkLabel.text());
				
				if((!isNull(formObj.updateId) && formObj.updateRow[chekObj.name] == chek.val())
                                        || (getCookie(formObj.id+chekObj.name) == chek.val() && isNull(formObj.updateId)) )
				{
					chek.attr('checked','checked');
					chekObj.changeSelection(chek);
				}
				chek.checkboxradio('refresh');
				formObj.addChild(chekObj);
				window.setTimeout(function(){formObj.finishedParsing();},1);
			}
		});
		for(var name in formObj.radioGroups)
		{
			quickforms.form.updateRadios(formObj,name);
		}
	});
	quickforms.form.updateRadios = function(formObj,name)
	{
		if(formObj.radioGroups)
		{
			var radGroup = formObj.radioGroups[name];
			if(!isNull(radGroup))
			{
				for(var i = 0; i< radGroup.length;i++)
				{
					radGroup[i].dom.checkboxradio('refresh');
					radGroup[i].changeSelection(radGroup[i].dom);
				}
			}
		}
	};
});
