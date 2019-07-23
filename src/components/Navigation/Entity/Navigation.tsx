export class Navigation {
    ID:Number;
    CnName:string;
    EnName: string;
    Target: string;
    Link: string;
    OtherLink:string;
    FabricIcon: string;
    AwesomeIcon: string;
    OtherIcon: string;
    SubMenus: Navigation[];
    ParentID:Number;
    NavOrder:Number;
    constructor(data) {
        this.ID=data.ID;
        this.CnName = data.CnName;
        this.EnName = data.EnName;
        this.Target = data.Target;
        this.Link = data.Link;
        this.OtherLink = data.OtherLink;
        this.FabricIcon = data.FabricIcon;
        this.AwesomeIcon = data.AwesomeIcon;
        this.OtherIcon = data.OtherIcon;
        this.SubMenus = data.SubMenus;
        this.ParentID=data.ParentID;
        this.NavOrder=data.NavOrder;
    };
}