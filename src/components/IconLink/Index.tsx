import React from 'react';
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import './Index.css';
import { T } from '@services/translation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Awesome from '@fortawesome/free-solid-svg-icons';
import Notification from '@components/Notification';
import Loading from '@components/Loading';
import { Logger } from '@services/logger';
import { SPIconLinkService } from './Service/SPIconLinkService';
import { IIconLinkService } from './Service/IIconLink';
import { IIconLink } from './Entity/IconLink';
export enum itemColor {
    Purple = "#a9b4d2",
    Blue = "#8fa5e5",
    Green = "#5aabbf",
    Yellow = "#efc60f",
    Pink = "#f59383",
}
interface IIconLinkProps {
    items?: IIconLink[];
    service?: IIconLinkService;
}
interface IIconLinkState {
    items: IIconLink[];
}
export class IconLink extends React.Component<IIconLinkProps, IIconLinkState>{
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
    }
    render() {
        let maintenanceItem: JSX.Element[] = this.renderItem(this.props.items ? this.props.items : this.state.items);
        return (
            <div className="sr-icon-link">
                {maintenanceItem}
            </div>
        )
    }

    componentDidMount() {
        this.onInitial()
    }

    @autobind
    private async onInitial() {
        try {
            if (this.props.service) {
                let queryResult = await this.props.service.getIcons();
                this.setState({
                    items: queryResult.data
                })
            }
        } catch (e) {
            Loading.hide();
            Logger.Error('IconLink onInitial', e)
            Notification.Error({
                subText: e.message
            })
        }
    }

    @autobind
    private renderItem(data): JSX.Element[] {
        let itemJSX: JSX.Element[] = [];
        data.length ?
            data.map((item: any) => {
                itemJSX.push(
                    <div className="sr-icon-link-item">
                        <a href={item.Link} target={item.Target}>
                            {this.renderIconType(item)}
                            <div className="sr-icon-title">
                                <span title={item.Title}>{T(item.Title)}</span>
                            </div>
                        </a>
                    </div>
                );
            })
            : null;
        return itemJSX;
    }

    @autobind
    private renderIconType(data): JSX.Element {
        switch (data.Shape) {
            case 'solidCircle': {
                return (
                    <div className={"sr-icon-box sr-square sr-circle"} style={{ background: data.Color }}>
                        {this.renderIcon(data)}
                    </div>
                )
                break;
            }
            case 'hollowCircle': {
                return (
                    <div className={"sr-icon-box sr-hollow sr-circle"} style={{ borderColor: data.Color, color: data.Color }}>
                        {this.renderIcon(data)}
                    </div>
                )
                break;
            }
            case 'solidSquare': {
                return (
                    <div className={"sr-icon-box sr-square"} style={{ background: data.Color }}>
                        {this.renderIcon(data)}
                    </div>
                )
                break;
            }
            case 'hollowSquare': {
                return (
                    <div className={"sr-icon-box sr-hollow"} style={{ borderColor: data.Color, color: data.Color }}>
                        {this.renderIcon(data)}
                    </div>
                )
                break;
            }
            default: {
                return (
                    <div className={"sr-icon-box sr-square sr-circle"} style={{ background: data.Color }}>
                        {this.renderIcon(data)}
                    </div>
                )
                break;
            }
        }
    }

    @autobind
    private renderIcon(data): JSX.Element {
        if (data.FabricIcon) {
            return (<Icon iconName={data.FabricIcon} className="ms-IconExample sr-icon" />);
        } else if (data.AwesomeIcon) {
            return (<FontAwesomeIcon icon={Awesome[data.AwesomeIcon]} size="1x" />);
        } else {
            return null;
        }

    }
}
export default IconLink;