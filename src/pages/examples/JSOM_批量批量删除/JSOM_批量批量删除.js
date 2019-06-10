var simpleArray = [];
var action_size = 20;
var action_index = 0;
var act_success = 0;

var ctx = SP.ClientContext.get_current(),
    list = ctx.get_web().get_lists().getByTitle('NewsList2'),
    query = new SP.CamlQuery(),
    items = list.getItems(query);
ctx.load(items, "Include(Id)");
ctx.executeQueryAsync(function () {
    var enumerator = items.getEnumerator();
    while(enumerator.moveNext()) {
        simpleArray.push(enumerator.get_current());
    }
    deleteAll();
});

function deleteAll(){
    var processNum = 0;//当前执行执行了多少次
    var start = action_index * action_size;
    var end = Math.min(action_size * (action_index + 1), simpleArray.length);
    for (var i = start; i < end; i++) {
        simpleArray[i].deleteObject();
        ctx.executeQueryAsync(Function.createDelegate(this, function () {
            processNum++;
            act_success++;
            console.log('delete number: ' + act_success);
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
    action_index++;
    var haveRow = simpleArray.length - (action_index * action_size);

    if (haveRow > 0) {
        deleteAll();
    } else {
        console.log("全部删除完毕！");
    }
}