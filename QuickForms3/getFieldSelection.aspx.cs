using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;

namespace Palis3
{
    public partial class getFieldSelection : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            String lookup = "";
            String appid = "";
            String updateId = "";
            String factTable = "";

            try
            {
                try { lookup = "lkup_" + Request.Params.GetValues("field")[0]; }
                catch (Exception ex) { };
                try { appid = Request.Params.GetValues("app")[0]; }
                catch (Exception ex) { };
                try { factTable = Request.Params.GetValues("factTable")[0]; }
                catch (Exception ex) { };
                try { updateId = Request.Params.GetValues("updateId")[0]; }
                catch (Exception ex) { };

                Response.Write(QuickForms3.getSelectionList(appid, lookup, factTable,updateId));

            }
            catch (Exception ex)
            {
                Response.Write(ex.Message);
            }


        }
    }
}
