//This function reload the page to be edited adding the edit button beside each select field
function design(){

	//Hide the top and bottom buttons that appear on the original form 
	$('div.buttons').hide();
	
	//add back button to go back to the original page
	$('div.buttons').before('<a href="#" rel="external" onClick="location.reload();" data-role="button" data-inline="true" data-icon="back" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-hover-c ui-btn-down-c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Back</span><span class="ui-icon ui-icon-back ui-icon-shadow">&nbsp;</span></span></a><br/>');
	
	//Add the edit button (pencil icon) beside each select field
	$('div.ui-select').each(function(){
        var thisDom = $(this);
        var domId = thisDom.attr("id");
	    thisDom.before('<a href="#" rel="external" onclick="" data-role="button" data-inline="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-theme="c" class="ui-btn ui-btn-inline ui-shadow ui-btn-corner-all ui-btn-hover-c ui-btn-down-c"><span class="button-ui"><span class="ui-icon ui-icon-gear ui-icon-shadow"></span></span></a>')});
	
}