import Notification from "./Notification/index";
import Confirm from "./Confirm";
import { Mode } from "./Enum";

Notification.Confirm = (props?) => {
    const config = {
        ...props,
        mode: Mode.Confirm,
        icon: undefined,
    };
    return Confirm(config);
}

Notification.Error = (props?) => {
    const config = {
        ...props,
        mode: Mode.Error,
        icon: undefined,
    };
    return Confirm(config);
}
export default Notification;