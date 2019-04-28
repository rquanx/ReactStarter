
export function getRequest() {
    //url例子：www.bicycle.com?id="123456"&Name="bicycle"；  
    var url = decodeURI(location.search); //?id="123456"&Name="bicycle";
    var object = {};
    if (url.indexOf("?") != -1) //url中存在问号，也就说有参数。  
    {
        var str = url.substr(1); //得到?后面的字符串
        var strs = str.split("&"); //将得到的参数分隔成数组[id="123456",Name="bicycle"];
        var len = strs.length;
        for (var i = 0; i < len; i++) {
            object[strs[i].split("=")[0]] = strs[i].split("=")[1];
        };
    }
    return object;
};
