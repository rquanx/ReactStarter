import * as React from 'react';
import Carousel from '@components/Carousel/Carousel'
export class CarouselPage extends React.Component<{}, {}>{
    render() {
        return (
            <div style={{width:"700px"}}>
                <Carousel
                    items={[
                        {
                        CnTitle: "标题一",
                        Target: " _blank",
                        ImgURL: "http://pic15.nipic.com/20110628/1369025_192645024000_2.jpg",
                        Link: "http://www.baidu.com"
                    }, {
                        CnTitle: "标题二",
                        Target: " _blank",
                        ImgURL: "http://pic37.nipic.com/20140110/17563091_221827492154_2.jpg",
                        Link: "http://www.baidu.com"
                    }, {
                        CnTitle: "标题三",
                        Target: " _blank",
                        ImgURL: "http://pic15.nipic.com/20110628/1369025_192645024000_2.jpg",
                        Link: "http://www.baidu.com"
                    }]}
                    speed={0}               // 图片移动速度
                    delay={3}               // 图片滚动的间隙时间
                    pause={true}            // 鼠标经过图片是否停止轮播
                    autoplay={true}         // 是否自动开启自动轮播
                    showDots={true}         // 是否显示点分页
                    showPrevNext={false}    // 是否显示上下按钮
                    showTitle={true}        // 是否显示标题
                    showDotsNo={true}       // 是否显示分页数字
                >
                </Carousel>
            </div>
        )
    }
}
export default CarouselPage