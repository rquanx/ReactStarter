import * as React from 'react';
import INewsListService from './Service/INewsListService';
import { Logger } from '@services/logger';
import Notification from '@components/Notification';
import { INews } from './Entity/News';
import './Index.css';
import Loading from '@components/Loading';
import { T } from '@services/translation'
interface INewsListProps {
    title: string;
    service: INewsListService;
}
interface INewsListState {
    newslist: INews[]
}
export class NewsList extends React.Component<INewsListProps, INewsListState>{
    constructor(props) {
        super(props);
        this.state = {
            newslist: undefined
        }
    }
    render() {
        const { newslist } = this.state;
        let newlistTheadJSX = this.renderThead();
        let newlistTbodyJSX = this.renderNewsList(newslist)
        return (
            <div className="sr-newslist">
                <table cellSpacing="0" cellPadding="0">
                    <tbody>
                        {newlistTheadJSX}
                        {newlistTbodyJSX ?
                            newlistTbodyJSX.length ?
                                newlistTbodyJSX
                                : <tr><td colSpan={2} className="sr-table-nodata">{T("暂无数据")}</td></tr>
                            : null
                        }
                    </tbody>
                </table>
            </div>
        )
    }
    componentDidMount() {
        this.onInitial();
    }
    onInitial = async () => {
        try {
            Loading.show();
            let newsListResult = await this.props.service.getNews()
            this.setState({
                newslist: newsListResult.data
            })
            Loading.hide();
        } catch (e) {
            Logger.Error('NewsList onInitial', e)
            Notification.Error({
                subText: e.message
            })
        }

    }
    renderThead = (): JSX.Element[] => {
        let theadJSX: JSX.Element[] = [];
        theadJSX.push(
            <tr>
                <td className="sr-table-head">{T(this.props.title)}</td>
                <td className="sr-table-time sr-table-more">{T("更多")}>></td>
            </tr>
        )
        return theadJSX;
    }
    renderNewsList = (data: INews[]): JSX.Element[] => {
        let renderNewsListJSX: JSX.Element[] = []
        if (!data) {
            return undefined
        }
        data.map(item => {
            renderNewsListJSX.push(
                <tr>
                    <td className="sr-table-title" title={item.Title}>{item.Title}</td>
                    <td className="sr-table-time">{item.PublishTime}</td>
                </tr>
            )
        })
        return renderNewsListJSX
    }

    renderNewsListTD = (data: INews): JSX.Element => {
        let renderNewsListTDJSX: JSX.Element;

        return renderNewsListTDJSX
    }
}
export default NewsList