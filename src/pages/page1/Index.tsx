import React from "react";
import "./Index.css";
import Loading from "@components/Loading";
export const Page1 = () => {
    function show() {
        Loading.show();
        setTimeout(() => {
            Loading.hide();
        })
    }

    return <div>Page1
        <button onClick={show} >11</button>
    </div>
}

export default Page1;