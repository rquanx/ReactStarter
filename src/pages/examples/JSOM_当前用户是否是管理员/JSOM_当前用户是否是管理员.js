var currentUser;
SP.SOD.executeFunc('sp.js', 'SP.ClientContext', GetCurrentUser);
function GetCurrentUser() {
    var clientContext = new SP.ClientContext.get_current();
    var oWeb = clientContext.get_web();
    currentUser = oWeb.get_currentUser();
    clientContext.load(currentUser);
    clientContext.executeQueryAsync(Onsuccess, OnFailed);
}

function Onsuccess() {
    if (currentUser.get_isSiteAdmin()) {
        alert("是管理员")
    } else {
        alert("不是管理员");
    }
}

function OnFailed(request, message) {
    alert('error' + message);
}