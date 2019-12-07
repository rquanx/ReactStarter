import { IIconLinkService } from './IIconLink';
import { IconLink } from '../Entity/IconLink';
import { Logger } from '@services/logger';
import Caml from '@services/caml';
import JSOM from '@services/jsom';
import { hasArrayData } from '@services/common/helper';

export class SPIconLinkService implements IIconLinkService {
    private listName;
    private limit;
    /**
     * 
     * @param listName 列表名称
     * @param limit 返回数据条数
     */
    constructor(listName: string = "IconLink", limit: number = 0) {
        this.listName = listName;
        this.limit = limit;
    }
    async getIcons() {
        let caml = Caml.Express().OrderBy([{ field: 'Order', ascend: true }]);
        if (this.limit) {
            caml.RowLimit(this.limit);
        }
        try {
            let queryResult = await JSOM.create("", this.listName).getListItem(
                caml.End()
            );
            return {
                data: hasArrayData(queryResult.data.data) ? queryResult.data.data.map(item => new IconLink(item)) : []
            };
        } catch (e) {
            Logger.Error('SPIconLinkService getIcons', e);
            throw (e);
        }
    }
}