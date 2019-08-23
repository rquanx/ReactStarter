import * as React from "react";
import Notification from "rc-notification";
import Loading from "./Loading";
// rc-notification不必要，可以去除，有一定的bug

const notificationInstance = {};

// loading计数
let count = 0;
let defaultDuration = 0; // 模态框不设置关闭时间

/**
 * 挂载loading模态框
 * @param key
 * @param callback
 */
function getNotificationInstance(key: string, callback: (n) => void) {
  const cacheKey = key;
  // 检查key对应的实例是否存在，对当前实例进行notice，可以进行更新
  if (notificationInstance[cacheKey]) {
    callback(notificationInstance[cacheKey]);
    return;
  }

  // 不存在时创建一个实例
  Notification.newInstance({}, (notification) => {
    notificationInstance[cacheKey] = notification;
    callback(notification);
  });
}

/**
 *count为0 实例化一个loading模态框，否则加1
 * @param message
 */
function notice(message: string) {
  const duration = defaultDuration;
  if (count === 0) {
    // 确保没有实例时再创建实例
    // 每次创建的实例都是不同的key,防止由于延迟删除后删除错误
    getNotificationInstance(`key-${Date.now().toString()}`, (notification) => {
      notification.notice({
        content: <Loading visible={true} message={message} />,
        duration,
        key: `key-${Date.now().toString()}`,
        closable: true
      });
    });
  }
  count++;
}

/**
 * 关闭全部loading
 */
function hideAll() {
  // 遍历删除实例,延迟删除，防止太快导致loading闪烁
  Object.keys(notificationInstance).forEach((cacheKey) => {
    setTimeout(() => {
      if ((notificationInstance as Object).hasOwnProperty(cacheKey)) {
        if (Object.getOwnPropertyNames(notificationInstance).length !== 0) {
          notificationInstance[cacheKey].destroy();
          delete notificationInstance[cacheKey];
        }
      }
    });
  });
  count = 0;
}

/**
 * 关闭单个loading
 */
function hide() {
  count--;
  if (count < 1) {
    hideAll();
    count = 0;
  }
}

Loading.show = notice;
Loading.hide = hide;
Loading.hideAll = hideAll;
Loading.isLoading = () => count > 0;
export default Loading;
