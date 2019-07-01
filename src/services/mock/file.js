// 示例

import Config from "@src/config";
import mock from "./modal";
export let file = [
  mock(
    `${Config.Api.LocalBase}${Config.Api.Workflow.Path}${Config.Api.Workflow.FileApplyRecord}`,
    "get",
    {
      "Data|1-10": [
        {
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          "id|+1": 1,
          name: "@name"
        }
      ],
      StatusCode: 200
    }
  ),
  mock(
    `${Config.Api.LocalBase}${Config.Api.Workflow.Path}${Config.Api.Workflow.FileApplyRecord}`,
    "post",
    (param) => {
      console.log(param);
      return {
        "Data|1-10": [
          {
            "id|+1": 1,
            name: "@name"
          }
        ],
        StatusCode: 200
      };
    }
  )
];

export default file;
