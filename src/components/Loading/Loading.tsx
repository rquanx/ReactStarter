import * as React from 'react';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

interface ILoadingProps {
    visible
}


Loading.show = null;
Loading.hide = null;
Loading.hideAll = null;

export function Loading(props: ILoadingProps) {
    return (
        <Modal
            isOpen={props.visible}
            isBlocking={false}
            className="loadingModal"
        >
            <Spinner size={SpinnerSize.large} key="loading" className="sr-loading" />
        </Modal>
    )
}
export default Loading;