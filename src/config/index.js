const EnvType = {
  Local: "Local",
  Develop: "Develop",
  Product: "Product"
}
let env = EnvType.Develop;


let Config = {
  Api: {
    Base: env === EnvType.Develop ? "http://192.168.20.47:8011/" : "",
    File: {
      Path: "Api/File/",
      GetInvalidCorrelationFiles: "GetInvalidCorrelationFiles",
    },
  },
  Lists: {
    MainLibrary: "MainLibrary",
  },
  File: {
    Img: {
      Path: env === EnvType.Local ? "../assets/img" : "/recordmanagement/Style Library/Carsgen/img/"
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