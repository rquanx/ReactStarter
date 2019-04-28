import * as React from 'react';
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
initializeIcons(/* optional base url */);
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import "./Index.css";
interface ITreeNodeProps {
    parentKey?: string;
    nodeData: ITreeNode;
    onSelect?: (key: string) => void;

}

interface ITreeNodeState {
    isExpanded: boolean;
    key: string;
}


export interface ITreeNode {
    title: string;
    key: string;
    childrens?: ITreeNode[];
    isExpanded?: boolean;
}

export class TreeNode extends React.Component<ITreeNodeProps, ITreeNodeState> {

    constructor(props) {
        super(props);
        this.state = {
            isExpanded: this.props.nodeData ? (this.props.nodeData.isExpanded) : false,
            key: this.props.parentKey ? `${this.props.parentKey}-${this.props.nodeData.key}` : this.props.nodeData.key
        }
    }

    public render(): JSX.Element {
        let node = this.props.nodeData ? (
            <li>
                {this.renderIcon(this.props)}
                <span className="Record-FileType-Span"
                    data-key={this.state.key}
                    onClick={this.onSelect} >
                    {this.props.nodeData.title}
                </span>
                {this.renderChildrens(this.props, this.state)}
            </li>)
            : null;
        return node;
    }

    private renderIcon = (props: ITreeNodeProps) => {
        var iconElement:JSX.Element;
        if(this.state.isExpanded){
            iconElement=<Icon className="Record-FileType-Icon" iconName="CalculatorSubtract"></Icon>;
        }else{
            iconElement=<Icon className="Record-FileType-Icon" iconName="CalculatorAddition"></Icon>;
        }
        return this.haveChildrens(props) ? (<span onClick={this.onExpanded}>
        {iconElement}
        </span>) : null;
    }

    private renderChildrens = (props: ITreeNodeProps, state: ITreeNodeState) => {
        return this.haveChildrens(props) && this.isExpanded(state) ?
            (<ul className="Record-FileType-Childrens">
                {props.nodeData.childrens.map((children) => {
                    return (
                        <TreeNode
                            nodeData={children}
                            onSelect={props.onSelect}
                            parentKey={state.key} >
                        </TreeNode>);
                })}
            </ul>)
            : null;
    }

    private haveChildrens = (props: ITreeNodeProps): boolean => {
        return props.nodeData.childrens && props.nodeData.childrens.length > 0;
    }

    private isExpanded = (state: ITreeNodeState) => {
        return state.isExpanded
    }

    private onExpanded = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    }

    private onSelect = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        // any code
        let key = (e.target as HTMLSpanElement).getAttribute("data-key");
        if (this.props.onSelect && typeof this.props.onSelect === "function") {
            this.props.onSelect(key);
        }
    }
}
export default TreeNode;