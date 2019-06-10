var clientContext = SP.ClientContext.get_current();
var list = clientContext.get_web().get_lists().getByTitle('PointsHistoryTest');
var viewXml = "<View><Query><GroupBy Collapse=\"TRUE\" GroupLimit=\"30\"><FieldRef Name=\"User\"/></GroupBy></Query><ViewFields><FieldRef Name=\"User\"/><FieldRef Name=\"Title\"/></ViewFields><RowLimit Paged=\"TRUE\">30</RowLimit><Aggregations Value=\"On\"><FieldRef Name=\"Months\" Type=\"Count\"/></Aggregations></View>";
var groupBy = list.renderListData(viewXml);
clientContext.executeQueryAsync(function () { 
    console.log(eval("("+groupBy.m_value+")")); 
}, function (e) { console.log(e); })