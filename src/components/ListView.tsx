import React from "react";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { T } from "@src/services/translation";

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
    onSelected?: (selectRows: number[], isSelectAll: boolean) => void;
    columns: IColumn[];
    caption?: any;
}

export class ListView extends React.Component<IListViewProps, {}> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

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
                <th className="checkbox" onClick={this._onSelectAllRows}>
                    <input type="checkbox" />Select All
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
                <td className="checkbox">
                    <input type="checkbox" onClick={this._onSelectOneRows} />
                </td>
            );
        }
        for (let i = 0, len = item.length; i < len; i++) {
            let td: JSX.Element = this.renderCell(item[i], index);
            tdArray.push(td);
        }
        // return (<tr id={"RowIndex_" + index.toString()} >{tdArray}</tr>);
        return (<tr id={index.toString()} >{tdArray}</tr>);
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
    private _onSelectAllRows(): void {
        let eles = document.getElementsByClassName("checkbox");
        if ((navigator.userAgent.indexOf('Chrome') === -1)) {
            ((eles[0].firstChild) as HTMLInputElement).click();
        }
        let result = false;
        if (((eles[0].firstChild) as HTMLInputElement).checked) {
            result = true;
        }
        for (let i = 1; i < eles.length; i++) {
            ((eles[i].firstChild) as HTMLInputElement).checked = result;
        }
        this._onChangeSelect();
    }


    // 单个checkbox选择（兼容IE）
    @autobind
    private _onSelectOneRows(elem): void {
        let current = ((elem.target) as HTMLInputElement);
        if ((navigator.userAgent.indexOf('Chrome') === -1)) {
            current.click();
        }
        this._onChangeSelect();
    }



    @autobind
    private _onChangeSelect(): void {
        if (this.props.onSelected && typeof (this.props.onSelected) === "function") {
            let selectRows: number[] = [];
            let eles = document.getElementsByClassName("checkbox");
            for (let i = 1; i < eles.length; i++) {
                if (((eles[i].firstChild) as HTMLInputElement).checked) {
                    let num = parseInt(((eles[i].parentNode as HTMLElement).id).split("_")[1]);
                    selectRows.push(num);
                }
            }
            this.props.onSelected(selectRows, (eles[0].firstChild as HTMLInputElement).checked);
        }
    }
}

export default ListView;