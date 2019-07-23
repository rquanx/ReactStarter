import { Navigation } from '../../Navigation/Entity/Navigation';
import { INavigationService } from './INavigationService'
import JSOM from "@services/jsom";
import Caml from "@services/caml";
import { Logger } from "@services/logger";
import { hasArrayData } from "@services/common/helper";

export class SPNavigationService implements INavigationService {
  listName: string;
  constructor(listName?: string) {
    if (listName != undefined) {
      this.listName = listName;
    } else {
      this.listName = "NavigationList";
    }
  };

  async getNav() {
    try {
      let queryResult = await JSOM.create("", this.listName).getListItem(
        Caml.Express()
          .And('Eq', 'Enable', 'Number', "1")
          .OrderBy([{ "field": "NavOrder", "ascend": true }])
          .End()
      )
      return {
        data: hasArrayData(queryResult.data.data) ? queryResult.data.data.map(item => (new Navigation(item))) : [],
        haveNext: queryResult.data.haveNext,
        pagingInfo: queryResult.data.nextPageInfo
      };
    } catch (e) {
      Logger.Error("SPNavigationService getNav", e)
      throw (e);
    }
  }
}
export default SPNavigationService;



