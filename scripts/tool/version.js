const fs = require("fs");

function setVersion(version, source, target) {
  try {
    var content = fs.readFileSync(source).toString();
    if (content.match(/Version:.*,/)[0].match(/\d.*\d/)[0] !== version) {
      create(target, version);
      fs.writeFileSync(
        source,
        content.replace(/Version:.*,/, `Version: "${version}",`)
      );
      console.log("版本更新！");
    }
  } catch (error) {
    console.log("版本更新异常：", error);
  }
}

function create(target, version) {
  try {
    fs.statSync(target);
  } catch (error) {
    fs.mkdirSync(target);
  }

  fs.writeFileSync(
    `${target}/version.json`,
    JSON.stringify({
      webview: version
    })
  );
}

module.exports = {
  setVersion
};
