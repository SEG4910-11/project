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
using System.Xml;
using System.Collections.Specialized;

namespace Palis2
{
    public partial class GetForm : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try { 
                String buf = Request.Form.ToString();
                if (buf == null)
                    throw new Exception("No request found");


                NameValueCollection parms = new NameValueCollection();

                foreach (Object itm in Request.Params)
                {
                    String name= itm.ToString();
                    foreach (String tmp in Request.Params.GetValues(itm.ToString())) {
                        parms.Add(name, tmp);
                    }
                }
                String frm = "";
                String quickid = "";
                String username = "";
                String formid = "";
                String appid = "";
 
                try {frm = Request.Params.GetValues("form")[0];} catch(Exception ex) {};
                try {quickid = Request.Params.GetValues("quickid")[0];} catch(Exception ex) {};
                try {username = Request.Params.GetValues("username")[0];} catch(Exception ex) {};
                try { formid = Request.Params.GetValues("formid")[0]; }catch (Exception ex) { };
                try { appid = Request.Params.GetValues("appid")[0]; }catch (Exception ex) { };

                if (frm == null || username == null)
                    throw new Exception("No form or user name provided");

                //if (frm.Length ==0 || username.Length  == 0)
                  //  throw new Exception("No form or user name provided");

                Response.Write(QuickForms.buildHTML(appid, frm, quickid, username, null, formid)); 
/*                if (buf.Length > 0)
                {
                    Response.Write(Action.ParseXML(Request.Params.ToString()));
                }
                
 */
            } catch(Exception ex) {
                Response.Write(QuickForms.getFormattedExp(ex));
            }

        }
    }
}
