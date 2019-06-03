import React from "react";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { T } from "@src/services/translation";
import "./Index.css";
import { Icon } from 'office-ui-fabric-react/lib/Icon';
export enum CellType {
    Text = "Text",
    A = "A",
    Button = "Button",
    CheckButton = "CheckButton",
    Div = "Div",
    Buttons = "Buttons"
}

export interface ICell {
    type: CellType;
    element?: any;
    name?: string;
    className: string;
    target?: string;
    href?: string;
    onClick?: any;
    id?: number;
    index?: number;
    title?: string;
}

export interface IColumn {
    className: string;
    name: string;
    key: string;
}

interface IListViewProps {
    items: ICell[][];
    selection?: boolean;
    onSelected?: (selectRows: number[], isSelectAll: boolean, onClearSelect) => void;
    columns: IColumn[];
    caption?: any;
}

export class ListView extends React.Component<IListViewProps, {}> {
    render() {
        const { columns, items } = this.props;
        let head = columns && columns.length ? this.renderHead(columns) : null;
        let body = items && items.length ? this.renderBody(items) : null;
        let caption = this.props.caption ? (<caption> {this.props.caption}</caption>) : null;
        let noData = <div className="sr-nodata-layout"><div className="sr-nodata"></div><div className="sr-nodata-text">{T("抱歉，暂无数据")}</div></div>
        return (
            <div className="sr-list-layout">
                <div className="sr-list-box">
                    <table>
                        {caption}
                        {head}
                        {body}
                    </table>
                    {items && items.length ? null : noData}
                </div>
            </div>
        );
    }

    @autobind
    private renderHead(columns: IColumn[]): JSX.Element {
        let headArray: JSX.Element[] = [];
        if (this.props.selection) {
            headArray.push(
                <th className="checkbox" >
                    <label><input type="checkbox" onChange={this.onSelectAllRows} /><span>{T("全选")}</span></label>
            </th>);
        }
        for (let i = 0, len = columns.length; i < len; i++) {
            let column = columns[i];
            headArray.push(<th className={column.className}>{column.name}</th>);
        }
        return (<thead><tr>{headArray}</tr></thead>);
    }

    @autobind
    private renderBody(items: ICell[][]): JSX.Element {
        let body: JSX.Element[] = [];
        for (let i = 0, len = items.length; i < len; i++) {
            let item = items[i];
            let tr: JSX.Element = this.renderRow(item, i);
            body.push(tr);
        }
        return <tbody>{body}</tbody>;
    }

    @autobind
    private renderRow(item: ICell[], index: number): JSX.Element {
        let tdArray: JSX.Element[] = [];
        if (this.props.selection) {
            tdArray.push(
                <td className="list-checkbox">
                    <label><input type="checkbox" onClick={this.onSelectRow} /></label>
                </td>
            );
        }
        for (let i = 0, len = item.length; i < len; i++) {
            let td: JSX.Element = this.renderCell(item[i], index);
            tdArray.push(td);
        }
        return (<tr data-index={index} id={index.toString()} >{tdArray}</tr>);
    }

    @autobind
    private renderCell(cell: ICell, index: number): JSX.Element {
        let td: JSX.Element;
        switch (cell.type) {
            case CellType.Text: {
                td = (<td className={cell.className}>{cell.element}{cell.name}</td>);
                break;
            }
            case CellType.Div: {
                td = (
                    <td >
                        <div data-index={index} data-id={cell.id} title={cell.title} className={cell.className} onClick={cell.onClick}>{cell.element}{cell.name}</div>
                    </td>
                );
                break;
            }
            case CellType.A: {
                let target = cell.target ? cell.target : "_blank";

                td = (
                    <td >
                        <a data-index={index} className={cell.className} title={cell.title} href={cell.href} target={target} >{cell.name}</a>
                    </td>
                );
                break;
            }
            case CellType.Button: {
                td = (
                    <td >
                        <button data-index={index} className={cell.className} onClick={cell.onClick}>{cell.name}</button>
                    </td>
                );
                break;
            }
            case CellType.Buttons: {
                td = (
                    <td >
                        {
                            cell.element.map((item) => (
                                <button
                                    data-index={index}
                                    className={item.className}
                                    onClick={item.onClick}>
                                    {item.name}
                                </button>
                            ))
                        }
                    </td>
                );
                break;
            }
            default: {

            }
        }
        return (td);
    }

    // 表单全选
    @autobind
    private onSelectAllRows(): void {
        let elesAll = document.getElementsByClassName("checkbox");
        let eles = document.getElementsByClassName("list-checkbox");
        for (let i = 0; i < eles.length; i++) {
            ((eles[i].firstChild.firstChild) as HTMLInputElement).checked =  (elesAll[0].firstChild.firstChild as HTMLInputElement).checked;
        }
        this.onChangeSelect();
    }


    // 单个checkbox选择（兼容IE）
    @autobind
    private onSelectRow(elem) {
        let elesAll = document.getElementsByClassName("checkbox");
        let current = ((elem.target) as HTMLInputElement);
        if(current.checked){
            let eles = document.getElementsByClassName("list-checkbox");
            for (let i = 0; i < eles.length; i++) {
                if (!(eles[i].firstChild.firstChild as HTMLInputElement).checked) {
                    (elesAll[0].firstChild.firstChild as HTMLInputElement).checked = false;
                    this.onChangeSelect();
                    return false;
                }
            }
            (elesAll[0].firstChild.firstChild as HTMLInputElement).checked = true;
        }else{  
            (elesAll[0].firstChild.firstChild as HTMLInputElement).checked = false;
        }
        // if ((navigator.userAgent.indexOf('Chrome') === -1)) {
        //     current.click();
        // }
        this.onChangeSelect();
    }

    @autobind
    private onChangeSelect(): void {
        if (this.props.onSelected && typeof (this.props.onSelected) === "function") {
            let selectRows: number[] = [];
            let elesAll = document.getElementsByClassName("checkbox");
            let eles = document.getElementsByClassName("list-checkbox");
            for (let i = 0; i < eles.length; i++) {
                if ((eles[i].firstChild.firstChild as HTMLInputElement).checked) {
                    let num = parseInt(((eles[i].parentNode as HTMLElement).getAttribute("data-index")));
                    selectRows.push(num);
                }
            }
            this.props.onSelected(selectRows, (elesAll[0].firstChild.firstChild as HTMLInputElement).checked, this.onClearSelect);
        }
    }

    @autobind
    private onClearSelect() {
        let elesAll = document.getElementsByClassName("checkbox");
        let eles = document.getElementsByClassName("list-checkbox");
        (elesAll[0].firstChild.firstChild as HTMLInputElement).checked = false;
        for (let i = 0; i < eles.length; i++) {
            ((eles[i].firstChild.firstChild) as HTMLInputElement).checked = false;
        }
    }
}

export default ListView;