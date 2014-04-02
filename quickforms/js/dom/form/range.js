define(['dom/form/form'],
function (){
    quickforms.RangeElement = function(dom,formObj)
    {
            quickforms.DomElement.call(this,dom); // super call to get parent attributes
            var me = this;
            this.parent = formObj;
            this.serialize = function()
            {
                    return '';
            };
            this.summary = function()
            {
                    var summary = '';
                    if(this.left.val())
                    {
                            summary += this.left.attr('name')+" > '"+this.left.val()+"'";
                    }			
                    if(this.right.val())
                    {
                            if(this.left.val())
                                            summary += " and ";
                            summary += this.right.attr('name')+" < '"+this.right.val()+"'";
                    }
                    return summary;
            };
            this.filter = function(){
                    var filter = '';
                    if(this.left.val())
                    {
                            filter += this.left.attr('name')+">='"+this.left.val()+"'";
                    }			
                    if(this.right.val())
                    {
                            if(this.left.val())
                                            filter += " and ";
                            filter += this.right.attr('name')+"<='"+this.right.val()+"'";
                    }
                    return filter;
            };
    };
    quickforms.form.domParsers.push(function(formObj){
        if(formObj.fact.indexOf('filter')>=0) // ensure persisted module does not confict with another form
        {
            $('div[class="range"]').each(function(i,dom){
                dom = $(dom);

                        var rangeCheck = $('<input type="checkbox" data-inline="true"/>');
                        rangeCheck.checkboxradio();
                var rangeObj = new quickforms.RangeElement(dom,formObj);
                rangeObj.left = $(rangeObj.dom.find("input,select")[0]);
                rangeObj.right = $(rangeObj.dom.find("input,select")[1]);
                        dom.on('click',function(){
                                rangeObj.included = true;
                                var label = $('label[for="'+rangeObj.dom[0].id+'"]');
                                if(label.length>0)
                                {
                                        if(label[0].innerHTML.indexOf("Included")==-1)
                                                label[0].innerHTML += " (Included)";
                                }
                        });

                formObj.addChild(rangeObj);
                        window.setTimeout(function(){formObj.finishedParsing();},1);
            });
        }
    });
});