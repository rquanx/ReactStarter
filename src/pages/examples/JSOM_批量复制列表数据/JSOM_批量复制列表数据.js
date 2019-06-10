//获取所有数据
var act_success = 0;
var clientContext = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
var oList = clientContext.get_web().get_lists().getByTitle('NewsList');
var camlQuery = new SP.CamlQuery();
camlQuery.set_viewXml(
    '<View><OrderBy><FieldRef Name="Created" /></OrderBy></View>'
);
this.collListItem = oList.getItems(camlQuery);

clientContext.load(collListItem);
clientContext.executeQueryAsync(
    Function.createDelegate(this, function () {
        var listItemEnumerator = collListItem.getEnumerator();


        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();

            var clientContext2 = new SP.ClientContext(_spPageContextInfo.webAbsoluteUrl);
            var oList2 = clientContext2.get_web().get_lists().getByTitle("NewsList2");
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var newItem = oList2.addItem(itemCreateInfo);
            newItem.set_item('Title', oListItem.get_item('Title'));
            newItem.set_item('NewsImage', oListItem.get_item('NewsImage'));
            newItem.set_item('NewsCarousel', oListItem.get_item('NewsCarousel'));
            newItem.set_item('ToTop', oListItem.get_item('ToTop'));
            newItem.set_item('Abstract', oListItem.get_item('Abstract'));
            newItem.set_item('Body', oListItem.get_item('Content'));
            newItem.set_item('Tags', oListItem.get_item('Tags'));
            newItem.set_item('NewsType', oListItem.get_item('NewsType'));
            newItem.set_item('Created', oListItem.get_item('Created'));
            newItem.set_item('NewsVideo', oListItem.get_item('NewsVideo'));
            newItem.set_item('Author', oListItem.get_item('Author'));
            newItem.update();

            clientContext2.load(newItem);
            clientContext2.executeQueryAsync(Function.createDelegate(this, function () {
                act_success++;
                console.log("已复制：" + act_success + "行");
            }), Function.createDelegate(this, function (sender, args) {
                console.log('Request failed. ' + args.get_message() +
                    '\n' + args.get_stackTrace());
            }));
        }
    }),
    Function.createDelegate(this, function () {
        console.log("获取News失败");
    })
);