import React, { Suspense, lazy } from "react";
import { HashRouter, Route, Switch, Link } from 'react-router-dom';
import Loading from "@components/Loading";
import { loadable } from "@services/common";
import "./App.css";

const Home = lazy(() => loadable(import(/* webpackChunkName: "Home" */ './pages/home')));
const Page1 = lazy(() => loadable(import(/* webpackChunkName: "Page1" */ './pages/page1')));
const NotMatch = lazy(() => loadable(import(/* webpackChunkName: "NotMatch" */ './pages/404')));

export class App extends React.Component<{}, {}> {
    render() {
        return (
            <HashRouter>
                <div  className="app" >
                    {/* 去除导航就只能通过链接进入对应的route */}
                    <ul>
                        <li>
                            <Link to="/" >Home</Link>
                        </li>
                        <li>
                            <Link to="/page1" >Page1</Link>
                        </li>
                    </ul>
                    <Suspense fallback={<Loading />}  >
                        <Switch>
                            <Route exact path="/" component={Home} ></Route>
                            <Route path="/page1" component={Page1}  ></Route>
                            <Route component={NotMatch} ></Route>
                        </Switch>
                    </Suspense>
                </div>
            </HashRouter>)
    }
}
export default App;
