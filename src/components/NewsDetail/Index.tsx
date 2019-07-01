import * as React from 'react';
import './Index.css';
import { INews } from './Entity/News';
import INewsService from './Service/INewsService';
import Loading from '@components/Loading'
import Notification from '@components/Notification';
import { Logger } from "@services/logger";
interface INewsDetailProps {
    service: INewsService   // 当前使用获取数据的方式（接口 | SharePoint）
}
interface INewsDetailState {
    currentNews: INews
}
export class NewsDetail extends React.Component<INewsDetailProps, INewsDetailState>{
    constructor(props) {
        super(props)
        this.state = {
            currentNews: undefined
        }
    }
    render() {
        const { currentNews } = this.state;
        return (
            <div className="sr-news-detail">
                {
                    currentNews ?
                        <div>
                            <div className="sr-news-title">{currentNews.Title}</div>
                            <div className="sr-news-info">
                                <span className="sr-news-author">{currentNews.Author}</span>
                                {currentNews.PublishTime ? <span className="sr-news-creat-time">{currentNews.PublishTime}</span> : null}
                            </div>
                            <div className="sr-news-abstract" dangerouslySetInnerHTML={{ __html: currentNews.Abstract }}></div>
                            <div className="sr-news-body" dangerouslySetInnerHTML={{ __html: currentNews.Body }}></div>
                        </div>
                        : null
                }
            </div>
        )
    }
    componentDidMount() {
        this.onInitial()
    }

    /**
     * 获取新闻内容
     */
    onInitial = async () => {
        try {
            Loading.show();
            let newsResult = await this.props.service.getNews();
            console.log(newsResult)
            this.setState({
                currentNews: newsResult.data ? newsResult.data[0] : []
            })
            Loading.hide();
        } catch (e) {
            Logger.Error('NewsDetail onInitial', e)
            Notification.Error({
                subText: e.message
            })
        }
    }

}
export default NewsDetail;
