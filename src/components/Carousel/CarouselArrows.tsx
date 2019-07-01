import React, { Component } from 'react';

export class CarouselArrows extends React.Component<{
  turn:any;
}, {}> {

  constructor(props) {
    super(props);
  }

  handleArrowClick(option) {
    this.props.turn(option);
  }

  render() {
    return (
      <div className="sr-slider-arrows-wrap">
        <span
          className="sr-slider-arrow sr-slider-arrow-left" onClick={this.handleArrowClick.bind(this, -1)}>
        </span>
        <span
          className="sr-slider-arrow sr-slider-arrow-right" onClick={this.handleArrowClick.bind(this, 1)}>
        </span>
      </div>
    );
  }
}
export default CarouselArrows;