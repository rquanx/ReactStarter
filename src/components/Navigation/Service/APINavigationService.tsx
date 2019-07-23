import { Navigation } from '../../Navigation/Entity/Navigation';
import { INavigationService } from './INavigationService'
import { Logger } from "@services/logger";
import { hasArrayData } from "@services/common/helper";
import { PostRequest } from '@services/api';

export class APINavigationService implements INavigationService {
  private apiURL: string;
  private apiParam:any;
  constructor(apiURL: string,apiParam?:any) {
    this.apiURL = apiURL;
    if(apiParam!=undefined){
      this.apiParam = apiParam;
    }
  }
  async getNav() {
    try {
      let queryResult = await PostRequest(this.apiURL,this.apiParam);
      console.log(queryResult);
      return {
        data: hasArrayData(queryResult.data) ? queryResult.data.map(item => (new Navigation(item))) : [],
      };
    } catch (e) {
      Logger.Error("APINavigationService getNav", e)
      throw (e);
    }
  }
}
export default APINavigationService;



