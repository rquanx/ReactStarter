import * as React from 'react';
import { Modal } from 'office-ui-fabric-react/lib/Modal';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import "./Index.css";

interface INoticeProps {
    title?: string
    type?: string
}

Notice.Success = (title: string) => {
    return null;
};
Notice.Error = (title: string) => {
    return null;
};

export function Notice(props: INoticeProps) {
    return (
        <div className={"sr-notice "+ props.type}>
            {props.title ? props.title : ''}
        </div>
    )
}
export default Notice;