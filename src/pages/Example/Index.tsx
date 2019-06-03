import * as React from 'react';
import './Index.css';
import example from '@services/modal/example'
import { CellType, ICell, IColumn, ListView } from "@components/ListView/Index";
import { GetColumns } from "@services/common/helper";
import PageManager from "@services/pageManager";
import { Pagination } from "@components/Pagination";
import Config from "@config";
import Loading from "@components/Loading";
import Notification from "@components/Notification";
import Notice from "@components/Notice";
import { DefaultButton } from 'office-ui-fabric-react';

interface IExampleState {
    items: ICell[][],
    deleteMoreShow: boolean
}
export class Example extends React.Component<{}, IExampleState>{
    private columnsKeys: string[] = ["ID", "Item", "Topic", "Content", "Writer", "Operate"];     // 显示字段
    private columnsNames: string[] = ["ID", "类型", "标题", "内容", "作者", "操作"];               // 字段对应名称
    private columnsClass: string[] = ["", "", "", "", "", ""];                                   // 字段对应类名
    private columns: IColumn[] = [];
    /** 分页数据处理助手 */
    private pageManager = new PageManager(1, Config.Pages.Size, Config.Pages.DisplayNum);
    /** 当前页数 */
    private currentPage: number = 1;
    private selectID: number[] = [];
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            deleteMoreShow: false
        }
    }
    render() {
        return (
            <div className="sr-example">
                <DefaultButton
                    primary={true}
                    data-automation-id="Add"
                    iconProps={{ iconName: 'Add' }}
                >
                    添加
                </DefaultButton>
                <DefaultButton
                    primary={false}
                    data-automation-id="Delete"
                    iconProps={{ iconName: 'Delete' }}
                    style={{ display: this.state.deleteMoreShow ? "inline-block" : "none" }}
                    onClick={this.onDeleteMore}
                >
                    批量删除
                </DefaultButton>
                <ListView
                    items={this.state.items}
                    selection={true}
                    onSelected={this.onSelected}
                    columns={this.columns}
                />
                <Pagination
                    prevText="上一页"
                    nextText="下一页"
                    totalPage={this.pageManager.getPageTotalCount()}
                    pageBound={this.pageManager.getdisplayPageNum()}
                    id="pagination"
                    onPageChange={this.onPageChange}
                    currentPage={this.currentPage}
                />
            </div>
        )
    }

    componentDidMount() {
        this.onInitial();
        console.log(this.state.items)
    }

    /**
     * 初始化数据
     */
    async onInitial() {
        try {
            Loading.show()
            /** 初始化表头 */
            this.columns = GetColumns(this.columnsKeys, this.columnsNames, this.columnsClass);
            /** 获取Config.Pages.Size*Config.Pages.DisplayNum 条数据 */
            let result = await example.query();
            /** 将获取的数据放入分页数据处理助手中 */
            this.pageManager.redirectIndex(1, result.haveNext, result.data, result.pagingInfo);
            /** 获取第一页数据 */
            this.changeListData(1)
            Loading.hide()
        } catch (e) {
            console.log(e)
            Notification.Confirm({
                subText: e.message
            })
        }

    }

    /**
     * 根据页数返回对应的数据
     */
    changeListData = (num: number) => {
        let itemsDate = this.pageManager.getPageDatas(num);
        let items: ICell[][] = itemsDate.map((item) => (this.getListItem(item)));
        this.currentPage = num;
        this.setState({
            items: items
        });
    }

    /**
     * 点击页数事件
     */
    onPageChange = (index) => {
        // 当点击页数查询时，清空选择的ID
        this.onClearSelect();
        this.selectID = [];
        if (this.currentPage !== index) {
            let items = this.pageManager.getPageDatas(index);
            if (items.length < 1) {
                this.onSearchPage(index);
            }
            else {
                this.changeListData(index);
            }
        }
    }
    /**
     * 根据pagingInfo查找数据
     * @param num 页数
     */
    async onSearchPage(num) {
        try {
            Loading.show();
            let result = await example.query({ pagingInfo: this.pageManager.getPagingInfo(num) });
            this.pageManager.redirectIndex(num, result.haveNext, result.data, result.pagingInfo);
            this.changeListData(num)
            Loading.hide()
        } catch (e) {
            console.log(e)
            Notification.Confirm({
                subText: e.message
            })
        }
    }

    /**
     * 可以对当行数据的每个字段进行自定义化
     * @param itemData 单行列表数据
     */
    getListItem(itemData): ICell[] {
        return this.columnsKeys.map((item) => {
            let cell: ICell = {
                name: itemData[item],
                type: CellType.Text,
                className: "",
            };
            switch (item) {
                case "Operate": {
                    let cellList: ICell[] = [
                        {
                            className: "sr-list-btn",
                            name: "编辑",
                            type: CellType.Button,
                            onClick: this.onEdit.bind(this, itemData.ID),
                        },
                        {
                            className: "sr-list-btn",
                            name: "删除",
                            type: CellType.Button,
                            onClick: this.onDelete.bind(this, itemData.ID),
                        }
                    ];
                    cell.element = cellList;
                    cell.type = CellType.Buttons;
                    cell.className = "";
                }
                default: {
                    break;
                }
            }
            return cell;
        });
    }

    /**
     * 点击编辑事件
     * @param ID 
     */
    onEdit(ID) {
        console.log("编辑", ID)
    }

    /**
     * 点击删除事件
     * @param ID 
     */
    onDelete(ID) {
        console.log("删除", ID)
    }

    /**
     * 点击批量删除事件
     */
     onDeleteMore = async() => {
        try {
            let deleteMoreResult = await example.deleteMore(this.selectID)
            if(deleteMoreResult.data){
                Notice.success("删除成功")
                this.onClearSelect();
                this.onInitial()
            }else{
                Notice.success("删除失败")
            }

        } catch (e) {
            console.log(e);
            Notification.Error({
                subText: e.message
            })
        }
    }

    /**
     * 点击全选
     * @param selectRows 选择行 
     * @param isSelectAll 是否全选
     * @param onClearSelect 取消全选
     */
    onSelected = (selectRows, isSelectAll, onClearSelect) => {
        this.selectID = []
        if (selectRows.length) {
            selectRows.map(id => {
                this.selectID.push(this.pageManager.getPageDatas(this.currentPage)[id].ID)
            })
            this.setState({
                deleteMoreShow: true
            })
        } else {
            this.setState({
                deleteMoreShow: false
            })
        }
        this.onClearSelect = onClearSelect
    }
    /**
     * 清空选项
     */
    onClearSelect=()=>{}

}
export default Example;