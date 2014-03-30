using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Palis3
{
    public partial class editLkup : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            String label = "";
            String tbl = "";
            String app = "";
            String id = "";
            try
            {
                try { app = Request.Params.GetValues("app")[0]; }
                catch (Exception ex) { };
                try { tbl = Request.Params.GetValues("tbl")[0]; }
                catch (Exception ex) { };
                try { label = Request.Params.GetValues("label")[0]; }
                catch (Exception ex) { };
                try { id = Request.Params.GetValues("id")[0]; }
                catch (Exception ex) { };

                Response.Write(QuickForms3.updateLkup(app, tbl, label, id));

            }
            catch (Exception ex)
            {
                Response.Write(ex.Message);
            }

        }
    }
}