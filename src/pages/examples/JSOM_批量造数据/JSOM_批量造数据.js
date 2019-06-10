var siteUrl = _spPageContextInfo.webAbsoluteUrl;
var sp_action = {
    context: null,//当前的上下文
    act_success: 0,//操作成功命令数
    act_error: 0,//操作失败命令数
    action_maxloop: 40000,//序列操作数组
    action_index: 0,//序列第几次执行
    action_size: 20,//一次执行多少次请求
    start_date: null,//开始时间（用以计算耗时）
    search_position: null,//记录此次查询的位置
    nextPagingInfo: null,//下一页的信息
    BlockInsert: function () {
        Insert();
        function Insert() {
            if (sp_action.start_date == null) {
                sp_action.start_date = new Date();
            }
            if (sp_action.context == null) {
                sp_action.context = new SP.ClientContext(siteUrl);
            }
            var oList = sp_action.context.get_web().get_lists().getByTitle("PointsHistory");

            var userList=[21,23,28,24,22,27,26,1,21,23];
            var yearList=["2018","2017","2017","2017","2016","2016","2017","2018","2018","2016"];
            var processList=["我有创意 I Have Ideas","NewTechnicalList","NewTechnicalList2","NewTechnicalList3","NewTechnicalList4","NewTechnicalList5","NewTechnicalList6","NewTechnicalList7","NewTechnicalList8","NewTechnicalList9"];
            var createDate="";

            var processNum = 0;//当前执行执行了多少次
            var start = sp_action.action_index * sp_action.action_size;
            var end = Math.min(sp_action.action_size * (sp_action.action_index + 1), sp_action.action_maxloop);
            for (var i = start; i < end; i++) {
                var itemCreateInfo = new SP.ListItemCreationInformation();
                oListItem = oList.addItem(itemCreateInfo);
                oListItem.set_item('Title', 'test'+i);
                oListItem.set_item('PointsType', processList[(Math.floor(Math.random() * 10 + 1))]);
                oListItem.set_item('Points', 10 * (Math.floor(Math.random() * 10 + 1)));
                oListItem.set_item('User', userList[(Math.floor(Math.random() * 10))]);
                createDate=yearList[(Math.floor(Math.random() * 10))]+'/'+(Math.floor(Math.random() * 10)+1)+'/'+(Math.floor(Math.random() * 10 + 1));
                oListItem.set_item('CreateDate', createDate);
                oListItem.update();

                sp_action.context.executeQueryAsync(Function.createDelegate(this, function () {
                    processNum++;
                    sp_action.act_success++;
                    console.log('created number: ' + sp_action.act_success);
                    if (processNum == (end - start)) {
                        NextFun();
                    }
                }), Function.createDelegate(this, function (sender, args) {
                    console.log('Request failed. ' + args.get_message() + 
        '\n' + args.get_stackTrace());
                }));
            }
        }

        //分批处理
        function NextFun() {
            sp_action.action_index++;
            var haveRow = sp_action.action_maxloop - (sp_action.action_index * sp_action.action_size);

            if (haveRow > 0) {
                Insert();
            } else {
                console.log("全部插入完毕！");
            }
        }
    }
}