const fs = require("fs");
const path = require("path");

function getEntry(pagesPath) {
  let entry = {};
  // 读取、设置打包入口
  fs.readdirSync(pagesPath).map((item) => {
    let temp = path.join(pagesPath, item);
    // 若当前的为文件夹
    if (
      fs.statSync(temp).isDirectory() &&
      fs.readdirSync(temp).some((item) => /index\.(jsx?$)|(tsx?$)/.test(item))
    ) {
      entry[item] = `${pagesPath}${item}`;
    }
  });
  return entry;
}

function globalImport(entry, importList) {
  let keys = Object.keys(entry);
  if (Array.isArray(importList)) {
    keys.forEach((key) => {
      entry[key] = [
        ...importList,
        ...(Array.isArray(entry[key]) ? entry[key] : [entry[key]])
      ];
    });
  } else {
    keys.forEach((key) => {
      entry[key] = [
        importList,
        ...(Array.isArray(entry[key]) ? entry[key] : [entry[key]])
      ];
    });
  }
  return entry;
}

module.exports = {
  getEntry,
  globalImport
};
