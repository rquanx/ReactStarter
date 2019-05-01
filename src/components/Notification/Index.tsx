import Notification, { INotificationProps } from "./Notification";
import Comfirm from "./Confirm";
import { Mode } from "./Enum";


Notification.Confirm = (props: INotificationProps) => {
    const config = {
        ...props,
        mode: Mode.Confirm,
        icon: undefined,
    };
    return Comfirm(config);
}

Notification.Error = (props: INotificationProps) => {
    const config = {
        ...props,
        mode: Mode.Error,
        icon: undefined,
    };
    return Comfirm(config);
}

export default Notification;