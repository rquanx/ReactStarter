import * as React from 'react';
import './Index.css';
import listCRUD from '@services/modal/listCRUD';
import { CellType, ICell, IColumn, ListView } from "@components/ListView/Index";
import { GetColumns } from "@services/common/helper";
import PageManager from "@services/pageManager";
import { Pagination } from "@components/Pagination";
import Config from "@config";
import Loading from "@components/Loading";
import Notification from "@components/Notification";
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import Form from './Form';
import { T } from "@services/translation";
import { Filter, ISearchInfo } from './Filter';
import Notice from "@components/Notice";
import { Logger } from "@services/logger";
import Example from '@srcservices/modal/example';

interface IListCRUDState {
    items: ICell[][];
    showPanel: boolean;
    title: string;
    content: string;
    classkeyItem: IDropdownOption;
    classkeyOption: IDropdownOption[];
    deleteMoreShow: boolean;
    operation: string;
}
export class ListCRUD extends React.Component<{}, IListCRUDState>{
    private columnsKeys: string[] = ["ID", "Title", "ClassName", "Content", "Author", "Created", "Operate"];     // 显示字段
    private columnsNames: string[] = ["ID", "标题", "类型", "内容", "作者", "创建时间", "操作"];               // 字段对应名称
    private columnsClass: string[] = ["", "", "", "sr-list-view-content", "", "", ""];                                   // 字段对应类名
    private columns: IColumn[] = GetColumns(this.columnsKeys, this.columnsNames, this.columnsClass);

    /** 分页数据处理助手 */
    private pageManager = new PageManager(1, Config.Pages.Size, Config.Pages.DisplayNum);

    /** 当前页数 */
    private currentPage: number = 1;

    private selectID: number[] = [];
    private editID: number;

