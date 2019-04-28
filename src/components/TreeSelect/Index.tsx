import * as React from 'react';
import { ITreeNode, TreeNode } from "./TreeNode";
import "./Index.css";
export interface ITreeSelectProps {
    treeData: ITreeNode[];
    onSelect?: (key: string) => void;
}

export type ITreeData = ITreeNode[];

export class TreeSelect extends React.Component<ITreeSelectProps, {}> {
    /**
     * <div>
     *  <ul>
     *      <span>icon</span>
     *      <sapn>title</sapn>
     *      <li>
     *          <ul>
     *              <span>icon</span>
     *              <sapn>title</sapn>  
     *          </ul>
     *      </li>
     *      <li>
     *           ...
     *      </li>
     *  </ul>
     * </div>
     */
    public render() {
        // return this.haveTreeData(this.props) ? (
        //     <div>
        //         <ul>
        //             {this.props.treeData.map((option) => {
        //                 return (<TreeNode nodeData={option} onSelect={this.onSelect}  ></TreeNode>);
        //             })}
        //         </ul>
        //     </div>) : null;

        var nodataOption: ITreeNode = { title: "暂无数据", key: "nodata" };

        return this.haveTreeData(this.props) ? (
            <div>
                <ul>
                    {this.props.treeData.map((option) => {
                        return (<TreeNode nodeData={option} onSelect={this.onSelect}  ></TreeNode>);
                    })}
                </ul>
            </div>) : (<TreeNode nodeData={nodataOption}></TreeNode>);
    }

    private haveTreeData = (props: ITreeSelectProps) => {
        return props.treeData && props.treeData.length > 0
    }

    private onSelect = (key: string) => {
        // any code
        if (this.props.onSelect && typeof this.props.onSelect === "function") {
            this.props.onSelect(key);
        }
    }
}
export default TreeSelect;