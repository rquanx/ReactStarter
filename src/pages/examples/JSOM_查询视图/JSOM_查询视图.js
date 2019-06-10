function getItemsFromView(listTitle, viewTitle,success,error)
{
    var ctx = SP.ClientContext.get_current();
    var list = ctx.get_web().get_lists().getByTitle(listTitle);
    var view = list.get_views().getByTitle(viewTitle);
    ctx.load(view,'ViewQuery');
    ctx.executeQueryAsync(
        function() {
            var viewQry = "<View><Query>" + view.get_viewQuery() + "</Query></View>";
            //console.log(viewQry);
            getItems(listTitle,viewQry,success,error);
        },
        error);
}

function getItems(listTitle, queryText,success,error) 
{
    var ctx = SP.ClientContext.get_current();
    var list = ctx.get_web().get_lists().getByTitle(listTitle);
    var query = new SP.CamlQuery();
    query.set_viewXml(queryText);
    var items = list.getItems(query);
    ctx.load(items);
    ctx.executeQueryAsync(
        function() {
            success(items);
        },
        error
   );
}

getItemsFromView("NavigationList", "ParenIsNull",
 function(items){
    for(var i = 0; i < items.get_count(); i++){
        console.log(items.get_item(i).get_fieldValues());
    }
 },
 function(sender,args){ 
    console.log(args.get_message())
 });
