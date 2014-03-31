
define(['dom/form/form',
	'server/getFieldSelection'],
function (){
	quickforms.TextElement = function(dom,formObj) // Create one of these for every control
	{
		quickforms.DomElement.call(this,dom); // super call to get parent attributes
		var me = this;
		this.parent = formObj;
                if(dom)
                {
                    this.currentVal = dom.val();
                    dom.on('change',function(eventData){
                            me.currentVal = $(this).val();     
                    });
                }
		this.serialize = function()
		{
			if(this.type=='password' && this.currentVal.length!=32) // dont double md5
			{
				return this.name+"="+md5(this.currentVal);
			}
			else
			{
				return this.name +"="+this.currentVal;
			}
		};
		this.summary = function()
		{
			if(!isNull(this.currentVal))
				return this.currentVal+"<br />";
			return '';
		};
                this.filter = function()
		{
			return this.name+'=\''+this.currentVal+'\'';
		};
		this.parseDom = function(formObj)
		{
                        var remembered = getCookie(formObj.id+this.name);
			if(!isNull(formObj.updateId))
			{
				this.dom.val(formObj.updateRow[this.name]);
				this.currentVal = formObj.updateRow[this.name];
			}
                        if(isNull(formObj.updateId) && !isNull(remembered))
			{
				this.dom.val(remembered);
				this.currentVal = remembered;
			}
			if(this.dom.attr("type") == 'password')
			{
				require(['helper/md5']);
				this.type='password';
			}
			formObj.addChild(this);
			window.setTimeout(function(){formObj.finishedParsing();},1);
		};
	};
	quickforms.form.domParsers.push(function(formObj){
		var texts = formObj.dom.find('input[type=text],input[type=hidden],textarea,input[type=password]');
		texts.each(function(i,tex){
			tex = $(tex);
			
			var texObj = new quickforms.TextElement(tex,formObj);
			texObj.parseDom(formObj);
		});
	});
	
});
