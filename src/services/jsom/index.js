let JSOM_CONFIG = {
    log: null,
    loading: null
}



class ServiceInfo {
    /**
     * @constructor 
     * @param {string} site 根据site获取clientContext,为空则默认取当前站点
     * @param {string} listTitle 设置默认操作列表名
     * @param {string} listId  设置默认操作列表id
     */
    constructor(site = "", listTitle = "", listId = "") {
        this.site = site;
        this.listTitle = listTitle;
        this.listId = listId;
        this.context = site ? new SP.ClientContext(site) : SP.ClientContext.get_current();
        this.web = this.context.get_web();
        this.currentContext = SP.ClientContext.get_current();
        this.currentWeb = this.currentContext.get_web();
    }
}

class ResultMessage {
    /**
     * @constructor
     * @param {boolean} success 调用是否成功
     * @param {any} data 结果数据或对象
     * @param {string} message 错误信息
     */
    constructor(success, data, message = "") {
        this.success = success;
        this.data = data;
        this.message = message;
    };
}

class JSOM {
    /**
     * @constructor 
     * @param {string} site 根据site获取clientContext,为空则默认取当前站点
     * @param {string} listTitle 设置默认操作列表名
     * @param {string} listId  设置默认操作列表id
     */
    constructor(site = "", listTitle = "", listId = "") {
        this.ServiceInfo = new ServiceInfo(site, listTitle, listId);
    };


    /**
     * 设置读取的表名
     * @param {string} title
     */
    setListTitle(title) {
        this.ServiceInfo.listTitle = title;
        return this;
    };

