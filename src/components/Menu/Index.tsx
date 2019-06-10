import * as React from 'react';
import { Nav, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import './Index.css'
export interface IMenus extends INavLinkGroup {

}

interface INavProps {
    menus: IMenus[];
    info?: any;
}

export class Menu extends React.Component<INavProps, {}> {
    componentDidMount() {
        this.navFixed()
    }
    public render(): JSX.Element {
        return (
            <div className="sr-nav-layout" id="Nav" style={{ height: document.documentElement.clientHeight || document.body.clientHeight }}>
                <Nav className="subnav-container"
                    onRenderLink={this.onRenderLink}
                    groups={this.props.menus}
                />
            </div>
        );
    }

    private onRenderLink = (link: any): JSX.Element | null => {
        return (
            <span className="subnav-icon">
                <span key={"Nav-" + link.name} className="Nav-linkText">
                    <i className="iconfont icon-document"></i>
                    {link.name}
                </span>
            </span>
        );
    }


    private navFixed(): void {
        var offsetTOP = document.getElementById("Nav").offsetTop;
        window.onscroll = function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var currentTop = offsetTOP - scrollTop
            var nav = document.getElementById("Nav");
            if (scrollTop > 48) {
                nav.style.top = "0";
            } else {
                nav.style.top = "" + currentTop + "px";
            }
        }

    }
}
export default Menu;