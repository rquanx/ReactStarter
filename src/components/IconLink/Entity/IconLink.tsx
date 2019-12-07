export class IconLink {
    Title: string;
    FabricIcon: string;
    AwesomeIcon: string;
    Order: number;
    Link: string;
    Target: string;
    Shape: string;
    Color: string;
    constructor(data) {
        this.Title = data.Title;
        this.FabricIcon = data.FabricIcon;
        this.AwesomeIcon = data.AwesomeIcon;
        this.Order = data.Order;
        this.Link = data.Link;
        this.Target = data.Target;
        this.Shape = data.Shape;
        this.Color = data.Color;
    }
}
export class IconLinkApi {
    Title: string;
    FabricIcon: string;
    AwesomeIcon: string;
    Order: number;
    Link: string;
    Target: string;
    Shape: string;
    Color: string;
    constructor(data) {
        this.Link = data.Link;
        this.Title = data.PermissionName;
        this.Target = data.IsBlank ? "_blank" : "_self";
        this.FabricIcon = data.Icon;
        this.Color = data.Color;
    }
}
export interface IIconLink {
    Title?: string;
    FabricIcon?: string;
    AwesomeIcon?: string;
    Order?: number;
    Link?: string;
    Target?: string;
    Shape?: string;
    Color?: string;
}

export default IconLink;