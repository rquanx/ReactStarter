import React from "react";
import {
    PrimaryButton,
    DefaultButton,
    IButtonProps
} from "office-ui-fabric-react/lib/Button";
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import {
    Dialog,
    DialogType,
    DialogFooter,
    IDialogProps
} from "office-ui-fabric-react/lib/Dialog";
import { Mode } from "./Enum";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
initializeIcons(/* optional base url */);

/**
 * @param {string} title 标题
 * @param {string} subText 内容
 * @param {string} confirmText 确认按钮文字
 * @param {string} cancelText 取消按钮文字
 * @param {Mode} mode 对话框模式
 * @param {(e: React.MouseEvent<HTMLButtonElement>) => void} onConfirm 确认函数
 * @param {(e: React.MouseEvent<HTMLButtonElement>) => void} onCancel 取消函数
 * @param {boolean} visible 是否显示
 * @param {any} icon 图标
 * @param {any} content 子元素
 * @param {any} confirmButtonProps 标题
 * @param {any} cancelButtonProps 标题
 */
export interface INotificationProps {
    title?: string;
    subText?: string;
    confirmText?: string;
    cancelText?: string;
    mode?: Mode;
    onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    visible?: boolean;
    icon?: any;
    content?: React.ReactNode;
    dialogProps?: IDialogProps;
    confirmButtonProps?: IButtonProps;
    cancelButtonProps?: IButtonProps;
}

const Operation = {
    beforeRender: [],
    beforeShow: [],
    afterRender: []
}

const DefaultProps: INotificationProps = {
    subText: "",
    title: "提示",
    confirmText: "确定",
    cancelText: "取消",
}

const aop = (before = undefined, after = undefined) => (fun, param, ...arg) => {
    before && before(param, arg);
    let r = fun(param, arg);
    after && after(param, arg);
    return r;
}

function before(props: INotificationProps) {
    Operation.beforeRender.forEach((item) => {
        if (typeof item === "function") {
            item(props);
        }
    });
    Operation.beforeShow.forEach((item) => {
        if (props.visible && typeof item === "function") {
            item(props);
        }
    });
}

function after(props: INotificationProps) {
    Operation.afterRender.forEach((item) => {
        if (typeof item === "function") {
            item(props);
        }
    });
}

Notification.Config = ({ beforeRender = undefined, beforeShow = undefined, afterRender = undefined }) => {
    beforeRender && Operation.beforeRender.push(beforeRender);
    beforeShow && Operation.beforeShow.push(beforeShow);
    afterRender && Operation.afterRender.push(afterRender);
};

Notification.Confirm = (props?: INotificationProps) => { console.log("null") };
Notification.Error = (props?: INotificationProps) => { console.log("null") };

export function Notification(props: INotificationProps) {

    function onConfirm(e: React.MouseEvent<HTMLButtonElement>) {
        if (props.onConfirm && typeof props.onConfirm === "function") {
            props.onConfirm(e);
        }
    }

    function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
        if (props.onCancel && typeof props.onCancel === "function") {
            props.onCancel(e);
        }
    }
    
    return aop(before, after)(() => (
        <Modal
            isOpen={props.visible}
            isBlocking={false}
            containerClassName="ms-modalExample-container"
        >
            <Dialog
                key="Notification"
                hidden={false}
                onDismiss={onCancel}
                className="diolog-tips"
                dialogContentProps={{
                    type: DialogType.normal,
                    title: props.title ? props.title : DefaultProps.title,
                    subText: props.subText
                }}
            >
                {props.content}
                <DialogFooter >
                    <PrimaryButton
                        key="confirm"
                        className="confirm-btn"
                        onClick={onConfirm}
                        text={props.confirmText ? props.confirmText : DefaultProps.confirmText}
                        {...props.confirmButtonProps} />
                    <DefaultButton
                        key="cancel"
                        className="cancel-btn"
                        onClick={onCancel}
                        text={props.cancelText ? props.cancelText : DefaultProps.cancelText}
                        {...props.cancelButtonProps} />
                </DialogFooter>
            </Dialog>
        </Modal>), props);
}

export default Notification;