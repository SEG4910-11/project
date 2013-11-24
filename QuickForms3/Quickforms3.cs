using System;
using System.Data;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Data.SqlClient;
using System.Xml;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using System.IO;

namespace Palis3
{
    public class QuickForms3
    {
        public const String FORM_ESAS = "ESAS";
        public const String FORM_CONSULT = "FConsult";
        public const String FORM_INITIAL_CONSULT = "Consult";
        public const String FORM_VISIT_RESIDENT = "VisitResident";
        public const String FORM_REPORTLIST = "ReportList";
        public const String FORM_PATIENT = "Patient";
        public const String FORM_PATIENT_SEARCH = "Patient_Search";
        public const String FORM_RPP = "rpp";
        public const String FORM_ATTACHMENT = "Attachment";

        private enum FormDefFields { DBKEY = 0, TYPE, CAPTION, HTML, LOOKUPKEY, DEFAULTVALUE, HASNOTSELECTED };
        private enum FormHTMLFields { HTML = 0, TARGET, SRCSQL };
        private enum FormBBasicPatientFields { PATIENTID = 0, QUICKID, FIRSTNAME, LASTNAME, DOB };
        private enum FormCompletePatientFields { PATIENTID = 0, QUICKID, FIRSTNAME, LASTNAME, BIRTHDATE, ADDEDBYID, REQUESTDATE, ADMITDATE, OHIPNO, LOCATION, DIAGNOSIS, GOALOFCAREEST, DECEASEDDATE, CHEMO2WEEKSPRIOR, ER2WEEKSPRIOR, DISCHARGEDATE, NOTES };
        private enum ReportSQLfields { SQL = 0, CHARTTYPE, VTOTALS, HTOTALS, TITLE, TITLEWIDTH, SHOWHEADER, NULLVALUE, ZEROVALUE } ;