    /**
     * 读取当前用户数据
     * result.data = user or result.data = errorMessage 
     */
    getCurrentUser() {
        let info = this.ServiceInfo;

        function getUser(res, rej) {
            var user = info.currentWeb.get_currentUser(); // 读取当前用户
            info.currentContext.load(user); // 加载当前用户
            info.currentContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, user);
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getUser);
    };

    /**
     * //根据caml语句和要获取的属性，返回用户信息,实际是读取User Information List表
     * @param {any} caml 
     * @param {string[]} fields 空数组时查询所有字段，目前代码不支持取特定字段且取位置信息，如需获取位置必须要获取全部字段
     * 
     */
    getSiteUserInfo(caml, fields = []) {
        let info = this.ServiceInfo;

        function getItem(res, rej) {
            // var list = web.get_lists().getById("xx");
            // ===   var olist = info.web.get_lists().getByTitle("User Information List");
            var olist = info.web.get_siteUserInfoList();
            var camlQuery = JSOM.getCamlQuery(caml);
            var collListItem = olist.getItems(camlQuery);
            var include = "";
            if (fields && fields.length > 0) {
                include = "Include(" + fields.join() + ")";
                info.context.load(collListItem, include);
            } else {
                info.context.load(collListItem);
            }

            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var data;
                var newPageInfo = null;
                if (!fields || fields.length < 1) {
                    newPageInfo = collListItem.get_listItemCollectionPosition();
                }

                var it = collListItem.getEnumerator();
                var dataArray = new Array();
                while (it.moveNext()) {
                    var item = it.get_current();
                    var dataObj = new Object;

                    if (include !== "") {
                        for (var i in fields) {
                            var prop = fields[i];
                            dataObj[prop] = item.get_item(prop);
                        }
                    } else {
                        dataObj = item.get_fieldValues();
                    }

                    dataArray.push(dataObj);
                }
                data = {
                    haveNext: newPageInfo ? true : false,
                    data: dataArray
                };
                var result = new ResultMessage(true, data);
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getItem);
    }

    /**
     * 根据caml语句、定位信息和要获取的属性，返回列表
     * @param {any} caml 搜索caml
     * result.data = { haveNext: boolean, data: items[] } or result.data = errorMessage 
     * @param {string[]} fields 需要获取字段,空数组代表获取全部字段
     * @param {string} pageInfo 定位信息 
     */
    getListItem(caml, fields = [], pageInfo = "") {
        let info = this.ServiceInfo;

        function getPageItem(res, rej) {
            var olist = JSOM.getList(info);
            var camlQuery = JSOM.getCamlQuery(caml, pageInfo);
            var collListItem = olist.getItems(camlQuery);

            var include = "";
            if (fields && fields.length > 0) {
                include = "Include(" + fields.join() + ")";
                info.context.load(collListItem, include);
            } else {
                info.context.load(collListItem);
            }

            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(data) {
                var data;
                var newPageInfo = null;
                if (!fields || fields.length < 1) {
                    newPageInfo = collListItem.get_listItemCollectionPosition();
                }


                var it = collListItem.getEnumerator();
                var dataArray = new Array();
                while (it.moveNext()) {
                    var item = it.get_current();
                    var dataObj = new Object;

                    if (include !== "") {
                        for (var i in fields) {
                            var prop = fields[i];
                            dataObj[prop] = item.get_item(prop);
                        }
                    } else {
                        dataObj = item.get_fieldValues();
                    }

                    dataArray.push(dataObj);
                }
                data = {
                    haveNext: newPageInfo ? true : false,
                    data: dataArray
                };
                var result = new ResultMessage(true, data);
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getPageItem);
    };

    /**
     * 根据id获取item项
     * @param {string | number} id 
     * result.data = { haveNext: boolean, data: items[] } or result.data = errorMessage
     * 是否可以增加include? 
     */
    getListItemById(id) {
        let info = this.ServiceInfo;

        function getItem(res, rej) {
            var context = info.context;
            var olist = JSOM.getList(info);
            var oListItem = olist.getItemById(id);
            context.load(oListItem);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, oListItem.get_fieldValues());
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getItem);
    };


    /** 
     * 根据传入的对象和id，更新指定的列表项
     * @param {string | number} id 
     * @param { { [field: string]: {type: string, value: string} } } attributes
     */
    updateListItemById(id, attributes) {
        let info = this.ServiceInfo;

        function updateItem(res, rej) {
            var oList = JSOM.getList(info); //读取表
            var oListItem = oList.getItemById(id); //根据ID字段搜索表内容，唯一？			
            JSOM.setListItem(oListItem, attributes);
            oListItem.update(); //设置数据更新
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItem);
    };

    /** 
     * 根据传入的caml，更新第一项
     * @param {any} caml 
     * @param { { [field: string]: {type: string, value: string} } } attributes
     */
    updateListItemByCaml(caml, attributes) {
        let info = this.ServiceInfo;

        function updateItem(res, rej) {
            var idList = new Array();
            var olist = JSOM.getList(info);
            var camlQuery = JSOM.getCamlQuery(caml);
            var collListItem = olist.getItems(camlQuery);
            info.context.load(collListItem);
            info.context.executeQueryAsync(updateItem, onError);

            function updateItem() {
                var ListItemToBeUpdated = collListItem.getEnumerator();
                var oList = JSOM.getList(info);
                ListItemToBeUpdated.moveNext();
                var oItem = ListItemToBeUpdated.get_current();
                var id = oItem.get_id();
                idList.push(id);
                var oListItem = oList.getItemById(id);
                JSOM.setListItem(oListItem, attributes);
                oListItem.update();
                info.context.executeQueryAsync(onSuccess, onError);
            }

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, idList);
                onComplete(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItem);
    };

    /** 
     * 根据传入的idList，更新所有项
     * @param {string[] | number[]} idList 
     * @param { { [field: string]: {type: string, value: string} }[] } attributesList
     */
    updateListItemsByIdList(idList, attributesList) {
        let info = this.ServiceInfo;

        function updateItems(res, rej) {
            var oList = JSOM.getList(info); //读取表
            var count = 0;
            for (var i = 0; i < idList.length; i++) {
                var attributes = attributesList[count];
                var oListItem = oList.getItemById(idList[i]);
                JSOM.setListItem(oListItem, attributes);
                oListItem.update();
                if (count < attributesList.length - 1) {
                    count++;
                }
            }
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItems);
    };

    /** 
     * 根据传入的caml，更新所有项
     * @param {any} caml 
     * @param { { [field: string]: {type: string, value: string} }} attributes
     */
    updateListItemsByCaml(caml, attributes) {
        let info = this.ServiceInfo;

        function updateItems(res, rej) {
            var olist = JSOM.getList(info);
            var camlQuery = JSOM.getCamlQuery(caml);
            var collListItem = olist.getItems(camlQuery);
            info.context.load(collListItem);
            info.context.executeQueryAsync(updateMultipleListItemsInSameObj, onError);

            function updateMultipleListItemsInSameObj() {
                var ListItemToBeUpdated = collListItem.getEnumerator();
                var oList = JSOM.getList(info);
                while (ListItemToBeUpdated.moveNext()) {
                    var oItem = ListItemToBeUpdated.get_current();
                    var oListItem = oList.getItemById(oItem.get_id());
                    JSOM.setListItem(oListItem, attributes);
                    oListItem.update();
                }
                info.context.executeQueryAsync(onSuccess, onError);
            }

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItems);
    };


    /** 
     * 根据传入id删除列表项
     * @param {string | number} id 
     */
    deleteListItemById(id) {
        let info = this.ServiceInfo;

        function deleteItem(res, rej) {
            var list = JSOM.getList(info);
            var listItem = list.getItemById(id);
            listItem.deleteObject();

            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(deleteItem);
    };

    /** 
     * 根据caml批量删除
     * @param {any} caml 
     */
    deleteListItemsByCaml(caml) {
        let info = this.ServiceInfo;

        function deleteItems(res, rej) {
            var list = JSOM.getList(info);
            var camlQuery = JSOM.getCamlQuery(caml);
            var collListItem = list.getItems(camlQuery);
            info.context.load(collListItem);
            info.context.executeQueryAsync(deleteItem, onError);

            function deleteItem() {
                if (collListItem.get_count() > 0) {
                    var it = collListItem.getEnumerator();
                    while (it.moveNext()) {
                        var item = it.get_current();
                        var listItem = list.getItemById(item.get_id());
                        listItem.deleteObject();
                    }
                    info.context.executeQueryAsync(onSuccess, onError);
                } else {
                    onSuccess();
                }
            }

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(deleteItems);
    };

    /** 
     * 根据idList批量删除   待测试
     * @param {string[] | number[]} idList
     */
    deleteListItemsByIdList(idList) {
        let info = this.ServiceInfo;

        function deleteItems(res, rej) {
            if (idList.length > 0) {
                var list = JSOM.getList(info);
                idList.forEach((id) => {
                    var listItem = list.getItemById(id);
                    listItem.deleteObject();
                });
                info.context.executeQueryAsync(onSuccess, onError);
            } else {
                onSuccess();
            }

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, {});
                res(result);
            }


            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(deleteItems);
    }

    /** 
     * 根据传入的对象，创建列表项
     * @param { string } subFolderPath 默认加到列表根路径下，如果多层文件夹也要多层
     * @param { { [field: string]: {type: string, value: string} } } attributesObj
     */
    createListItem(subFolderPath, attributesObj) {
        let info = this.ServiceInfo;

        function createItem(res, rej) {
            let list = JSOM.getList(info);
            let itemCreateInfo = new SP.ListItemCreationInformation();
            if (subFolderPath) {
                itemCreateInfo.set_folderUrl(info.context.get_url() + "/" + info.listTitle + "/" + subFolderPath);
            }
            let newItem = list.addItem(itemCreateInfo);
            JSOM.setListItem(newItem, attributesObj);
            newItem.update();
            info.context.load(newItem);
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var result = new ResultMessage(true, {
                    id: newItem.get_id()
                });
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(createItem);
    };

    /** 
     * 检查当前用户是否在此用户组
     * @param { string } groupName 要检查的组名
     * @returns {Promise<ResultMessage>}
     */
    isCurrentUserMemberOfGroup(groupName) {
        let info = this.ServiceInfo;

        function checkUser(res, rej) {
            var context = info.context;
            var web = info.web;
            var currentUser = web.get_currentUser();
            context.load(currentUser);
            var groupUsers = web.get_siteGroups().getByName(groupName).get_users();
            context.load(groupUsers);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var userInGroup = false;
                var groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    var groupUser = groupUserEnumerator.get_current();
                    if (groupUser.get_id() === currentUser.get_id()) {
                        userInGroup = true;
                        break;
                    }
                }
                var result = new ResultMessage(true, userInGroup);
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkUser);
    };

    /** 
     * 检查用户是否在此用户组
     * @param { string | number } userId 用户ID
     * @param { string } groupName 要检查的组名
     * @returns {Promise<ResultMessage>}
     */
    isUserMemberOfGroup(userId, groupName) {
        let info = this.ServiceInfo;

        function checkUser(res, rej) {
            var context = info.context;
            var web = info.web;
            var groupUsers = web.get_siteGroups().getByName(groupName).get_users();
            context.load(groupUsers);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var userInGroup = false;
                var groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    var groupUser = groupUserEnumerator.get_current();
                    if (groupUser.get_id() == userId) {
                        userInGroup = true;
                        break;
                    }
                }
                var result = new ResultMessage(true, userInGroup);
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkUser);
    }

    /** 
     * 获取所有在此用户组的用户
     * @param { string } groupName 要检查的组名
     */
    getUsersOfGroup(groupName) {
        let info = this.ServiceInfo;

        function checkUser(res, rej) {
            var context = info.context;
            var web = info.web;

            var group = web.get_siteGroups().getByName(groupName);
            context.load(group);

            var groupUsers = group.get_users();
            context.load(groupUsers);

            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                var userList = new Array();
                var groupData = {
                    Title: group.get_title(),
                    ID: group.get_id(),
                    groupData: group
                };
                var groupUserEnumerator = groupUsers.getEnumerator();
                while (groupUserEnumerator.moveNext()) {
                    var groupUser = groupUserEnumerator.get_current();
                    userList.push({
                        ID: groupUser.get_id(),
                        Title: groupUser.get_title(),
                        userData: groupUser
                    });
                }

                var result = new ResultMessage(true, {
                    userList: userList,
                    group: groupData
                });
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkUser);
    };

    /** 
     * 更新文档库item，可更新文件,待完善
     * 有大小限制，不大于2M,文件相关操作建议使用pnp.js
     * @param { string | number} id item的id
     * @param { string } newFileName 文件新名字
     * @param { any } arrayBuffer 二进制文件数据
     * @param { { [field: string]: {type: string, value: string} }} attributesObj 更新的字段值
     * @param { string | number} isNewFileName  是否重命名
     */
    updateDocumentLibraryItemById(id, newFileName, arrayBuffer, attributesObj, isNewFileName = false) {
        var self = this;
        var fileDir = "";

        function updateItem(res, rej) {
            self.getListItemById(id)
                .then(onGetDirComplete, onError);

            function onGetDirComplete(data) {
                var fileDirArray = data.data["FileDirRef"].split("/");
                if (fileDirArray.length > 1) {
                    fileDir = fileDirArray.pop();
                }
                if (isNewFileName) {
                    attributesObj["FileLeafRef"] = {
                        value: newFileName.split(".")[0],
                        type: "Text"
                    };
                }
                self.updateListItemById(id, attributesObj)
                    .then(onRenameComplete, onError);
            }

            function onRenameComplete(data) {
                self.overWriteFile(arrayBuffer, fileDir, newFileName)
                    .then(onSuccess, onError);
            }

            function onSuccess(data) {
                var result = new ResultMessage(data.success, data);
                res(result);
            }

            function onError(sender, args) {
                var result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(updateItem);
    };

    /** 
     * 重写文件,待完善
     * 有大小限制，不大于1.5M,文件相关操作建议使用pnp.js
     * @param { any } arrayBuffer 二进制文件数据
     * @param { string } fileUrl 文件夹路径
     * @param { string } folderName  文件夹名
     */
    overWriteFile(arrayBuffer, fileUrl, folderName) {
        let info = this.ServiceInfo;

        function overWrite(res, rej) {
            let clientContext = info.context;
            let oList = JSOM.getList(info);

            let bytes = new Uint8Array(arrayBuffer);
            let i, out = '';
            let bytesLength = bytes.length;
            for (i = 0; i < bytesLength; i += 1) {
                out += String.fromCharCode(bytes[i]);
            }
            let base64 = btoa(out);

            let createInfo = new SP.FileCreationInformation();
            createInfo.set_content(base64);
            createInfo.set_url(fileUrl);
            createInfo.set_overwrite(true);

            let newFile;
            if (folderName) {
                // 根据url添加
                newFile = oList.get_rootFolder().get_folders().getByUrl(info.listTitle + "/" + folderName).get_files().add(createInfo);
            } else {
                // 在根目录添加
                newFile = oList.get_rootFolder().get_files().add(createInfo);
            }

            clientContext.load(newFile);
            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(data) {
                let result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(overWrite);
    };

    /** 
     * 创建文档库Item,待完善
     * 有大小限制，不大于1.5M,文件相关操作建议使用pnp.js
     * @param { string } fileUrl 文件路径
     * @param { any } arrayBuffer 二进制文件数据
     * @param { string } folderName  文件夹名
     * @param { { [field: string]: {type: string, value: string} } } attributesObj 字段数据
     */
    createDocumentLibraryItem(fileUrl, arrayBuffer, folderName, attributesObj) {
        let info = this.ServiceInfo;

        function createItem(res, rej) {
            let clientContext = info.context;
            let oList = JSOM.getList(info);

            //Convert the file contents into base64 data  
            let bytes = new Uint8Array(arrayBuffer);
            let i, out = '';
            let bytesLength = bytes.length;
            for (i = 0; i < bytesLength; i += 1) {
                out += String.fromCharCode(bytes[i]);
            }
            let base64 = btoa(out);

            //Create FileCreationInformation object using the read file data  
            let createInfo = new SP.FileCreationInformation();
            createInfo.set_content(base64);
            createInfo.set_url(fileUrl);
            let newFile;
            if (folderName) {
                // 根据url添加
                newFile = oList.get_rootFolder().get_folders().getByUrl(info.listTitle + "/" + folderName).get_files().add(createInfo);
            } else {
                // 在根目录添加
                newFile = oList.get_rootFolder().get_files().add(createInfo);
            }

            let myListItem = newFile.get_listItemAllFields();
            JSOM.setListItem(myListItem, attributesObj);
            myListItem.update();
            clientContext.load(myListItem);
            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, {
                    id: myListItem.get_id()
                });
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(createItem);
    };

    /** 
     * 创建文件夹,暂时只支持在根路径下创建,待完善
     * @param { string } subFolderPath 路径,如果在根路径，为false即可， "/site/listTitle/subFolderPath" 
     * @param { string } folderName 文件夹名
     * @param { { [field: string]: {type: string, value: string} } } attributesObj 字段数据
     */
    createFolder(subFolderPath, folderName, attributesObj = {}) {
        let info = this.ServiceInfo;

        function createItem(res, rej) {
            let clientContext = info.context;
            let oList = JSOM.getList(info);
            let itemCreateInfo = new SP.ListItemCreationInformation();
            if (subFolderPath) {
                itemCreateInfo.set_folderUrl(info.context.get_url() + "/" + info.listTitle + "/" + subFolderPath);
            }
            itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            itemCreateInfo.set_leafName(folderName);
            let oListItem = oList.addItem(itemCreateInfo);
            JSOM.setListItem(oListItem, attributesObj);
            oListItem.update();
            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess() {
                let result = new ResultMessage(true, {});
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(createItem);
    };

    /** 
     * 检查用户在当前设置的站点下的权限
     * @param {any} permission 权限枚举
     */
    checkSitePermission(permission) {
        let info = this.ServiceInfo;

        function checkPermission(res, rej) {
            let clientContext = info.context;
            let oWebsite = info.web;
            let basePerm = new SP.BasePermissions();
            basePerm.set(permission);
            let usPermission = oWebsite.doesUserHavePermissions(basePerm);

            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, usPermission.get_value());
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkPermission);
    }

    /** 
     * 检查用户在当前设置的列表下的权限
     * @param {any} permission 权限枚举
     */
    checkListPermission(permission) {
        let info = this.ServiceInfo;

        function checkPermission(res, rej) {
            let clientContext = info.context;
            let list = JSOM.getList(info);
            clientContext.load(list, JSOM.IncludeType.EffectiveBasePermissions);
            clientContext.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, list.get_effectiveBasePermissions().has(permission));
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(checkPermission);
    }


    /** 
     * 读取视图数据  
     * @param {*} caml   
     */
    renderListData(caml) {
        let info = this.ServiceInfo;

        function render(res, rej) {
            let context = info.context;
            let camlStr = typeof caml === "string" ? caml : caml.ToString();
            let groupByData = context.get_web().get_lists().getByTitle(info.listTitle).renderListData(camlStr);
            context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let data = groupByData ? JSON.parse(groupByData.m_value) : undefined;
                let result = new ResultMessage(true, data);
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(render);
    }

    /**
     * 读取指定列表GUID
     */
    getListGUID() {
        let info = this.ServiceInfo;

        function getLsitID(res, rej) {
            let olist = info.web.get_lists().getByTitle(info.listTitle);
            info.context.load(olist, 'Id');
            info.context.executeQueryAsync(onSuccess, onError);

            function onSuccess(sender, args) {
                let result = new ResultMessage(true, olist.get_id());
                res(result);
            }

            function onError(sender, args) {
                let result = new ResultMessage(false, args, args.get_message());
                rej(result);
            }
        }
        return new Promise(getLsitID);
    };
}


/**
 * IncludeType
 * include 可以包含的一些额外属性
 */
JSOM.IncludeType = {
    DisplayName: "DisplayName", // 显示名称?
    EffectiveBasePermissions: "EffectiveBasePermissions", // 权限？
    HasUniqueRoleAssignments: "HasUniqueRoleAssignments", // 
    RoleAssignments: "RoleAssignments" // 
    // Fields.Include(Title,InternalName)
};

/** 
 * 设置要更新的字段数据
 * @param {any} newItem
 * @param { { [field: string]: {type: string, value: string} } } attributesObj
 */
JSOM.setListItem = function (newItem, attributesObj) {
    for (var key in attributesObj) {
        var obj = attributesObj[key];
        if (obj.type === "lookupValue") {
            if (typeof (obj.value) !== "object") {
                var lkfieldsomthing = new SP.FieldLookupValue();
                lkfieldsomthing.set_lookupId(obj.value);
                newItem.set_item(key, lkfieldsomthing);
            } else {
                var lookupList = [];
                var len = obj.value.length;
                for (var i = 0; i < len; i++) {
                    var lkfieldsomthing = new SP.FieldLookupValue();
                    lkfieldsomthing.set_lookupId(obj.value[i]);
                    lookupList.push(lkfieldsomthing);
                }
                newItem.set_item(key, lookupList);
            }

        } else {
            newItem.set_item(key, obj.value);
        }
    }
};

/**
 * 创建JSOM操作对象
 */
JSOM.create = function (site = "", listTitle = "", listId = "") {
    return new JSOM(site, listTitle, listId);
};

/** 
 * 获取列表对象
 * @param {any} info
 */
JSOM.getList = function (info) {
    var list;
    if (info.listTitle) {
        list = info.web.get_lists().getByTitle(info.listTitle);
    } else {
        list = info.web.get_lists().getById(info.listId);
    }
    return list;
};

/** 
 * 获取camlQuery设置
 * @param {any} caml
 * @param {string} pageInfo
 */
JSOM.getCamlQuery = function (caml, pageInfo = "") {
    var camlQuery = new SP.CamlQuery();
    if (typeof (caml) === "string") {
        camlQuery.set_viewXml(caml);
    } else {
        camlQuery.set_viewXml(caml.ToString());
        var folder = caml.GetFolder();
        if (folder) {
            camlQuery.set_folderServerRelativeUrl(folder);
        }
        console.log(folder);
    }
    if (pageInfo) {
        var position = new SP.ListItemCollectionPosition();
        position.set_pagingInfo(pageInfo);
        camlQuery.set_listItemCollectionPosition(position);
    }
    return camlQuery;
};

JSOM.Log = function (log) {
    JSOM.Log = log;
}

JSOM.Loading = function (loading) {
    JSOM.Loading = loading;
}

export default JSOM;