    /** 查询信息 */
    private searchInfo: ISearchInfo = {
        keyword: "",
    };

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            showPanel: false,
            title: '',
            content: '',
            classkeyItem: undefined,
            classkeyOption: [],
            deleteMoreShow: false,
            operation: "add"
        }
    }
    render() {
        return (
            <div className="sr-listCRUD">
                <Filter
                    deleteShow={this.state.deleteMoreShow}
                    onAdd={this.onAdd}
                    onDelete={this.onDeleteMore}
                    onSearch={this.onInitial}
                />
                <ListView
                    items={this.state.items}
                    selection={true}
                    onSelected={this.onSelected}
                    columns={this.columns}
                />
                <Pagination
                    prevText={T("上一页")}
                    nextText={T("下一页")}
                    totalPage={this.pageManager.getPageTotalCount()}
                    pageBound={this.pageManager.getdisplayPageNum()}
                    id="pagination"
                    onPageChange={this.onPageChange}
                    currentPage={this.currentPage}
                />
                {this.state.showPanel ?
                    <Form
                        showPanel={this.state.showPanel}
                        title={this.state.title}
                        content={this.state.content}
                        classkeyItem={this.state.classkeyItem}
                        classkeyOption={this.state.classkeyOption}
                        onConfirm={this.state.operation === "add" ? this.onAddItem : this.onEditItem}
                        onCancel={this.onHidePanel}
                    />
                    : null}
            </div>
        )
    }

    componentDidMount() {
        this.onInitial(this.searchInfo);
        this.getClass();
    }

    /**
     * 初始化数据
     */
    onInitial = async (info) => {
        try {
            Loading.show()
            /** 获取Config.Pages.Size*Config.Pages.DisplayNum 条数据 */
            let result = await listCRUD.query(info);
            /** 将获取的数据放入分页数据处理助手中 */
            this.pageManager.redirectIndex(1, result.haveNext, result.data, result.pagingInfo);
            /** 获取第一页数据 */
            this.changeListData(1)
            Loading.hide()
        } catch (e) {
            Logger.Error("ListCRUD onInitial", e)
            Notification.Confirm({
                subText: e.message,
            })
        }
    }

    /**
     * 获取分类
     */
    async getClass() {
        try {
            let classItems = await listCRUD.queryClass();
            let options: IDropdownOption[] = [];
            for (var i in classItems.data) {
                options.push({
                    key: classItems.data[i].ID,
                    text: classItems.data[i].ClassName
                });
            }
            this.setState({
                classkeyOption: options
            })
        } catch (e) {
            Logger.Error("ListCRUD getClass", e)
            Notification.Confirm({
                subText: e.message,
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
            Loading.show()
            let result = await listCRUD.query({ ...this.searchInfo, pagingInfo: this.pageManager.getPagingInfo(num) });
            this.pageManager.redirectIndex(num, result.haveNext, result.data, result.pagingInfo);
            this.changeListData(num)
            Loading.hide()
        } catch (e) {
            Logger.Error("ListCRUD onSearchPage", e)
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
                            name: T("编辑"),
                            type: CellType.Button,
                            onClick: this.onEdit.bind(this, itemData),
                        },
                        {
                            className: "sr-list-btn",
                            name: T("删除"),
                            type: CellType.Button,
                            onClick: this.onShowDelete.bind(this, itemData.ID),
                        }
                    ];
                    cell.element = cellList;
                    cell.type = CellType.Buttons;
                    cell.className = "";
                    break;
                }
                case "Content": {
                    cell.type = CellType.Div;
                    cell.title = itemData[item];
                    cell.className = "sr-list-view-content";
                    break;
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
     * @param item
     */
    async onEdit(item: Example) {
        this.editID = item.ID;
        this.setState({
            showPanel: true,
            operation: "edit",
            title: item.Title,
            content: item.Content,
            classkeyItem: { key: item.ClassNameID,text: item.ClassName },
        });
    }

    /**
     * 编辑
     */
    onEditItem = async (content, title, classKey) => {
        this.setState({
            showPanel: false,
        });
        try {
            let updateItem = await listCRUD.update(this.editID, content, title, classKey);
            if (updateItem.data) {
                Notice.Success(" 编辑成功")
                this.onInitial(this.searchInfo);
            } else {
                Notice.Success("编辑失败")
            }
        }
        catch (e) {
            Logger.Error("ListCRUD onEditItem", e)
            Notification.Confirm({
                subText: e.message
            })
        }
    }

    /**
     * 点击添加事件
     */
    onAdd = () => {
        this.setState({
            showPanel: true,
            operation: "add",
            title: "",
            content: "",
            classkeyItem: undefined
        });
    }

    /**
     * 添加
     */
    onAddItem = async (content, title, classKey) => {
        this.setState({
            showPanel: false,
        });
        try {
            let addItem = await listCRUD.add(content, title, classKey);
            if (addItem.data) {
                Notice.Success("添加成功")
                this.onInitial(this.searchInfo);
            } else {
                Notice.Success("添加失败")
            }
        }
        catch (e) {
            Logger.Error("ListCRUD onAddItem", e)
            Notification.Confirm({
                subText: e.message
            })
        }
    }

    /**
     * 点击删除事件
     * @param ID 
     */
    onShowDelete = (ID) => {
        var that = this;
        Notification.Confirm({
            subText: "确定删除？",
            onConfirm: () => {
                that.onDelete(ID)
            }
        })
    }

    /**
     * 删除单个
     */
    onDelete = async (ID) => {
        try {
            let deleteItem = await listCRUD.delete(ID);
            if (deleteItem.data) {
                Notice.Success("删除成功")
                this.onInitial(this.searchInfo);
            } else {
                Notice.Success("删除失败")
            }
        }
        catch (e) {
            Logger.Error("ListCRUD onDelete", e)
            Notification.Confirm({
                subText: e.message
            })
        }
    }

    /**
     * 隐藏添加和编辑弹框
     */
    private onHidePanel = (): void => {
        this.setState({ showPanel: false });
    };

    /**
     * 批量删除
     */
    onDeleteMore = async () => {
        try {
            let deleteMoreResult = await listCRUD.deleteMore(this.selectID)
            if (deleteMoreResult.data) {
                Notice.Success("删除成功")
                this.onInitial(this.searchInfo)
                this.onClearSelect();
                this.selectID = [];
                this.setState({
                    deleteMoreShow: false
                })
            } else {
                Notice.Success("删除失败")
            }
        } catch (e) {
            Logger.Error("ListCRUD onDeleteMore", e)
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
    onClearSelect = () => { }

}
export default ListCRUD;