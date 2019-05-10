import React from "react";
import "./Index.css";
import Loading from "@components/Loading";
import Notification from "@components/Notification";
import JSOM from "@services/jsom";
export const Page1 = () => {
    function showLoading() {
        Loading.show();
        setTimeout(() => {
            Loading.hide();
        });
    }
    function showDialog() {
        Notification.Confirm({
            subText: "test",
            content: <span>test</span>,
            onConfirm: () => {console.log("confirm")},
            onCancel: () => {console.log("cancel")}
        });
    }

    function jsomTest() {
        console.log("test");
        JSOM.create("", "TestLib").getListItem("").then((e) => { console.log(e) }, (e) => { console.log(e) })
    }

    return <div>Page1
        <button onClick={showLoading} >loading</button>
        <button onClick={showDialog} >dialog</button>
        <button onClick={jsomTest} >jsomTest</button>
    </div>
}

export default Page1;