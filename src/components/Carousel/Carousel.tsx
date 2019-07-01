import React, { Component } from 'react';
import CarouselItem from './CarouselItem';
import CarouselDots from './CarouselDots';
import CarouselArrows from './CarouselArrows';
import './Index.css'

export class Carousel extends React.Component<{
  items: any;
  autoplay: any;
  delay: number;
  pause: boolean;
  showPrevNext: boolean;
  showDots: boolean;
  speed: number;
  showTitle: boolean;
  showDotsNo: boolean;
}, {
  nowLocal: number;
}> {
  private autoPlayFlag
  constructor(props) {
    super(props);
    this.state = {
      nowLocal: 0,
    };
  }

  // 向前向后多少
  turn(n) {
    console.log();
    var _n = this.state.nowLocal + n;
    if(_n < 0) {
      _n = _n + this.props.items.length;
    }
    if(_n >= this.props.items.length) {
      _n = _n - this.props.items.length;
    }
    this.setState({nowLocal: _n});
  }

  // 开始自动轮播
  goPlay() {
    if(this.props.autoplay) {
      this.autoPlayFlag = setInterval(() => {
        this.turn(1);
      }, this.props.delay * 1000);
    }
  }

  // 暂停自动轮播
  pausePlay() {
    clearInterval(this.autoPlayFlag);
  }

  componentDidMount() {
    this.goPlay();
  }

  render() {
    let count = this.props.items.length;

    let itemNodes = this.props.items.map((item, idx) => {
      return <CarouselItem showTitle={this.props.showTitle} item={item} count={count} key={'item' + idx} />;
    });

    let arrowsNode = <CarouselArrows turn={this.turn.bind(this)}/>;

    let dotsNode = <CarouselDots showDotsNo={this.props.showDotsNo} turn={this.turn.bind(this)} count={count} nowLocal={this.state.nowLocal} />;
    return (
      <div
        className="sr-slider"
        onMouseOver={this.props.pause?this.pausePlay.bind(this):null} onMouseOut={this.props.pause?this.goPlay.bind(this):null}>
          <ul style={{
              left: -100 * this.state.nowLocal + "%",
              transitionDuration: this.props.speed + "s",
              width: this.props.items.length * 100 + "%"
            }}>
              {itemNodes}
          </ul>
          {this.props.showPrevNext ? arrowsNode : null}
          {this.props.showDots ? dotsNode : null}
        </div>
      );
  }
}


export default Carousel;