/**
 * lajax
 * log + ajax ????????
 * Author: Sky.Sun
 * Date: 2017/08/15
 */
function check(condiction, message) {
  if (condiction) {
    throw new Error(message);
  }
}

function getAttributeList(queue) {
  return queue.map((item) => {
    return {
      Message: {
        value: encodeURI(JSON.stringify(item.messages)),
        type: "Text"
      },
      Time: {
        value: item.time,
        type: "Text"
      },
      Level: {
        value: item.level,
        type: "Text"
      },
      Agent: {
        value: item.agent,
        type: "Text"
      }
    };
  });
}
/**
 * ? Error ???? JSON ???
 */
if (!("toJSON" in Error.prototype)) {
  /* eslint-disable no-extend-native */
  Object.defineProperty(Error.prototype, "toJSON", {
    value() {
      const alt = {};
      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);
      return alt;
    },
    configurable: true,
    writable: true
  });
  /* eslint-enable no-extend-native */
}
class Lajax {
  /* eslint-disable no-console, no-bitwise*/
  /**
   * @param {{JSOM: any,getFolderPath: any,url: string,autoLogError: boolean,autoLogRejection: boolean,autoLogAjax: boolean,logAjaxFilter: any,stylize: any,showDesc: any,customDesc: any,interval: number,maxErrorReq: number}} param
   */
  constructor(param) {
    let config = param;
    check(
      typeof config === "undefined",
      "log????? - ????????????"
    );
    if (typeof config === "string") {
      config = {
        url: param
      };
    } else if (typeof config === "object") {
      if (!param.JSOM) {
        check(
          typeof param.url !== "string",
          "log????? - ??????? url ?????????"
        );
        check(
          param.logAjaxFilter != null &&
          typeof param.logAjaxFilter !== "function",
          "log????? - ??????? logAjaxFilter ????????"
        );
        check(
          param.customDesc != null && typeof param.customDesc !== "function",
          "log????? - ??????? customDesc ????????"
        );
      }
    } else {
      check(true, "log????? - ?????????????");
    }
    this.JSOM = config.JSOM;
    /** ??Item?????? */
    this.getFolderPath = config.getFolderPath ? config.getFolderPath : () => "";
    // ??? url ??
    this.url = config.url;
    // ???????????
    this.autoLogError =
      config.autoLogError == null ? true : config.autoLogError;
    // ?????? Promise ??
    this.autoLogRejection =
      config.autoLogRejection == null ? true : config.autoLogRejection;
    // ?????? ajax
    this.autoLogAjax = config.autoLogAjax == null ? true : config.autoLogAjax;
    // ??? ajax ????????
    const defaultLogAjaxFilter = (ajaxUrl, ajaxMethod) => true;
    // ajax ??????????? true ????????false ???????
    this.logAjaxFilter =
      config.logAjaxFilter == null ?
      defaultLogAjaxFilter :
      config.logAjaxFilter;
    // ?????? console ?????
    this.stylize = config.stylize == null ? true : config.stylize;
    this.stylize = this.stylize && this._stylizeSupport();
    // ????????
    this.showDesc = config.showDesc == null ? true : config.showDesc;
    // ??????????
    this.customDesc = config.customDesc;
    // ?????????????
    const defaultInterval = 10000;
    // ??????
    this.interval = config.interval == null ? defaultInterval : config.interval;
    // ???????????
    const defaultMaxErrorReq = 5;
    // ?????????????????????????????????????
    this.maxErrorReq =
      config.maxErrorReq == null ? defaultMaxErrorReq : config.maxErrorReq;
    // ????????
    this.errorReq = 0;
    // ????
    this.queue = [];
    // ??????? xhr ??
    this.xhr = null;
    // xhr ?? open ??
    this.xhrOpen = XMLHttpRequest.prototype.open;
    // xhr ?? send ??
    this.xhrSend = XMLHttpRequest.prototype.send;
    // ???
    this._init();
  }
  /**
   * ?????
   *
   * @memberof Lajax
   */
  _init() {
    // ??????id
    this._getReqId();
    // ????????????
    this._loadFromStorage();
    // ??????
    this._printDesc();
    // ??????
    this._exceptionHandler();
    // ???? ajax ??
    this._ajaxHandler();
    // ????????
    this._storageUnsendData();
    // ????????
    this.timer = setInterval(() => {
      this._send();
    }, this.interval);
  }
  /**
   * ?????????? id
   *
   * @memberof Lajax
   */
  _getReqId() {
    this.reqId = document.querySelector('[name="_reqId"]') ?
      document.querySelector('[name="_reqId"]').content :
      "";
    if (!this.reqId) {
      this.reqId = window._reqId;
    }
    if (this.reqId) {
      // ?? reqId???????????????????????
      this.idFromServer = true;
    } else {
      // ????? reqId????????????????????? reqId https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
      let time = Date.now();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        // ?????????
        time += performance.now();
      }
      this.reqId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        (char) => {
          const rand = (time + Math.random() * 16) % 16 | 0;
          time = Math.floor(time / 16);
          return (char === "x" ? rand : (rand & 0x3) | 0x8).toString(16);
        }
      );
      this.idFromServer = false;
    }
  }
  /**
   * ?????????
   *
   * @param {number} lastUnsend - ??????????????
   * @param {string} reqId - ??id
   * @param {boolean} idFromServer - ??id???????
   * @returns ???????
   * @memberof Lajax
   */
  _defaultDesc(lastUnsend, reqId, idFromServer) {
    return `?? ???????????
  ????????? ${this.autoLogError ? "?" : "?"}
  ????Promise??? ${this.autoLogRejection ? "?" : "?"}
  ????Ajax??? ${this.autoLogAjax ? "?" : "?"}
  ??????id?${reqId}${idFromServer ? " (?????)" : " (????)"}`;
  }
  /**
   * ??????
   *
   * @memberof Lajax
   */
  _printDesc() {
    if (console && this.showDesc) {
      let desc;
      if (this.customDesc) {
        // ?????
        desc = this.customDesc(this.lastUnsend, this.reqId, this.idFromServer);
      } else {
        // ????
        desc = this._defaultDesc(
          this.lastUnsend,
          this.reqId,
          this.idFromServer
        );
      }
      if (this.stylize) {
        console.log(
          `%c${desc}`,
          `color: ${Lajax.colorEnum.desc}; font-family: ??; line-height: 1.5;`
        );
      } else {
        console.log(desc);
      }
    }
  }
  /**
   * ?????????
   *
   * @returns
   * @memberof Lajax
   */
  _isSecret() {
    try {
      const testKey = "lajax-test";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return false;
    } catch (error) {
      return true;
    }
  }
  /**
   * ? localStorage ????????????
   *
   * @memberof Lajax
   */
  _loadFromStorage() {
    if (!this._isSecret()) {
      const lastData = JSON.parse(window.localStorage.getItem("lajax"));
      if (Array.isArray(lastData) && lastData.length) {
        this.lastUnsend = lastData.length;
        this.queue = lastData;
        // ??????
        this._send();
      }
      window.localStorage.removeItem("lajax");
    }
  }
  /**
   * ??????
   *
   * @memberof Lajax
   */
  _exceptionHandler() {
    // ???????
    if (this.autoLogError) {
      window.addEventListener("error", (err) => {
        this.error("[OnError]", err.message, `(${err.lineno}?${err.colno}?)`);
      });
    }
    // Promise ?????
    if (this.autoLogRejection) {
      window.addEventListener("unhandledrejection", (err) => {
        this.error("[OnRejection]", err.reason);
      });
    }
  }
  /**
   * ??????? console ?????
   * ?? Chrome ? firefox ?????
   *
   * @memberof Lajax
   */
  _stylizeSupport() {
    const isChrome = !!window.chrome;
    const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;
    return isChrome || isFirefox;
  }
  /**
   * ?? url
   *
   * @param {string} url
   * @returns
   * @memberof Lajax
   */
  _resolveUrl(url) {
    const link = document.createElement("a");
    link.href = url;
    return `${link.protocol}//${link.host}${link.pathname}${link.search}${
  link.hash
  }`;
  }
  /**
   * ???? ajax ??
   *
   * @memberof Lajax
   */
  _ajaxHandler() {
    if (this.autoLogAjax) {
      const that = this;
      // ?? open ??
      XMLHttpRequest.prototype.open = function (...args) {
        this._lajaxMethod = args[0];
        this._lajaxUrl = that._resolveUrl(args[1]);
        that.xhrOpen.apply(this, args);
      };
      // ?? send ??
      XMLHttpRequest.prototype.send = function (data) {
        // ??????
        const startTime = new Date();
        // ???????????????? ajax
        if (that.logAjaxFilter(this._lajaxUrl, this._lajaxMethod)) {
          // ??????????
          that._pushToQueue(
            startTime,
            Lajax.levelEnum.info,
            `[ajax] ??${this._lajaxMethod.toLowerCase()}???${
  this._lajaxUrl
  }`
          );
          // ???????? id
          this.setRequestHeader("X-Request-Id", that.reqId);
        }
        // ?? readystatechange ??
        this.addEventListener("readystatechange", function () {
          // ???????????????? ajax
          if (that.logAjaxFilter(this._lajaxUrl, this._lajaxMethod)) {
            try {
              if (this.readyState === XMLHttpRequest.DONE) {
                // ????????????????????????????
                if (console && console.group && that.stylize) {
                  console.group(
                    "%cajax??",
                    `color: ${Lajax.colorEnum.ajaxGroup};`
                  );
                }
                that._printConsole(
                  startTime,
                  Lajax.levelEnum.info,
                  `[ajax] ??${this._lajaxMethod.toLowerCase()}???${
  this._lajaxUrl
  }`
                );
                // ??????
                const endTime = new Date();
                // ????
                const costTime = (endTime - startTime) / 1000;
                const msgs = [];
                if (this.status >= 200 && this.status < 400) {
                  msgs.push("???????");
                } else {
                  msgs.push("???????");
                }
                msgs.push(
                  `?????${costTime}s URL?${this._lajaxUrl} ?????${
  this._lajaxMethod
  }`
                );
                if (this._lajaxMethod.toLowerCase() === "post") {
                  msgs.push("?????", data);
                }
                msgs.push(`????${this.status}`);
                if (this.status >= 200 && this.status < 400) {
                  that.info("[ajax]", ...msgs);
                } else {
                  that.error("[ajax]", ...msgs);
                }
                if (console && console.group) {
                  console.groupEnd();
                }
              }
            } catch (err) {
              const msgs = [];
              msgs.push("???????");
              msgs.push(
                `URL?${this._lajaxUrl} ?????${this._lajaxMethod}`
              );
              if (this._lajaxMethod.toLowerCase() === "post") {
                msgs.push("?????", data);
              }
              msgs.push(`????${this.status}`);
              msgs.push(`ERROR?${err}`);
              that.error("[ajax]", ...msgs);
            }
          }
        });
        that.xhrSend.call(this, data);
      };
    }
  }
  /**
   * ?????????????????
   *
   * @memberof Lajax
   */
  _storageUnsendData() {
    window.onunload = () => {
      // ????????
      if (this.queue.length) {
        if (
          !this.JSOM &&
          navigator.sendBeacon &&
          navigator.sendBeacon(this.url, JSON.stringify(this.queue))
        ) {
          // ???????sendBeacon??????????????????
          this.queue = [];
        } else if (!this._isSecret()) {
          // ???sendBeacon????????????localStorage?????????????????
          window.localStorage.setItem("lajax", JSON.stringify(this.queue));
        } else {
          // ????????????????????????
          this._send();
        }
      }
    };
  }
  /**
   * ??????
   *
   * @memberof Lajax
   */
  _send() {
    if (this.queue.length) {
      if (this.JSOM) {
        this._sendByJSOM();
      } else {
        this._sendByAjax();
      }
    }
  }
  _sendByJSOM() {
    let that = this;
    let logCount = this.queue.length;
    let attributeList = getAttributeList(this.queue);

    function sendSuccess(result) {
      // ?????????????????
      that.queue.splice(0, logCount);
      // ????????
      that.errorReq = 0;
      if (console) {
        if (that.stylize) {
          console.log(
            `%c[${that._getTimeString(null)}] - ${logCount}????????`,
            `color: ${Lajax.colorEnum.sendSuccess}`
          );
        } else {
          console.log(`${logCount}????????`);
        }
      }
      return result;
    }

    function sendError(result) {
      that._printConsole(null, Lajax.levelEnum.error, `JSOM?????????`, result);
      that._checkErrorReq();
      return result;
    }
    return this.JSOM.refresh()
      .createListItems(this.getFolderPath(), attributeList)
      .then(sendSuccess, sendError);
  }
  _sendByAjax() {
    const logCount = this.queue.length;
    // ???? this.xhr????????????????????????????????????
    if (this.xhr) {
      // ????????????null???????????
      this.xhr.onreadystatechange = null;
      this.xhr.abort();
    }
    try {
      this.xhr = new XMLHttpRequest();
      this.xhrOpen.call(this.xhr, "POST", this.url, true);
      this.xhr.setRequestHeader(
        "Content-Type",
        "application/json; charset=utf-8"
      );
      this.xhrSend.call(this.xhr, JSON.stringify(this.queue));
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === XMLHttpRequest.DONE) {
          if (this.xhr.status >= 200 && this.xhr.status < 400) {
            // ?????????????????
            this.queue.splice(0, logCount);
            // ????????
            this.errorReq = 0;
            // ????????
            if (console) {
              if (this.stylize) {
                console.log(
                  `%c[${this._getTimeString(
  null
  )}] - ${logCount}????????`,
                  `color: ${Lajax.colorEnum.sendSuccess}`
                );
              } else {
                console.log(`${logCount}????????`);
              }
            }
          } else {
            this._printConsole(
              null,
              Lajax.levelEnum.error,
              `?????????????????${this.url} ????${
  this.xhr.status
  }`
            );
            this._checkErrorReq();
          }
          this.xhr = null;
        }
      };
    } catch (err) {
      this._printConsole(
        null,
        Lajax.levelEnum.error,
        `?????????????????${this.url}`
      );
      this._checkErrorReq();
      this.xhr = null;
    }
  }
  /**
   * ????????
   *
   * @memberof Lajax
   */
  _checkErrorReq() {
    // ????? +1
    this.errorReq++;
    // ?????????????????????
    if (this.errorReq >= this.maxErrorReq) {
      clearInterval(this.timer);
      this._printConsole(
        null,
        Lajax.levelEnum.warn,
        `??????????????????????????????? ${
  this.url
  } ?????`
      );
    }
  }
  /**
   * ???????
   *
   * @param {Date} time - ????
   * @returns
   * @memberof Lajax
   */
  _getTimeString(time) {
    const now = time === null ? new Date() : time;
    // ?
    let hour = String(now.getHours());
    if (hour.length === 1) {
      hour = `0${hour}`;
    }
    // ?
    let minute = String(now.getMinutes());
    if (minute.length === 1) {
      minute = `0${minute}`;
    }
    // ?
    let second = String(now.getSeconds());
    if (second.length === 1) {
      second = `0${second}`;
    }
    // ??
    let millisecond = String(now.getMilliseconds());
    if (millisecond.length === 1) {
      millisecond = `00${millisecond}`;
    } else if (millisecond.length === 2) {
      millisecond = `0${millisecond}`;
    }
    return `${hour}:${minute}:${second}.${millisecond}`;
  }
  /**
   * ?????????
   *
   * @param {Date} time - ????
   * @returns
   * @memberof Lajax
   */
  _getDateTimeString(time) {
    const now = time === null ? new Date() : time;
    // ?
    const year = String(now.getFullYear());
    // ?
    let month = String(now.getMonth() + 1);
    if (month.length === 1) {
      month = `0${month}`;
    }
    // ?
    let day = String(now.getDate());
    if (day.length === 1) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day} ${this._getTimeString(now)}`;
  }
  /**
   * ???? console ????
   *
   * @param {any} time
   * @param {any} level
   * @param {any} args
   * @memberof Lajax
   */
  _printConsole(time, level, ...args) {
    if (console) {
      if (this.stylize) {
        console[level](
          `%c[${this._getTimeString(time)}] [${level.toUpperCase()}] -`,
          `color: ${Lajax.colorEnum[level]}`,
          ...args
        );
      } else {
        console[level](...args);
      }
    }
  }
  /**
   * ?????????
   *
   * @param {any} time
   * @param {any} level
   * @param {any} args
   * @memberof Lajax
   */
  _pushToQueue(time, level, ...args) {
    args.unshift(`{${this.reqId}}`);
    this.queue.push({
      time: this._getDateTimeString(time),
      level,
      messages: args,
      url: window.location.href,
      agent: navigator.userAgent
    });
  }
  /**
   * ???????????????
   *
   * @param {Date} time - ????
   * @param {Lajax.levelEnum} level - ????
   * @param {any} args - ????
   * @memberof Lajax
   */
  _log(time, level, ...args) {
    // ???? console ????
    this._printConsole(time, level, ...args);
    // ?????????
    this._pushToQueue(time, level, ...args);
  }
  /**
   * ????????
   *
   * @param {any} args - ????
   * @memberof Lajax
   */
  info(...args) {
    this._log(null, Lajax.levelEnum.info, ...args);
  }
  /**
   * ????????
   * info ?????
   *
   * @param {any} args
   * @memberof Lajax
   */
  log(...args) {
    this.info(...args);
  }
  /**
   * ????????
   *
   * @param {any} args - ????
   * @memberof Lajax
   */
  warn(...args) {
    this._log(null, Lajax.levelEnum.warn, ...args);
  }
  /**
   * ????????
   *
   * @param {any} args - ????
   * @memberof Lajax
   */
  error(...args) {
    this._log(null, Lajax.levelEnum.error, ...args);
  }
  /* eslint-enable no-console, no-bitwise*/
}
/**
 * ??????
 */
Lajax.levelEnum = {
  /**
   * ??
   */
  info: "info",
  /**
   * ??
   */
  warn: "warn",
  /**
   * ??
   */
  error: "error"
};
/**
 * ??????
 */
Lajax.colorEnum = {
  /**
   * ????????????
   */
  info: "DodgerBlue",
  /**
   * ????????????
   */
  warn: "orange",
  /**
   * ???????????
   */
  error: "red",
  /**
   * ajax?????????
   */
  ajaxGroup: "#800080",
  /**
   * ?????????????
   */
  sendSuccess: "green",
  /**
   * ????????????
   */
  desc: "#d30775"
};
export default Lajax;