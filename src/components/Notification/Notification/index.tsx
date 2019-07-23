import * as React from 'react';
import {
  PrimaryButton,
  DefaultButton
} from 'office-ui-fabric-react/lib/Button';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import {
  Dialog,
  DialogType,
  DialogFooter
} from 'office-ui-fabric-react/lib/Dialog';
import { INotificationProps, INotification, IAOP, NotificationResult } from './index.d';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
initializeIcons(/* optional base url */);

const Operation = {
  beforeRender: [],
  beforeShow: [],
  afterRender: []
};

const DefaultProps: INotificationProps = {
  subText: '',
  title: '提示',
  confirmText: '确定',
  cancelText: '取消'
};

const DefaultNotificationResult: NotificationResult = {
  close: () => undefined,
  update: (newConfig) => undefined,
  closeAll: () => undefined
};

const aop = (before = undefined, after = undefined) => (fun, param, ...arg) => {
  before && before(param, arg);
  const r = fun(param, arg);
  after && after(param, arg);
  return r;
};

function before(props: INotificationProps) {
  Operation.beforeRender.forEach((item) => {
    if (typeof item === 'function') {
      item(props);
    }
  });
  Operation.beforeShow.forEach((item) => {
    if (props.visible && typeof item === 'function') {
      item(props);
    }
  });
}

function after(props: INotificationProps) {
  Operation.afterRender.forEach((item) => {
    if (typeof item === 'function') {
      item(props);
    }
  });
}

export let Notification: INotification = (props: INotificationProps) => {
  function onConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    if (props.onConfirm && typeof props.onConfirm === 'function') {
      props.onConfirm(e);
    }
  }

  function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
    if (props.onCancel && typeof props.onCancel === 'function') {
      props.onCancel(e);
    }
  }

  return aop(before, after)(
    () => (
      <Modal
        isOpen={props.visible}
        isBlocking={false}
        containerClassName='ms-modalExample-container'
      >
        <Dialog
          key='Notification'
          hidden={false}
          onDismiss={onCancel}
          className='diolog-tips'
          dialogContentProps={{
            type: DialogType.normal,
            title: props.title ? props.title : DefaultProps.title,
            subText: props.subText
          }}
        >
          {props.content}
          <DialogFooter>
            <PrimaryButton
              key='confirm'
              className='confirm-btn'
              onClick={onConfirm}
              text={
                props.confirmText ? props.confirmText : DefaultProps.confirmText
              }
              {...props.confirmButtonProps}
            />
            <DefaultButton
              key='cancel'
              className='cancel-btn'
              onClick={onCancel}
              text={
                props.cancelText ? props.cancelText : DefaultProps.cancelText
              }
              {...props.cancelButtonProps}
            />
          </DialogFooter>
        </Dialog>
      </Modal>
    ),
    props
  );
};

Notification.Config = ({
  beforeRender = undefined,
  beforeShow = undefined,
  afterRender = undefined
}: IAOP) => {
  beforeRender && Operation.beforeRender.push(beforeRender);
  beforeShow && Operation.beforeShow.push(beforeShow);
  afterRender && Operation.afterRender.push(afterRender);
};

Notification.Confirm = (props?) => {
  console.log('null');
  return DefaultNotificationResult;
};

Notification.Error = (props?) => {
  console.log('null');
  return DefaultNotificationResult;
};

export default Notification;
