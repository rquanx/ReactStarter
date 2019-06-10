var siteGroups ="";
function clickMethod() {

var clientContext = new SP.ClientContext.get_current();

siteGroups = clientContext.get_web().get_siteGroups();
clientContext.load(siteGroups);
clientContext.executeQueryAsync(onQuerySucceeded, onQueryFailed);
}

function onQuerySucceeded() {

var allGroups="Group Name: Group ID \n";
for (var i =0 ; i < siteGroups.get_count(); i++)
{
console.log(siteGroups.itemAt(i).get_title()+' '+siteGroups.itemAt(i).get_id());
}
}
function onQueryFailed() {console.log("error.");}