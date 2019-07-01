import INewsListService from './INewsListService';
import JSOM from "@services/jsom";
import Caml from "@services/caml";
import { Logger } from "@services/logger";
import { News } from '../Entity/News';
import { checkData, dateFormat, hasArrayData } from "@services/common/helper";
export class SPNewsListService implements INewsListService {
    listName: string;
    rowLimit: number
    constructor(listName: string, rowLimit: number) {
        this.listName = listName;
        this.rowLimit = rowLimit;
    }
    async getNews() {
        try {
            let queryResult = await JSOM.create("", this.listName).getListItem(
                Caml.Express()
                    // .And("Eq", "IsPublish", "text", "true")
                    .OrderBy([{ field: "PublishTime", ascend: false }])
                    .RowLimit(this.rowLimit)
                    .End()
            )
            return {
                data: hasArrayData(queryResult.data.data) ? queryResult.data.data.map(item => (new News(item))) : [],
                haveNext: queryResult.data.haveNext,
                pagingInfo: queryResult.data.nextPageInfo
            };
        } catch (e) {
            Logger.Error("SPNewsService getNews", e)
            throw (e);
        }
    }
}
export default SPNewsListService