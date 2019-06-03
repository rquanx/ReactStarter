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
import { logger } from "@services/logger";

class example {
    constructor(data) {
        this.Topic = data.topic;
        this.ID = data.ID;
        this.Content = data.content;
        this.Writer = data.writer ? data.writer.get_lookupValue() : '';
        this.WriterID = data.writer ? data.writer.get_lookupId() : '';
        this.Item = data.item ? data.item.get_lookupValue() : '';
        this.ItemID = data.item ? data.item.get_lookupId() : '';
    }
}
example.query = async function (data = undefined) {
    try {
        let queryResult = await JSOM.create("", Config.Lists.myTest).getListItem(
            Caml.Express()
                .RowLimit(Config.Pages.Size * Config.Pages.DisplayNum)
                .End(),
            data ? data.pagingInfo : ''
        )
        console.log(queryResult)
        return {
            data: hasArrayData(queryResult.data.data) ? queryResult.data.data.map(item => (new example(item))) : [],
            haveNext: queryResult.data.haveNext,
            pagingInfo: queryResult.data.nextPageInfo
        };
    } catch (e) {
        logger.error("example.query", e)
        throw (e);
    }
}

example.deleteMore = async function(IDs){
    try {
        let queryResult = await JSOM.create("", Config.Lists.myTest).deleteListItemsByIdList(IDs)
        console.log(queryResult)
        return {
            data: queryResult.success,
        };
    } catch (e) {
        logger.error("example.query", e)
        throw (e);
    }
}
export default example;