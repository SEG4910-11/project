var quickforms = new function(){
	this.quickformsUrl = document.getElementsByTagName('script')[0].src.replace('js/require.min.js','');
	this.jsUrl = this.quickformsUrl+"js/";
	this.cssUrl = this.quickformsUrl+"css/";
	this.cssUrls = [];
	this.addedFolders = {};
	this.baseScripts = [
				"server/server",
				"dom/dom",
				"helper/helper"
			];
	this.onReady = function(){};
	this.mixin = function(obj1,obj2){
		for(var obj2Prop in obj2)
		{
			obj1[obj2Prop] = obj2[obj2Prop];
		}
	};
	this.registerReadyFunction = function(func)
	{
		if(quickforms.ready == true)
			func();
		quickforms.onReady = func;
	};
	this.extendClass = function(className,extender)
	{
		var OldClass = quickforms[className];
		quickforms[className] = function(){
			var obj = new OldClass();
			OldClass.apply(obj,arguments);
			extender(obj);
			return obj;
		};
	};
	this.loadCss = function(url) {
		if(!this.cssUrls[url])
		{
			this.cssUrls.push(url);
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			url += '?bust='+quickforms.build;
			if(url.charAt(0) != '/')
				link.href = this.cssUrl+url;
			else
				link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		}
	};
	this.tryModule = function(url,callback)
	{
		var oldErrorHandle = requirejs.onError,
			newErrorHandle = function(data){
				requirejs.onError = oldErrorHandle;
				callback(data);
			};
		requirejs.onError = newErrorHandle;
		require([url],newErrorHandle);
	};
	this.initLoadingGif = function(maxTime)
	{
            maxTime = maxTime || 5000;
		if(this.offline == false)
		{
			if(this.loadingCounter == null)
				this.loadingCounter = 0;
			this.loadCss('quickforms/loadingGif.css');
			$('body').append('<div class="content-blocker" id="content-blocker'+this.loadingCounter+'"><img src="'+this.cssUrl+'quickforms/images/loading.gif" class="loading-gif"></img></div>');
			this.loadingCounter +=1;
			window.setTimeout(function(){
				if($('.content-blocker').length>0)
				{
					quickforms.toast("Error. Please see JavaScript log");
					quickforms.hideLoadingGif();
				}
			},maxTime);
		}
	};
	this.hideLoadingGif = function()
	{
		if(this.offline == false)
		{
			if(this.hideCounter == null)
				this.hideCounter = 0;
			$(".content-blocker").first().remove();
			this.hideCounter += 1;
		}
	};
	this.toast = function(msg)
	{
		$("<div class='ui-loader ui-overlay-shadow ui-body-a ui-corner-all'><h3>"+msg+"</h3></div>")
			.css({ display: "block", 
				opacity: 0.90, 
				position: "fixed",
				padding: "7px",
				"text-align": "center",
				width: "270px",
				left: ($(window).width() - 284)/2,
				top: $(window).height()/2 })
			.appendTo( $.mobile.pageContainer ).delay( 2500 )
			.fadeOut( 400, function(){
				$(this).remove();
			});
	};
	this.configureCss = function()
	{
            if(this.jqueryMobileEnable)
            {
		this.loadCss("jquery/"+this.jqueryMobileCss);
		if(this.jqueryMobileTheme != "")
			this.loadCss(this.jqueryMobileTheme);
		if(this.jqueryUITheme != "")
			this.loadCss(this.jqueryUITheme);
            }
	};
};
window.quickforms = quickforms;

require([quickforms.jsUrl+'/helper/config.js'],function(config){
	var datetime = (new Date()).getTime();
	quickforms.tryModule("js/config.js?"+datetime,function(appConfig){
		if(appConfig instanceof Error == false)
		{
			quickforms.mixin(config,appConfig);
		}
		if(config.debug == true){config.build=datetime;}
		quickforms.mixin(quickforms,config);
		quickforms.configureCss();
		quickforms.baseScripts = quickforms.baseScripts.concat(quickforms.extraScripts);
		require.config( {
			baseUrl: quickforms.jsUrl,
			// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.3.min")
			paths: {
				// Core Libraries
				"jq": quickforms.jsUrl+"jquery/jquery-"+config.jqueryVersion,
				"jqm": quickforms.jsUrl+"jquery/jquery.mobile-"+config.jqueryMobileVersion
			},
			packages : [
				{name : "dom", location: quickforms.jsUrl+"dom"},
				{name : "server", location: quickforms.jsUrl+"server"},
				{name : "helper", location: quickforms.jsUrl+"helper"},
				{name : "jquery", location: quickforms.jsUrl+"jquery"},
				{name : "google", location: quickforms.jsUrl+"google"},
				{name : quickforms.app, location: "/"+quickforms.app}
			],
			// Sets the configuration for your third party scripts that are not AMD compatible
			shim: {
				"jqm": {
					  "deps": [ "jq"]
				}
			},// end Shim Configuration
			urlArgs: "bust="+config.build
		} );
		require([ "jq"], function() {
                        if(config.jqueryMobileEnable)
                        {
                            $(document).bind("mobileinit", function() {
                                    $.mobile.selectmenu.prototype.options.nativeMenu = config.dataNativeMenu;
                                    $.mobile.page.prototype.options.domCache = true;
                                    $.mobile.defaultPageTransition = config.defaultPageTransition;
                                    $.mobile.defaultDialogTransition = config.defaultDialogTransition;
                                    $.mobile.useFastClick = true;
                            });
                            require(["jqm"],function(){
                                    require(quickforms.baseScripts,function(){quickforms.ready = true;quickforms.onReady()});
                            });
                        }
                        else
                        {
                            require(quickforms.baseScripts,function(){quickforms.ready = true;quickforms.onReady()});
                            $('html').removeClass('ui-mobile-rendering');
                        }
		} );
		
	});
});

