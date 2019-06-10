function getItemsFromView(listTitle, success, error) {
    var ctx = SP.ClientContext.get_current();
    var list = ctx.get_web().get_lists().getByTitle(listTitle);
    ctx.load(list);
    ctx.executeQueryAsync(
        function () {
            // var viewQry = "<View><Query><GroupBy Collapse=\"TRUE\" GroupLimit=\"30\"><FieldRef Name=\"User\"/></GroupBy></Query><ViewFields><FieldRef Name=\"User\"/></ViewFields><RowLimit Paged=\"TRUE\">30</RowLimit><Aggregations Value=\"On\"><FieldRef Name=\"Months\" Type=\"Count\"/></Aggregations></View>";
            //GroupLimit折叠数，相当于总数
            var viewQry = "<View><Query><GroupBy Collapse=\"TRUE\" GroupLimit=\"30\"><FieldRef Name=\"User\"/></GroupBy></Query></View>";
            getItems(listTitle, viewQry, success, error);
        },
        error);
}




function getItems(listTitle, queryText, success, error) {
    var ctx = SP.ClientContext.get_current();
    var list = ctx.get_web().get_lists().getByTitle("PointsHistoryTest");
    ctx.load(list);
    ctx.executeQueryAsync(
        function () {
            var listEnumerator = list.getEnumerator();
            for (var i = 0; i < listEnumerator.get_count(); i++) {
                console.log(listEnumerator.get_item(i).get_fieldValues());
            }
        },
        function (sender, args) {
            console.log(args.get_message())
        }
    );
}

function retrieveAllListProperties(siteUrl) {
    var oWebsite = SP.ClientContext.get_current().get_web();
    this.collList = oWebsite.get_lists().getByTitle("PointsHistoryTest");
    clientContext.load(collList);

    clientContext.executeQueryAsync(
        Function.createDelegate(this, function () {
            var listEnumerator = collList.getEnumerator();

            while (listEnumerator.moveNext()) {
                console.log(listEnumerator.get_current().get_fieldValues());
            }
        }),
            Function.createDelegate(this, function (sender, args) {
                console.log('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            })
        );
}

function retrieveListItems(siteUrl) {
    var oList = SP.ClientContext.get_current().get_web().get_lists().getByTitle('PointsHistoryTest');
    this.collListItem = oList.getItems();
    clientContext.load(collListItem);
    clientContext.executeQueryAsync(
        Function.createDelegate(this, function(sender, args) {
            var listItemEnumerator = collListItem.getEnumerator();
        
            while (listItemEnumerator.moveNext()) {
                var oListItem = listItemEnumerator.get_current();
                console.log(oListItem);
            }
        }), 
        Function.createDelegate(this, function(sender, args){
            alert('Request failed. ' + args.get_message() + 
            '\n' + args.get_stackTrace());
        })
    ); 
}


var it;var item;
var context = SP.ClientContext.get_current(); 
var web = context.get_web();    
var olist = web.get_lists().getByTitle('PointsHistoryTest');
var camlQuery = new SP.CamlQuery();
camlQuery.set_viewXml("<View  Scope='Recursive' ><Query><Where></Where></Query> </View>");
var collListItem = olist.getItems(camlQuery);
context.load(collListItem);
context.executeQueryAsync(function (data) {
    it = collListItem.getEnumerator();
    while (it.moveNext()) {
        var oListItem = it.get_current();
        console.log(oListItem.get_fieldValues());
    }
}, function (sender, args) {
    console.log("error" + args.get_message())
});


