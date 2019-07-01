import React, { Component } from 'react';


export class CarouselDots extends React.Component<{
  turn: any;
  nowLocal: any;
  count: any;
  showDotsNo: boolean;
}, {}> {
  constructor(props) {
    super(props);
  }

  handleDotClick(i) {
    var option = i - this.props.nowLocal;
    this.props.turn(option);
  }

  render() {
    let dotNodes = [];
    let { count, nowLocal } = this.props;
    for (let i = 0; i < count; i++) {
      dotNodes[i] = (
        <span
          key={'dot' + i}
          className={"sr-slider-dot" + (i === this.props.nowLocal ? " sr-slider-dot-selected" : "")}
          onClick={this.handleDotClick.bind(this, i)}>
          {this.props.showDotsNo ? i + 1 : null}
        </span>
      );
    }
    return (
      <div className="sr-slider-dots-wrap">
        {dotNodes}
      </div>
    );
  }
}
export default CarouselDots;