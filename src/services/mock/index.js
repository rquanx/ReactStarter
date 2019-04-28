import Mock from "mockjs";
import {
    getRequest
} from "../common";
import Config from "@src/config";
import file from './file';
let SWITCH = "mock";
let searchArg = getRequest();

if (searchArg[SWITCH] || Config.Features.Mock) {
    let apiList = [...file];
    apiList.forEach((api) => {
        Mock.mock(RegExp(`${api.url}.*`), api.type, function (param) {
            console.log(param);
            return Mock.mock(api.data)
        });
    })
    console.log("mock open");
}