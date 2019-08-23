import * as React from "react";
import { Modal } from "office-ui-fabric-react/lib/Modal";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import "./Loading.css";
export interface ILoadingProps {
  visible?: boolean;
  children?: any;
  message?: string;
  messageClass?: string;
}

export interface ILoading extends React.SFC<ILoadingProps> {
  show?: (message?: string) => void;
  hide?: () => void;
  hideAll?: () => void;
  isLoading?: () => boolean;
}

export let Loading: ILoading = (props: ILoadingProps) => {
  return (
    <Modal
      isOpen={props.visible === undefined ? true : props.visible}
      isBlocking={false}
      className="loadingModal"
      containerClassName="sr-loading-modal"
    >
      <Spinner size={SpinnerSize.large} key="loading" className="sr-loading" />
      {props.message ? (
        <span className={props.messageClass ? props.messageClass : ""}>
          {props.message}
        </span>
      ) : null}
    </Modal>
  );
};

Loading.show = null;
Loading.hide = null;
Loading.hideAll = null;
Loading.isLoading = null;

export default Loading;
