import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Notification from "./Notification";
import {INotificationProps,Notice} from "./Notification/index.d";

let Instance: INotificationProps[] = [];
let Div = null;

function onClick(callback = (e) => {}) {
    return (e) => {
        callback(e);
        close();
    }
}

function update(newConfig: INotificationProps) {
    if (Instance.length < 1) {
        // 没有时直接push，且显示这个对话框
        Instance.push(newConfig);
    }
    else if (Instance.length === 1) {
        // 只有一个且已被关闭的，替换现有的
        Instance[0] = { ...Instance[0], ...newConfig };
        newConfig = Instance[0];
    }
    else {
        // 多个时继续push
        let currentConfig = Instance[Instance.length - 1];
        Instance[Instance.length - 1] = { ...currentConfig, ...newConfig };
        newConfig = Instance[Instance.length - 1];
    }
    render(newConfig);
}

function showConfirm(newConfig: INotificationProps) {
    if (Instance.length < 1) {
        // 没有时直接push，且显示这个对话框
        Instance.push(newConfig);
    }
    else if (Instance.length === 1 && !Instance[0].visible) {
        // 只有一个且已被关闭的，替换现有的
        Instance[0] = newConfig;
    }
    else {
        // 多个时继续push
        Instance.push(newConfig);
    }
    render(newConfig);
}

function close() {
    let currentConfig;
    if (Instance.length > 1) {
        // 有多个时，被关闭，显示下一个
        Instance.pop();
        currentConfig = Instance[Instance.length - 1];
    }
    else {
        // 只有一个，被关闭时，隐藏
        currentConfig = Instance[Instance.length - 1];
        currentConfig.visible = false;
    }
    render(currentConfig);
}

function closeAll() {
    let config;
    while (Instance.length > 1) {
        let config = Instance.pop();
        if (config.onCancel && typeof config.onCancel === "function") {
            config.onCancel(null);
        }
    }
    if (config.onCancel && typeof config.onCancel === "function") {
        Instance[0].onCancel(null);
    }
    Instance[0].visible = false;
    render(Instance[0]);
}

function render(props: INotificationProps) {
    ReactDOM.render(<Notification {...props} />, Div);
}

const Confirm: Notice = (config) => {
    

    if (!Div) {
        Div = document.createElement('div');
        document.body.appendChild(Div);
    }


    let currentConfig = {
        ...config,
        onConfirm: onClick(config.onConfirm),
        onCancel: onClick(config.onCancel),
        visible: true
    }
    showConfirm(currentConfig);

    
    return {
        close,
        update,
        closeAll
    };
}
export default Confirm;