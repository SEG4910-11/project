define(function(){
//$('html').addClass('ui-mobile-rendering');
quickforms.loadNav = function(url,divId, callback)
{
	$.ajax({
	  url: url,
	  success: function(html){
		successNav(html);
                if(callback)
                    callback();
	  }
	});
	function successNav(html)
	{
		var navDiv = $('#'+divId);
		navDiv.append(html);
		
		var pathname = filterPathName(window.location.pathname);
		var isInd = isIndex(pathname);
		navDiv.find('a').each(function(i,dom){
			var href = filterPathName(dom.href);
			if(href == pathname || (isInd && href.indexOf('index')>=0))
				$(dom).addClass('ui-btn-active ui-state-persist');
		});
		
		navDiv.trigger('create');
		//$('html').removeClass('ui-mobile-rendering');
	}
	function isIndex(pathname)
	{	
		var p = pathname;
		if (p.length === 0 || p === "/" || p.match(/^\/?index/) || p.charAt(p.length-1) === "/")
			return true;
		return false;
	}
	function filterPathName(path)
	{
		var curInd = path.indexOf('/');
		while(curInd>=0)
		{
			path = path.substr(curInd+1,path.length-1);
			curInd = path.indexOf('/');
		}
		return path;
	}
};
});