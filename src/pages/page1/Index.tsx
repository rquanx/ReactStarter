import React from "react";
import "./Index.css";
import Loading from "@components/Loading";
import Notification from "@components/Notification";
import JSOM from "@services/jsom";
export const Page1 = () => {
  JSOM.Config({
    before: Loading.show,
    after: Loading.hide
  });

  Notification.Config({
    beforeRender: p => {
      console.log("b", p);
    },
    beforeShow: Loading.hideAll,
    afterRender: p => {
      console.log("a", p);
    }
  });

  function showLoading() {
    Loading.show();
    setTimeout(() => {
      //Loading.hide();
    });
  }

  function showDialog() {
    Notification.Confirm({
      subText: "test",
      content: <span>test</span>,
      onConfirm: () => {
        console.log("confirm");
      },
      onCancel: () => {
        console.log("cancel");
      }
    });
  }
  function jsomTest() {
    console.log("test");
    JSOM.create("", "AccInfo")
      .getListItem("")
      .then(
        e => {
          console.log(e);
        },
        e => {
          console.log(e);
        }
      );
  }

  return (
    <div>
      Page1
      <button onClick={showLoading}>loading</button>
      <button id="dialog" onClick={showDialog}>
        dialog
      </button>
      <button id="jsom" onClick={jsomTest}>
        jsomTest
      </button>
    </div>
  );
};

export default Page1;
