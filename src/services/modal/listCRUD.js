import Config from "@config";
import {
    checkData,
    dateFormat,
    dateFormatToCaml,
    arrayLookupData,
    hasArrayData
} from "@services/common/helper";
import JSOM from "@services/jsom";
import Caml from "@services/caml";
import { Logger } from "@services/logger";
import { isError } from "util";

class ListCRUD {
    constructor(data) {
        this.ID = data.ID;
        this.Title = data.Title;
        this.Content = data.Content;
        this.Author = data.Author ? data.Author.get_lookupValue() : '';
        this.AuthorID = data.Author ? data.Author.get_lookupId() : '';
        this.ClassName = data.ClassName ? data.ClassName.get_lookupValue() : '';
        this.ClassNameID = data.ClassName ? data.ClassName.get_lookupId() : '';
        this.Created = dateFormat(data.Created)
    }
}

class NewsType {
    constructor(data) {
        this.ID = data.ID;
        this.ClassName = data.ClassName ? data.ClassName : '';
    }
}

/**
 * 获取列表数据
 */
ListCRUD.query = async function (data) {
    let caml = Caml.Express();
    if (data.keyword) {
        caml.And('Contains', 'Content', 'Text', data.keyword)
    }
    try {
        let queryResult = await JSOM.create("", Config.Lists.NewsList).getListItem(
            caml.RowLimit(Config.Pages.Size * Config.Pages.DisplayNum)
                .OrderBy([{ field: "Modified", ascend: false }])
                .End(),
            data.pagingInfo ? data.pagingInfo : ''
        )
        return {
            data: hasArrayData(queryResult.data.data) ? queryResult.data.data.map(item => (new ListCRUD(item))) : [],
            haveNext: queryResult.data.haveNext,
            pagingInfo: queryResult.data.nextPageInfo
        };
    } catch (e) {
        Logger.Error("ListCRUD.query", e)
        throw (e);
    }
}

/**
 * 获取分类
 */
ListCRUD.queryClass = async function () {
    try {
        let queryResult = await JSOM.create("", Config.Lists.NewsType).getListItem("")
        return {
            data: hasArrayData(queryResult.data.data) ? queryResult.data.data.map(item => (new NewsType(item))) : [],
            haveNext: queryResult.data.haveNext,
            pagingInfo: queryResult.data.nextPageInfo
        };
    } catch (e) {
        Logger.Error("ListCRUD.queryClass", e)
        throw (e);
    }
}

/**
 * 编辑列表项
 */
ListCRUD.edit = async function (id) {
    try {
        let editResult = await JSOM.create("", Config.Lists.NewsList).getListItemById(id);
        let classkeyItem = {
            text: editResult.data.ClassName.get_lookupValue(),
            key: editResult.data.ClassName.get_lookupId()
        };
        return {
            title: editResult.data.Title,
            content: editResult.data.Content,
            classkeyItem: classkeyItem
        }
    } catch (e) {
        Logger.Error("ListCRUD.edit", e)
        throw (e);
    }
}

/**
 * 编辑后更新列表项
 */
ListCRUD.update = async function (id, content, title, className) {
    try {
        let updateResult = await JSOM.create("", Config.Lists.NewsList).updateListItemById(id,
            {
                Content: { type: "Text", value: content },
                Title: { type: "Text", value: title },
                ClassName: { type: "LookupId", value: className }
            }
        )
        return {
            data: updateResult.success,
        };
    } catch (e) {
        Logger.Error("ListCRUD.update", e)
        throw (e);
    }
}

/**
 * 新增列表项
 */
ListCRUD.add = async function (content, title,className) {
    try {
        let addItem = await JSOM.create("", Config.Lists.NewsList).createListItem("",
            {
                Content: { type: "Text", value: content },
                Title: { type: "Text", value: title },
                ClassName: { type: "LookupId", value: className } 
            }
        )
        return {
            data: addItem.success,
        };
    } catch (e) {
        Logger.Error("ListCRUD.add", e)
        throw (e);
    }
}

/**
 * 单个删除列表项
 */
ListCRUD.delete = async function (id) {
    try {
        let deleteResult = await JSOM.create("", Config.Lists.NewsList).deleteListItemById(id)
        return {
            data: deleteResult.success,
        };
    } catch (e) {
        Logger.Error("ListCRUD.delete", e)
        throw (e);
    }
}

/**
 * 批量删除
 */
ListCRUD.deleteMore = async function (IDs) {
    try {
        let queryResult = await JSOM.create("", Config.Lists.NewsList).deleteListItemsByIdList(IDs)
        return {
            data: queryResult.success,
        };
    } catch (e) {
        Logger.Error("ListCRUD.deleteMore", e)
        throw (e);
    }
}
export default ListCRUD;