import Mock from "mockjs";
import { getRequest } from "@services/common";
import Config from "@src/config";
import file from "./file";

const SWITCH = "mock";
const searchArg = getRequest();
const apiList = [...file];

if (searchArg[SWITCH] || Config.Features.Mock) {
  console.log("mock open");
  apiList.forEach(({ path, type, template }) => {
    let url = typeof path === "string" ? RegExp(`${url}.*`) : path;
    let tem =
      typeof template === "function"
        ? template
        : (param) => {
            console.log(param);
            return template;
          };
    Mock.mock(url, type, tem);
  });
}
