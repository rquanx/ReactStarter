import React, { Component } from 'react';

export class CarouselItem extends React.Component<{
  item: any;
  count: any;
  key: any;
  showTitle: boolean;
}, {}> {
  constructor(props) {
    super(props);
  }

  render() {
    let { count, item } = this.props;
    let width = 100 / count + '%';
    let title = <div style={{ width: width }} className="sr-text-layout"><p className="sr-text">{item.CnTitle}</p></div>;
    return (
      <li className="sr-slider-item" style={{ width: width }}>
        <a href={item.Link} target={item.Target}>
          <img src={item.ImgURL} alt={item.CnTitle} />
          {this.props.showTitle ? title:null}
        </a>
      </li>
    );
  }
}
export default CarouselItem;