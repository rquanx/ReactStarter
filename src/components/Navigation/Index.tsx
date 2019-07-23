import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Awesome from '@fortawesome/free-solid-svg-icons';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { T,inital } from '@services/translation';
import './Index.css';
import { initializeIcons } from '@uifabric/icons';
import { Logger } from '@services/logger';
import Notification from '@components/Notification';
import { Navigation as NavigationModel } from './Entity/Navigation';
import { INavigationService } from './Service/INavigationService'
import APINavigationService from '../../components/Navigation/Service/APINavigationService';
import SPNavigationService from '../../components/Navigation/Service/SPNavigationService';
inital()
initializeIcons();

interface INewsListProps {
    cnTop?:boolean;//若CnName、EnName同时不为空，则中文名称显示在上面，英文名称显示在下面。
    isIcon?: boolean;//是否显示图标
    service?: INavigationService
}
interface INavigationState {
    navigationList: NavigationModel[]
}

export class Navigation extends React.Component<INewsListProps, INavigationState>{
    constructor(props) {
        super(props);
        this.state = {
            navigationList: undefined
        }
    }

    // 默认值
    static defaultProps = {
        cnTop: true,
        isIcon: true,
        service: new SPNavigationService()
    }

    componentDidMount() {
        this.onInitial();
    }

    componentDidUpdate() {
        //为了解决IE ul宽度不能自动撑大的问题
        var subul = document.getElementsByClassName("sr-sub-nav");
        for (var i = 0; i < subul.length; i++) {
            var subNav = (subul[i] as HTMLElement);
            subNav.style.width = "800px";
            subNav.style.display = "block";

            //从子元素中获取最大宽度作为ul的宽度
            var liItemWidth = [];
            var subLi = subul[i].childNodes;
            for (var w = 0; w < subLi.length; w++) {
                liItemWidth.push((subLi[w].firstChild as HTMLElement).clientWidth + 1);
            }
            subNav.style.width = Math.max.apply(null, liItemWidth) + "px";
        }

        for (var i = 0; i < subul.length; i++) {
            (subul[i] as HTMLElement).style.removeProperty("display");
        }
    }

    onInitial = async () => {
        try {
            var self = this;
            let result = await this.props.service.getNav();
            let navData = result.data as NavigationModel[];
            var navList: NavigationModel[];
            navList = [];

            navData.map((item) => {
                if (item.ParentID == 0) {
                    var subNavs: NavigationModel[];
                    subNavs = self.getNavData(item.ID, navData);
                    item.SubMenus = subNavs;
                    navList.push(item);
                }
            });

            //升序排序
            var min;
            for (var i = 0; i < navData.length; i++) {
                for (var j = i; j < navData.length; j++) {
                    if (navData[i].NavOrder > navData[j].NavOrder) {
                        min = navData[j];
                        navData[j] = navData[i];
                        navData[i] = min;
                    }
                }
            }

            this.setState({
                navigationList: navList
            })
        } catch (e) {
            Logger.Error('NavigationList onInitial', e)
            Notification.Error({
                subText: e.message
            })
        }
    }

    private getNavData(parentID: Number, navData: NavigationModel[]): any {
        var subItems: NavigationModel[];
        subItems = [];
        var self = this;
        navData.map((item) => {
            if (parentID == item.ParentID) {
                var subNavs: NavigationModel[];
                subNavs = self.getNavData(item.ID, navData);
                item.SubMenus = subNavs;
                subItems.push(item);
            }
        });

        //升序排序
        var min;
        for (var i = 0; i < subItems.length; i++) {
            for (var j = i; j < subItems.length; j++) {
                if (subItems[i].NavOrder > subItems[j].NavOrder) {
                    min = subItems[j];
                    subItems[j] = subItems[i];
                    subItems[i] = min;
                }
            }
        }

        return subItems;
    }

