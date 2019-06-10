//获取所有部门 1
var clientContext = new SP.ClientContext.get_current();
var web = clientContext.get_web();
var userInfoList = web.get_siteUserInfoList();
var camlQuery = new SP.CamlQuery();

var userID = _spPageContextInfo.userId;

// define the query to retrieve the given user's details
camlQuery.set_viewXml('<View><Query></Query></View>');

var allitem = userInfoList.getItems(camlQuery);
clientContext.load(allitem);
clientContext.executeQueryAsync(function () {
    var oEnumerator = allitem.getEnumerator();
    var total = 0;
    var departList = {};
    while (oEnumerator.moveNext()) {
        var current = oEnumerator.get_current();
        total++;
        console.log(current.get_item("Name") + "  " + current.get_item("Department"));
        if (!departList[current.get_item("Department")]) {
            departList[current.get_item("Department")] = 0;
        }
    }
    console.log("total:" + total);
    console.log(departList);
},
    function () { console.log("error."); });



//获取所有部门 2
var clientContext = new SP.ClientContext.get_current();
var web = clientContext.get_web();
var userInfoList = web.get_siteUserInfoList();
var viewXml = "<View><Query><GroupBy Collapse=\"TRUE\"><FieldRef Name=\"Department\"/></GroupBy></Query></View>";
var groupBy = userInfoList.renderListData(viewXml);
clientContext.executeQueryAsync(function () {
    console.log(eval("(" + groupBy.m_value + ")"));
}, function (e) { console.log(e); })







//CSOM获取所有部门接口
Dictionary < string, string > departList = new Dictionary<string, string>();
using(var ctx = Utility.GetClientContextByWebUrl(ConfigurationManager.AppSettings["siteUrl"]))
    {
        Web web = ctx.Web;
var userInfoList = web.SiteUserInfoList;
var viewXml = "<View><Query><GroupBy Collapse=\"TRUE\"><FieldRef Name=\"Department\"/></GroupBy></Query></View>";
var groupBy = userInfoList.RenderListData(viewXml);
ctx.ExecuteQuery();

JObject json = (JObject)JsonConvert.DeserializeObject(groupBy.Value);
Newtonsoft.Json.Linq.JArray jArray = (Newtonsoft.Json.Linq.JArray)json["Row"];
foreach(JObject item in jArray)
{
    string departName = item["Department"].ToString();
    departList.Add(departName, string.IsNullOrEmpty(departName) ? "无部门" : departName);
}

return departList;
                }