import * as React from 'react';
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { T } from "@services/translation";

interface IFormProps {
    title: string;
    content: string;
    classkeyItem: IDropdownOption;
    classkeyOption: IDropdownOption[];
    showPanel: boolean;
    onConfirm: (content, title, classKey) => void;
    onCancel: () => void;
}
interface IFormState {
    content: string;
    title: string;
    classkeyItem: IDropdownOption;
}
export class Form extends React.Component<IFormProps, IFormState>{
    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            title: this.props.title,
            classkeyItem: this.props.classkeyItem
        }
    }
    render() {
        let panel = this.renderPanel();
        return (
            <div className="sr-panel">
                <Panel
                    isOpen={this.props.showPanel}
                    onDismiss={this.props.onCancel}
                    type={PanelType.medium}
                >
                    {panel}
                </Panel>
            </div>
        )
    }

    @autobind
    private renderPanel(): JSX.Element {
        var panel: JSX.Element = <div className="sr-panel-container">
            <div className="sr-panel-layout sr-faqedit-layout">
                <div className="sr-panel-list">
                    <label>{T("标题")}</label>
                    <TextField
                        className="sr-faqtile"
                        value={this.state.title}
                        onChanged={(value: any) => this.setState({ title: value })}
                    />
                </div>
                <div className="sr-panel-list">
                    <label className="faqcontent"> {T("内容")}</label>
                    <TextField
                        className="sr-faqtile"
                        value={this.state.content}
                        onChanged={(value: any) => this.setState({ content: value })}
                        multiline rows={15}
                    />
                </div>
                <div className="sr-panel-list">
                    <label>{T("类型")} </label>
                    <Dropdown
                        className="sr-faqselect"
                        defaultSelectedKey={this.props.classkeyItem ? this.props.classkeyItem.key : this.props.classkeyOption.length ? this.props.classkeyOption[0].key : undefined}
                        options={this.props.classkeyOption}
                        onChanged={option => this.setState({ classkeyItem: option })}
                    />
                </div>
                <div className="sr-panel-btn">
                    <PrimaryButton className="sr-btn" onClick={this.onConfirm} text={T("确定")} />
                    <DefaultButton className="sr-btn" onClick={this.props.onCancel} text={T("取消")} />
                </div>
            </div>
        </div>
        return (<div>{panel}</div>);
    }

    @autobind
    private onConfirm() {
        let option = this.state.classkeyItem ? this.state.classkeyItem.key : this.props.classkeyOption.length ? this.props.classkeyOption[0].key : '';
        this.props.onConfirm(this.state.content, this.state.title, option);
    }
}
export default Form;