        private enum LookUpFields { ID = 0,DESC = 1  };

        
       // private static string connectionString = "PACKET SIZE=4096;USER ID=palisadmin;PASSWORD=palisadmin;DATA SOURCE=localhost;PERSIST SECURITY INFO=False;INITIAL CATALOG=";
        //private static string connectionString = ConfigurationManager.ConnectionStrings["LocalSqlServer"].ConnectionString;//"SERVER=GURPREET-PC\\SQLEXPRESS;Integrated Security=True; Initial Catalog=PALISDB;Connection timeout=60";
        public static string getConnectionString(String app) {

            System.Configuration.Configuration rootWebConfig1 =
                    System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration("/QuickForms3");
            System.Configuration.KeyValueConfigurationElement customSetting =
                        rootWebConfig1.AppSettings.Settings["PalisConnectionString"];
            if (customSetting != null)
            {
                Console.WriteLine("customsetting1 application string = \"{0}\"",
                      customSetting.Value);
                return (customSetting.Value + app);
            }
            else
            {
                Console.WriteLine("No customsetting1 application string");
                throw new Exception();
            }

            
        }

       
 


public static String getParamValue(String value, NameValueCollection parms)
{
    String buf = "";
    try { buf = parms.GetValues(value)[0]; }
    catch (Exception ex) { };
    return buf;
}
public static String getSelectionList(String app,String tbl,String fact,String updateId)
{
    String json = "";
    String lookupName = tbl.Substring(5, tbl.Length - 5);// substring to remove lkup_
    String selvalue ="";
    int updateVal = -1;
    if(updateId != null && updateId.Length>0 && !updateId.Equals("null"))
    {
        String resultSetJSON = getResultSet(app, fact+"_get_row",fact+"Key:"+updateId);
        if (resultSetJSON.Contains(lookupName))
        {
            int startInd = resultSetJSON.IndexOf(lookupName) + lookupName.Length + 3;
            resultSetJSON = resultSetJSON.Substring(startInd, resultSetJSON.Length - startInd);
            updateVal = Int32.Parse(resultSetJSON.Substring(0, resultSetJSON.IndexOf("\"")));
        }
    }
    using (SqlConnection con = new SqlConnection(getConnectionString(app)))
    {

        con.Open();
        using (SqlCommand command = new SqlCommand("SELECT * FROM " + tbl + " where "+tbl+".flag=0 ORDER BY SORTORDER", con))
        using (SqlDataReader reader = command.ExecuteReader())
        {
            while (reader.Read())
            {
                String key = (reader.IsDBNull((int)LookUpFields.ID) == true) ? null : reader.GetValue((int)LookUpFields.ID).ToString();
                String value = (reader.IsDBNull((int)LookUpFields.DESC) == true) ? "" : reader.GetString((int)LookUpFields.DESC).TrimEnd();

                selvalue = "";
 
                if (json.Length != 0)
                    json += ",";
                if (Int32.Parse(key) == updateVal)
                    selvalue = "selected";
                json += "{\"id\":" + key;
                json += ",\"selected\":\"" + selvalue + "\"";
                json += ",\"label\":\"" + value + "\"}";
             }

            json = "[" + json + "]";
        }
    }
    return json;
}
private static string getWhereClause(String prms) {

    if (prms.Length == 0) return "";

    String where = "";
    String[] clause;

    clause = prms.Split(';');

    foreach (string cond in clause)
    {
        if (where.Length != 0) 
            where += " AND ";
        where += cond.Replace(':', '=');
    }
    return " WHERE " + where;
}
public static String getResultSet(String app,String tbl,String prms)
{
    String json = "";
    String sql = "";
    String where = getWhereClause(prms);

    using (SqlConnection con = new SqlConnection(getConnectionString(app)))
    {

        con.Open();
        using (SqlCommand command = new SqlCommand("SELECT SQL FROM meta_queries WHERE NAME = '" + tbl + "'", con))
        using (SqlDataReader reader = command.ExecuteReader())
        {
            while (reader.Read())
            {
                sql = (reader.IsDBNull(0) == true) ? null : reader.GetValue(0).ToString();
            }
        }

        sql = sql.Replace("$WHERECLAUSE$", where);
        using (SqlCommand command1 = new SqlCommand(sql, con))
        using (SqlDataReader reader1 = command1.ExecuteReader())
        {
            String[] fld = new String[reader1.FieldCount];
            for (int i = 0 ; i < reader1.FieldCount ;i++)
                fld[i]=reader1.GetName(i);
            int j = 0;
            while (reader1.Read())
            {
                if (j > 0)
                    json += ",";
                json += "{";
                for (int i = 0; i < reader1.FieldCount; i++)
                {
                    if (i != 0)
                        json += ",";
                    json += "\"" + fld[i] + "\":\"" + reader1.GetValue(i).ToString() +"\"";
                }
                json += "}";
                j++;
            }

            json = "[" + json + "]";
        }
    }
    return json;
}

public static String executeQuery(String app,String tbl, String prms)
{
    String json = "";
    String sql = "";
    String where = getWhereClause(prms);

    using (SqlConnection con = new SqlConnection(getConnectionString(app)))
    {

        con.Open();
        using (SqlCommand command = new SqlCommand("SELECT SQL FROM meta_queries WHERE NAME = '" + tbl + "'", con))
        using (SqlDataReader reader = command.ExecuteReader())
        {
            while (reader.Read())
            {
                sql = (reader.IsDBNull(0) == true) ? null : reader.GetValue(0).ToString();
            }
        }

        sql = sql.Replace("$WHERECLAUSE$", where);
        using (SqlCommand command1 = new SqlCommand(sql, con))
        {
            command1.ExecuteNonQuery();
        }
        con.Close(); 
    }
    return json;
}


private static int putFactUpdate(string app,string fact, string tbl)
{
    String[] facts = fact.Split(new char[] { '&' });
    String factTable = "fact_" + tbl;
    String values = "";
    String where = "";
    int id = -1;

    foreach (String fct in facts)
    {

        String[] fcts = fct.Split(new char[] { '=' });

        if (!fcts[0].Equals("app", StringComparison.CurrentCultureIgnoreCase) 
            && !fcts[0].Equals("factTable", StringComparison.CurrentCultureIgnoreCase))
        {
            if (fcts[0].Equals(tbl + "Key", StringComparison.CurrentCultureIgnoreCase))
            {
                where = fcts[0] + " = " + formatType(fcts[0].ToString(), fcts[1].ToString());
            }
            else
            {

                if (values.Length > 0)
                    values += ",";
                values += fcts[0] + " = " + formatType(fcts[0].ToString(), fcts[1].ToString());
            }
        }
    }

    String sql = "UPDATE fact_" + tbl + " set " + values + "  WHERE " + where;
    using (SqlConnection con = new SqlConnection(getConnectionString(app)))
    {

        con.Open();
        using (SqlCommand command = new SqlCommand(sql))
        {
            command.Connection = con;
            id = command.ExecuteNonQuery();
        }
    }

    return id;
}
private static int putFactInsert(string app,string fact, string tbl)
{

    String[] facts = fact.Split(new char[] { '&' });
    String factTable = "fact_" + tbl;
    String cols = "";
    String vals = "";
    int id = -1;

    foreach (String fct in facts)
    {

        String[] fcts = fct.Split(new char[] { '=' });
        
        if (!fcts[0].Equals("app", StringComparison.CurrentCultureIgnoreCase) && !fcts[0].Equals("factTable", StringComparison.CurrentCultureIgnoreCase))
        {
            if (cols.Length > 0)
                cols += ",";
            cols += fcts[0];

            if (vals.Length > 0)
                vals += ",";
            if (fcts.Length == 2) // the current column has a value
                vals += formatType(fcts[0].ToString(), fcts[1].ToString());
            else
                vals += "''";
        }
    }

    String sql = "INSERT INTO " + factTable + "(" + cols + ") OUTPUT INSERTED." + tbl + "Key VALUES(" + vals + ")";
    using (SqlConnection con = new SqlConnection(getConnectionString(app)))
    {

        con.Open();
        using (SqlCommand command = new SqlCommand(sql))
        {
            command.Connection = con;
            id = (int)command.ExecuteScalar();
        }
    }

    return id;
}
public static int putFact(string app, string fact, string tbl)
{

    String[] facts = fact.Split(new char[] { '&' });
    String factTable = "fact_" + tbl;
    String cols = "";
    String vals = "";
    int id = -1;

    foreach (String fct in facts)
    {

        String[] fcts = fct.Split(new char[] { '=' });

        if (fcts[0].Equals(tbl + "Key", StringComparison.CurrentCultureIgnoreCase) ) 
        {
            int result = putFactUpdate(app, fact, tbl);
            if (result == 1)
                return Int32.Parse(fcts[1]);
            else
                return result;
            break;
         }
    }


    return putFactInsert(app, fact,tbl);
}

//this method is used to add the option into the lkup table
public static int putLkup(string app, string tbl, string label)
{

    String lkupTable = "lkup_" + tbl;
    int id = -1;


    String sql = "INSERT INTO " + lkupTable + " VALUES( '" + label + "', 0,0)";
    using (SqlConnection con = new SqlConnection(getConnectionString(app)))
    {

        con.Open();
        using (SqlCommand command = new SqlCommand(sql))
        {
            command.Connection = con;
            id = (int)command.ExecuteScalar();
        }
    }

    return id;
}

//this method is used to add the option into the lkup table
public static int updateLkup(string app, string tbl, string label, string rowId)
{

    String lkupTable = "lkup_" + tbl;
    int id = -1;


    String sql = "Update " + lkupTable + " set LabelValue='"+label+"' where [key]='"+rowId+"'";
    using (SqlConnection con = new SqlConnection(getConnectionString(app)))
    {

        con.Open();
        using (SqlCommand command = new SqlCommand(sql))
        {
            command.Connection = con;
            id = (int)command.ExecuteNonQuery();
        }
    }

    return id;
}

//this method is used to delete an option from the lkup table
public static int deleteLkup(string app, string tbl, string rowID)
{

    String lkupTable = "lkup_" + tbl;
    int id = -1;


    String sql = "Update " + lkupTable + " SET " + lkupTable + ".flag=1 where " + lkupTable + ".[key]=" + rowID;
    using (SqlConnection con = new SqlConnection(getConnectionString(app)))
    {

        con.Open();
        using (SqlCommand command = new SqlCommand(sql))
        {
            command.Connection = con;
            id = (int)command.ExecuteScalar();
        }
    }

    return id;
}

private static String formatType(string col, string val)
{

    String buf = val;

    try
    {
        int i = (int)Convert.ToInt32(val);

    } catch (Exception ex) {
        buf = "'" + buf + "'";
    }
    return buf;
}
}
}

