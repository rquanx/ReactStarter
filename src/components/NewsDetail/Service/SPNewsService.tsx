import JSOM from "@services/jsom";
import Caml from "@services/caml";
import { Logger } from "@services/logger";
import INewsService from './INewsService'
import { News } from '../Entity/News';
import { checkData, dateFormat, hasArrayData } from "@services/common/helper";
export class SPNewsService implements INewsService {
    ID: string | number;
    listName: string;
    /**
     * SPNewsService
     * @param ID 当前新闻ID
     * @param listName 当前列表名
     */
    constructor(ID: string | number, listName: string) {
        this.ID = ID;
        this.listName = listName;
    };
    async getNews() {
        try {
            let queryResult = await JSOM.create("", this.listName).getListItem(
                Caml.Express()
                    .And('Eq', 'ID', 'Text', this.ID)
                    // .And("Eq", "IsPublish", "text", "true")
                    .End()
            )
            return {
                data: hasArrayData(queryResult.data.data) ? queryResult.data.data.map(item => (new News(item))) : [],
                haveNext: queryResult.data.haveNext,
                pagingInfo: queryResult.data.nextPageInfo
            };
        } catch (e) {
            Logger.Error("SPNewsServicegetNews", e)
            throw (e);
        }
    }
}
export default SPNewsService
