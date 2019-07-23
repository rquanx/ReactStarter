import {
  IButtonProps
} from "office-ui-fabric-react/lib/Button";
import {
  IDialogProps
} from "office-ui-fabric-react/lib/Dialog";
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
  children? : any;
}
export type NotificationResult = {
  close: () => void;
  update: (newConfig: INotificationProps) => void;
  closeAll: () => void;
};

export type IAOP = {
  beforeRender?: () => void;
  beforeShow?: () => void;
  afterRender?: () => void;
};

export type Notice = (props?: INotificationProps) => NotificationResult;

export interface INotification extends React.SFC<INotificationProps> {
  Config?: (config: IAOP) => void;
  Confirm?: Notice;
  Error?: Notice;
}
