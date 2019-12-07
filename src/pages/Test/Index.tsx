import React from "react";
import ReactDOM from "react-dom";
import Notification from "@components/Notification";
import Loading from "@components/Loading";

function Test() {
  Notification.Config({ beforeShow: Loading.hideAll });
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
    // sp.setup({
    //   sp: {
    //     baseUrl: "../",
    //     headers: { Accept: "application/json;odata:verbose" }
    //   }
    // });

    // sp.web.lists
    //   .getByTitle("AppConfig")
    //   .items.getAll()
    //   .then(
    //     e => {
    //       console.log(e);
    //     },
    //     e => {
    //       console.log(e);
    //     }
    //   );
  }
  return (
    <div>
      <button onClick={onShow}>open</button>
      <button id="Dialog" onClick={onShowDialog}>
        showdialog
      </button>
      <button id="Dialog" onClick={onGetListData}>
        get
      </button>
    </div>
  );
}

// 挂载组件
ReactDOM.render(<Test></Test>, document.getElementById("app"));
