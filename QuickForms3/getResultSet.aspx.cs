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
    public partial class getResultSet : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            String query = "";
            String prms = "";
            String app = "";
            try
            {
                try { app = Request.Params.GetValues("app")[0]; }
                catch (Exception ex) { };
                try { query =  Request.Params.GetValues("query")[0]; }
                catch (Exception ex) { };
                try { prms = Request.Params.GetValues("params")[0]; }
                catch (Exception ex) { };

                Response.Write(QuickForms3.getResultSet(app, query, prms));

            }
            catch (Exception ex)
            {
                Response.Write(ex.Message);
            }


        }
    }
}
