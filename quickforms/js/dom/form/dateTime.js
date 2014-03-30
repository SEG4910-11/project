
define(['dom/form/form','dom/form/text',
	'jquery/jquery-ui-1.10.4.custom.min'],
function (){
	quickforms.form.domParsers.push(function(formObj){
		quickforms.loadCss('jquery/jquery-ui-1.10.3.custom.min.css');
		quickforms.loadCss('jquery/jquery.time.addon.css');
		require(['jquery/jquery-ui-timepicker-addon'],function(){
			var dateDom = formObj.dom.find('input.dateTime');
			dateDom.datetimepicker({
				ampm: true
			});
		});
	});
        /*quickforms.extendClass('TextElement',function(texObj){
            var oldFilter = texObj.filter;
            texObj.filter = function(){
                if(texObj.dom.hasClass('datTime'))
                {
                    var datePart = 'convert(varchar,'+texObj.name+',101) + \' \'+';
                    var timePart = 'convert(varchar,DATEPART(hour,'+texObj.name+')) + \':\'+convert(varchar,DATEPART(minute,'+texObj.name+'))';
                    return datePart+timePart+"='"+texObj.dom.val()+"'";
                }
                else
                {
                    return oldFilter.call(texObj);
                }
            }
        });*/
});
