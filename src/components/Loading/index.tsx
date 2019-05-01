import * as React from 'react';
import Notification from 'rc-notification'; // 可以不用，提供了定时和缓存
import Loading from "./Loading";


const notificationInstance = {};

// loading计数
let count = 0;
let defaultDuration = 0;    // 模态框不设置关闭时间

/**
 * 挂载loading模态框
 * @param key 
 * @param callback 
 */
function getNotificationInstance(
    key: string,
    callback: (n) => void,
) {
    const cacheKey = key;
    // 检查key对应的实例是否存在，对当前实例进行notice，可以进行更新
    if (notificationInstance[cacheKey]) {
        callback(notificationInstance[cacheKey]);
        return;
    }

    // 不存在时创建一个实例
    Notification.newInstance({},
        (notification) => {
            notificationInstance[cacheKey] = notification;
            callback(notification);
        },
    );
}

/**
 * count为0 实例化一个loading模态框，否则加1
 */
function notice() {
    const duration = defaultDuration;
    if (count === 0) {
        getNotificationInstance(
            "key",
            (notification) => {
                notification.notice({
                    content:
                        (<Loading visible={true} />),
                    duration,
                    key: "key",
                    closable: true,
                });
            },
        );
    }
    count++
}

/**
 * 关闭全部loading
 */
function hideAll() {
    // 遍历删除实例
    Object.keys(notificationInstance).forEach(cacheKey => {
        notificationInstance[cacheKey].destroy();
        delete notificationInstance[cacheKey];
    });
    count = 0;
}

/**
 * 关闭单个loading
 */
function hide() {
    count--;
    if (count === 0) {
        hideAll();
    }
}

Loading.show = notice;
Loading.hide = hide;
Loading.hideAll = hideAll;

export default Loading;
