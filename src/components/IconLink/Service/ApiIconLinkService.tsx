import IIconLink from './IIconLink';
import { PostRequest } from '@services/api';
import { Logger } from '@services/logger';
import { hasArrayData } from '@services/common/helper';
import { IconLinkApi } from '../Entity/IconLink';
export class ApiIconLinkService implements IIconLink {
    private apiURL;
    private apiParam;
    /**
     * 
     * @param apiURL 请求链接
     * @param apiParam 请求数据
     */
    constructor(apiURL: string, apiParam?: any) {
        this.apiURL = apiURL;
        this.apiParam = apiParam;
    }
    async getIcons() {
        try {
            let queryResult = await PostRequest(this.apiURL, this.apiParam);
            return {
                allCount: queryResult.total,
                data: hasArrayData(queryResult.data) ? queryResult.data.map(item => (new IconLinkApi(item))) : [],
            };
        } catch (e) {
            Logger.Error("ApiIconLinkService getIcons", e);
            throw (e);
        }


    }
}