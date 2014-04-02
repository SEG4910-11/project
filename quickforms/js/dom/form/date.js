
define(['dom/form/form','dom/form/text',
	'jquery/jquery-ui-1.10.3.custom.min'],
function (){
	quickforms.form.domParsers.push(function(formObj){
		//$('#ui-datepicker-div').remove(); // delete old datepicker div to fix z-value
		quickforms.loadCss('jquery/jquery-ui-1.10.3.custom.min.css');
		var dateDom = formObj.dom.find('input.date');
		dateDom.datepicker();
		
		var dateDiv = $('#ui-datepicker-div'),
			dateParent = dateDiv.parent();
		if(dateDom.length>0 && dateDiv.index()+1 < dateParent.children().length)
		{
			dateDom.datepicker('destroy');
			dateDom.removeClass('hasDatepicker')
			dateDiv.remove();
			dateDom.datepicker();
		}
	});
        quickforms.extendClass('TextElement',function(texObj){
            var oldFilter = texObj.filter;
            texObj.filter = function(){
                if(texObj.dom.hasClass('date'))
                {
                    return 'convert(varchar,'+texObj.name+',101)'+"='"+texObj.dom.val()+"'";
                }
                else
                {
                    return oldFilter();
                }
            }
        });
});
