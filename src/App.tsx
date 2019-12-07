import React, { Suspense, lazy } from "react";
import { HashRouter, Route, Switch, Link } from 'react-router-dom';
import Loading from "@components/Loading";
import { loadable } from "@services/common";
import "./App.css";
import Menu from "@components/Menu";
import Header from "@components/Header";
import { T } from "@services/translation";

// fabric react icon initial
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
initializeIcons("../assets/fonts/uifabric/");
const Home = lazy(() => loadable(import(/* webpackChunkName: "Home" */ './pages/home')));
const ErrorPage = lazy(() => loadable(import(/* webpackChunkName: "ErrorPage" */ './pages/error_page')));


interface IAppState {
    info: any
}
export class App extends React.Component<{}, IAppState> {
    private menus = {}
    constructor(props) {
        super(props);
        this.state = {
            info: undefined
        }
        this.menus = [{
            links: [
                {
                    name: T("首页"),
                    url: '/html/App.html#/',
                    icon: 'Home',
                    key: 'home'
                },
                {
                    name: T('列表{key}', { key: 'CRUD' }),
                    url: '/html/App.html#/listCRUD',
                    icon: 'Table',
                    key: 'listCRUD'
                },
                {
                    name: T('新闻详情'),
                    url: '/html/App.html#/news-detail-page',
                    icon: 'News',
                    key: 'news-detail-page'
                },
                {
                    name: T('新闻列表'),
                    url: '/html/App.html#/news-list-page',
                    icon: 'AllApps',
                    key: 'news-list-page'
                }
                ,
                {
                    name: T('轮播图'),
                    url: '/html/App.html#/carousel-page',
                    icon: 'AspectRatio',
                    key: 'carousel-page'
                },
            ]
        }]
    }
    render() {
        return (
            <HashRouter>
                <div className="app" >
                    {/* 去除导航就只能通过链接进入对应的route */}
                    <Header info={this.state.info}></Header>
                    <Menu
                        menus={(this.menus) as any}
                    />
                    <div className="sr-app-content">
                        <Suspense fallback={<Loading />}  >
                            <Switch>
                                <Route exact path="/" component={Home} ></Route>
                                <Route component={ErrorPage} ></Route>
                            </Switch>
                        </Suspense>
                    </div>
                </div>
            </HashRouter>)
    }

}
export default App;
