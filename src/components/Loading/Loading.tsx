import * as React from 'react';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import "./Loading.css";
export interface ILoadingProps {
    visible?: boolean;
    children?: any;
}

export interface ILoading extends React.SFC<ILoadingProps> {
    show?: () => void;
    hide?: () => void;
    hideAll?: () => void;
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
        </Modal>
    )
}


Loading.show = null;
Loading.hide = null;
Loading.hideAll = null;

export default Loading;