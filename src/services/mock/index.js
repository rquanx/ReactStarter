import Mock from "mockjs";
import {
    getRequest
} from "@services/common";
import Config from "@src/config";
import file from './file';
let SWITCH = "mock";
let searchArg = getRequest();

if (searchArg[SWITCH] || Config.Features.Mock) {
    console.log("mock open");
    
    let apiList = [...file];
    apiList.forEach(({
        url,
        type,
        data
    }) => {
        Mock.mock(RegExp(`${url}.*`), type, function (param) {
            console.log(param);
            return Mock.mock(data)
        });
    })
}