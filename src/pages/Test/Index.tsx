import React from "react";
import ReactDOM from "react-dom";
import Notification from "@components/Notification";
import JSOM from "@services/jsom";
import Caml from "@services/caml";
import { sp } from "@pnp/sp";
import Loading from "@components/Loading";

function Test() {
    Notification.Config(Loading.hideAll);
    //
    function onShow() {
        Loading.show();
        Loading.show();
    }

    function onShowDialog() {
        Notification.Confirm({
            subText: "123"
        });
    }

    function onGetListData() {
        JSOM.create("","Contacts").getListItem(Caml.Express().RowLimit(10).End()).then((e) => {console.log(e)},(e) => {console.log(e)});
    }
    return (<div>
        <button onClick={onShow} >open</button>
        <button id="Dialog" onClick={onShowDialog} >showdialog</button>
        <button id="Dialog" style={{ backgroundColor: "blue",marginLeft: "10px",width:"50px",height: "30px",borderRadius: "10%" }} onClick={onGetListData} >get</button>
    </div>);
}

// 挂载组件
ReactDOM.render(
    <Test></Test>,
    document.getElementById("app")
);
