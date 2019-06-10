
//检查当前用户是否拥有完全控制权限  
//Get the client context, web and current user object  
var clientContext = new SP.ClientContext.get_current();  
var oWeb = clientContext.get_web();  
oCurrentUser = oWeb.get_currentUser();  
  
//Load the client context with the required objects  
oList = oWeb.get_lists().getByTitle('NewsList2');
clientContext.load(oCurrentUser); 
//clientContext.load(oWeb,'EffectiveBasePermissions');
clientContext.load(oList, 'EffectiveBasePermissions'); 
 
  
//Execute the batch  
clientContext.executeQueryAsync(QuerySuccess, QueryFailure);   
  
function QuerySuccess() {  
//Check if user has Full Control Permission Level  
//console.log(oWeb.get_effectiveBasePermissions().has(SP.PermissionKind.manageWeb));  
console.log(oList.get_effectiveBasePermissions().has(SP.PermissionKind.manageWeb));  
}  
  
function QueryFailure(sender,args) {  
console.log('Request failed'+ args.get_message());  
}  
