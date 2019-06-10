import * as React from 'react';
import Notification from 'rc-notification';
import Notice from './Notice'

const notificationInstance = {};

// loading计数
let count = 0;
let defaultDuration = 2;    // 设置关闭时间

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
 * 实例化
 */
function notice(title: string, type: string) {
    const duration = defaultDuration;
    // 每次创建的实例都是不同的key,防止由于延迟删除后删除错误
    getNotificationInstance(
        `key-${Date.now().toString()}`,
        (notification) => {
            notification.notice({
                content:
                    (<Notice title={title} type={type} />),
                duration,
                key: `key-${Date.now().toString()}`,
                closable: true,
            });
        },
    );
}


Notice.Success = (title) => {
    return notice(title,'success')
};
Notice.Error = (title) => {
    return notice(title,'error')
};

export default Notice;