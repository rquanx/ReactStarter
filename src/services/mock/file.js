// 示例

import Config from "@src/config";
import mock from "./modal";
export let file = [
  mock(
    `${Config.Api.Base}${Config.Api.File.GetInvalidCorrelationFiles}`,
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
  ),mock(
    `${Config.Api.Base}${Config.Api.File.GetInvalidCorrelationFiles}`,
    "post",
    (param) => {
      console.log(param);
      return {
        Data: [
          {
            "id": 1,
            name: "name"
          },
          {
            "id": 2,
            name: "name2"
          }
        ],
        StatusCode: 200
      };
    }
  )
];

export default file;
