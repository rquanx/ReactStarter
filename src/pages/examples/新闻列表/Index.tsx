import * as React from 'react';
import './Index.css'
import NewsList from '@components/NewsList'
import SPNewsListService from '@components/NewsList/Service/SPNewsListService'
import Config from '@config'
export class NewsListPage extends React.Component<{}, {}>{
    render() {
        return (
            <div>
                <NewsList
                    title="我的新闻"
                    service={new SPNewsListService(Config.Lists.News, Config.Pages.Size)}
                ></NewsList>
            </div>
        )
    }
}
export default NewsListPage