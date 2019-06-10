import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { T } from "@services/translation";
import Notification from "@components/Notification";
import { TextField } from 'office-ui-fabric-react/lib/TextField';

export interface ISearchInfo {
    keyword: string;
}
interface IFilterProps {
    deleteShow: boolean;
    onAdd:()=>void;
    onDelete: () => void;
    onSearch: (info: ISearchInfo) => void
}
interface IFilterState {
    keyword: string
}
export class Filter extends React.Component<IFilterProps, IFilterState>{
    constructor(props) {
        super(props);
        this.state = {
            keyword: ''
        }
    }
    render() {
        return (
            <div className="sr-listCRUD-filter">
                <TextField placeholder={T("请输入内容")} onChange={(e, value) => this.setState({ keyword: value })} />
                <DefaultButton
                    primary={false}
                    data-automation-id="Search"
                    iconProps={{ iconName: 'Search' }}
                    onClick={this.onSearch}
                >
                    {T("搜索")}
                </DefaultButton>
                <DefaultButton
                    primary={true}
                    data-automation-id="Add"
                    iconProps={{ iconName: 'Add' }}
                    onClick={this.props.onAdd}
                >
                    {T("添加")}
                </DefaultButton>
                <DefaultButton
                    primary={false}
                    data-automation-id="Delete"
                    iconProps={{ iconName: 'Delete' }}
                    style={{ display: this.props.deleteShow ? "inline-block" : "none" }}
                    onClick={this.onClickDeleteMore}
                >
                    {T("批量删除")}
                </DefaultButton>
            </div>
        )
    }

    /**
     * 点击批量删除事件
     */
    onClickDeleteMore = () => {
        Notification.Confirm({
            subText: `您确认删除选中的新闻？`,
            onConfirm: () => {
                this.props.onDelete()
            }
        })
    }

    /**
     * 点击搜索按钮
     */
    onSearch = () => {
        let seachInfo: ISearchInfo = {
            keyword: this.state.keyword
        }
        this.props.onSearch(seachInfo)
    }
}
export default Filter;