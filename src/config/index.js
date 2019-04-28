const EnvType = {
  Local: "Local",
  Develop: "Develop",
  Product: "Product"
}
let env = EnvType.Develop;


let Config = {
  Api: {
    Base: "",
    LocalBase: "",
    BaseDocument: "",
    File: {
      Path: "",
    },
    Organization: {
      Path: "",
    },
    Workflow: {
      Path: "",
    },
    Report: {
      Path: "",
    },
    FileOperation: {
      Path: "",
    }
  },
  Lists: {
    MainLibrary: "MainLibrary",
    MainInvalidLibrary: "MainInvalidLibrary"
  },
  File: {
    Img: {
      Path: ""
    }
  },
  Pages: {
    Path: "",
    Size: 5,
    DisplayNum: 3,
    TimeSpan: 6
  },
  Site: {
    Path: location.protocol + '//' + location.host + location.pathname.split('/').slice(0, location.pathname.split('/').indexOf('Pages')).join('/')
  },
  Features: {
    Mock: true
  },
  Common: {}
};
export default Config;