    render() {
        var self = this;
        let navigationList = this.state.navigationList;

        var itemList;
        if (navigationList != undefined) {
            itemList = navigationList.map((item) => {
                let title;
                let subItem = self._onGetSubMenu(item);

                //Icon
                var icon;
                if (this.props.isIcon) {
                    if (item.FabricIcon) {
                        icon = <Icon className="sr-nav-icon" iconName={item.FabricIcon} />;
                    } else if (item.AwesomeIcon) {
                        icon = <FontAwesomeIcon className="sr-nav-icon sr-nav-awesomeicon" icon={Awesome[item.AwesomeIcon]}></FontAwesomeIcon>;
                    } else if (item.OtherIcon) {
                        icon = <span className={"sr-nav-icon sr-nav-othericon " + item.OtherIcon}></span>;
                    }
                }


                var nameElements = this._getNavNameElement(item);
                if (icon) {
                    title = <div className="sr-nav-name">{nameElements}</div>;
                } else {
                    title = <div className="sr-nav-name" style={{ margin: "0px" }}>{nameElements}</div>;
                }


                //选中效果
                var selectedClassName = "";
                if (location.pathname == item.Link) {
                    selectedClassName = "selected";
                } else {
                    if (item.OtherLink) {
                        let links = item.OtherLink.split("#mlink#");
                        for (var i = 0; i < links.length; i++) {
                            if (links[i] == location.pathname) {
                                selectedClassName = "selected";
                                break;
                            }
                        }
                    }
                }

                return (
                    <li>
                        <a href={item.Link} target={item.Target} className={"box " + selectedClassName}>
                            {icon}
                            {title}
                            {subItem ? <Icon className="sr-nav-arrow" iconName="ChevronDown" /> : null}
                        </a>
                        {subItem}
                    </li>);
            });
        }
        return (
            <ul className="sr-top-nav box">
                {itemList}
            </ul>
        );

    }

    private _onGetSubMenu(item: NavigationModel) {
        var self = this;
        if (item.SubMenus == undefined) {
            return null;
        }
        let subLiItem = item.SubMenus.map((sonItem) => {
            var subMenu = self._onGetSubMenu(sonItem);
            var icon;
            var title;
            if (this.props.isIcon) {
                if (sonItem.FabricIcon) {
                    icon = <Icon className="sr-nav-icon" iconName={sonItem.FabricIcon} />;
                } else if (sonItem.AwesomeIcon) {
                    icon = <FontAwesomeIcon className="sr-nav-icon sr-nav-awesomeicon" icon={Awesome[sonItem.AwesomeIcon]}></FontAwesomeIcon>;
                } else if (sonItem.OtherIcon) {
                    icon = <span className={"sr-nav-icon sr-nav-othericon " + sonItem.OtherIcon}></span>;
                }
            }


            var nameElements = this._getNavNameElement(sonItem);
            if (icon) {
                title = <div className="sr-nav-name">{nameElements}</div>;
            } else {
                title = <div className="sr-nav-name" style={{ margin: "0px" }}>{nameElements}</div>;
            }

            return (<li>
                <a href={sonItem.Link} data-submenu={true} target={sonItem.Target} onMouseOver={self._onMouseOver} className="box sr-nav-aitem">
                    {icon}
                    {title}
                    {subMenu ? <Icon data-key="sr-nav-right" className="sr-nav-right" iconName="ChevronRight" /> : null}
                </a>
                {subMenu}
            </li>);
        })
        if (subLiItem.length > 0) {
            return <ul className="sr-sub-nav">{subLiItem}</ul>;
        }
        return null;
    }

    //获取名称
    private _getNavNameElement(item) {
        //Name
        var nameElements = [];
        if (item.CnName && !item.EnName) {
            nameElements.push(<span className="sr-cnnav" style={{ lineHeight: "inherit" }}>{T(item.CnName)}</span>);
        } else if (!item.CnName && item.EnName) {
            nameElements.push(<span className="sr-ennav" style={{ lineHeight: "inherit" }}>{T(item.EnName)}</span>);
        } else {
            if (this.props.cnTop) {
                nameElements.push(<span className="sr-cnnav">{item.CnName}</span>);
                nameElements.push(<span className="sr-ennav">{item.EnName}</span>);
            } else {
                nameElements.push(<span className="sr-ennav">{item.EnName}</span>);
                nameElements.push(<span className="sr-cnnav">{item.CnName}</span>);
            }
        }
        return nameElements;
    }

    //hover
    private _onMouseOver(e) {
        var element = e.target as HTMLElement;
        try {
            if (element.tagName == "SPAN" && element.parentElement.tagName == "DIV") {
                element = element.parentElement.parentElement;
            } else if (element.tagName != "A") {
                element = element.parentElement;
            }
            (element.nextElementSibling as HTMLElement).style.left = element.clientWidth + "px";
        } catch (e) {
        }
    }

}

export default Navigation;
