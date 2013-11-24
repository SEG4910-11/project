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
    public partial class putFact : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            String fact = "";
            String facttbl = "";
            String appid = "";

            try
            {
                try { fact = Request.Params.ToString();
                fact = fact.Replace("+", " ");
                }// .GetValues("fact")[0]; }
                catch (Exception ex) { throw ex; };
                try { facttbl = Request.Params.GetValues("facttable")[0]; }
                catch (Exception ex) { throw ex; };
                try { appid = Request.Params.GetValues("app")[0]; }
                catch (Exception ex) { };

                string tbl = Request.Params.GetValues("facttable")[0];
                fact = fact.Substring(0, fact.IndexOf("facttable=" + tbl) + ("facttable=" +tbl).Length);
                Response.Write(QuickForms3.putFact(appid, Uri.UnescapeDataString(fact), facttbl));

            }
            catch (Exception ex)
            {
                Response.Write(ex.Message);
            }

        }
    }
}
