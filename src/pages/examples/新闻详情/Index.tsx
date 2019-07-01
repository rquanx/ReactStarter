import * as React from 'react';
import './Index.css';
import NewsDetail from '@components/NewsDetail';
import SPNewsService from '@components/NewsDetail/Service/SPNewsService';
import Config from "@config";
export class NewsDetailPage extends React.Component<{}, {}>{
    render() {
        return (
            <div className="sr-news-detail-page">
                <NewsDetail
                    service = {new SPNewsService(1,Config.Lists.News)}
                >
                </NewsDetail>
            </div>
        )
    }
}
export default NewsDetailPage