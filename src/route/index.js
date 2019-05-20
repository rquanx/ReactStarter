import {
    loadable
} from "@services/common";

let route = [{
    exact: true,
    path: "/",
    component: loadable(import( /* webpackChunkName: "Home" */ '../pages/home'))
}, {
    path: "/page1",
    component: loadable(import( /* webpackChunkName: "Page1" */ '../pages/page1'))
}, {
    component: loadable(import( /* webpackChunkName: "NotMatch" */ '../pages/404'))
}]

export default route;