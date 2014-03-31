define(function(){
quickforms.domElements = [];
quickforms.DomElement = function(dom) // Create one of these for every control
{
	var me = this;
	this.dom = dom;
	if(dom)
	{
		this.name = dom.attr("name");
		if(dom.attr("remember")=="")
		{
			dom.on('change',function(){
				setCookie(me.parent.id+me.name,$(this).val(),quickforms.rememberLength);
			})
		}
	}
	this.addedData = [];
	this.onChange = function(){};
	this.onBlur = function(){};
	quickforms.domElements.push(this);
	this.summary = function(){return this.name}
	
}
});