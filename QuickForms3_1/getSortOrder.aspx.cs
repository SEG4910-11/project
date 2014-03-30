using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Palis3
{
    public partial class getSortOrder : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            String id = "";
            String tbl = "";
            String app = "";
            try
            {
                try { app = Request.Params.GetValues("app")[0]; }
                catch (Exception ex) { };
                try { tbl = Request.Params.GetValues("tbl")[0]; }
                catch (Exception ex) { };
                try { id = Request.Params.GetValues("id")[0]; }
                catch (Exception ex) { };

                Response.Write(QuickForms3.getSortOrder(app, tbl, id));

            }
            catch (Exception ex)
            {
                Response.Write(ex.Message);
            }


        }
    }
}
