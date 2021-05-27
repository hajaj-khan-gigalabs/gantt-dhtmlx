import React, { Component } from "react";
export default class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.zoomValues = ["year", "quarter", "month", "week", "day"];
    this.state = {
      zoom: props.zoom,
    };
  }
  handleChange = (e) => {
    this.setState({ zoom: e.target.value });
    this.props.onZoomChange(e.target.value);
  };
  zoomIn = (e) => {
    let index = this.zoomValues.findIndex((x) => x === this.state.zoom);

    if (index > 0 && index < 6) {
      this.setState({ zoom: this.zoomValues[index - 1] });
      this.props.onZoomChange(this.zoomValues[index - 1]);
    }
  };
  zoomOut = (e) => {
    let index = this.zoomValues.findIndex((x) => x === this.state.zoom);
    if (index > -1 && index < 4) {
      this.setState({ zoom: this.zoomValues[index + 1] });
      this.props.onZoomChange(this.zoomValues[index + 1]);
    }
  };

  render() {
    return (
      <div className="tool-bar">
        <select className="dropDown"  value={this.state.zoom} onChange={this.handleChange}>
          <option value="year">Years</option>
          <option value="quarter">Quarters</option>
          <option value="month">Months</option>
          <option value="week">Weeks</option>
          <option value="day">Days</option>
        </select>
        <button className="minusIcon" onClick={this.zoomOut}>-</button>
        <button className="plusIcon" onClick={this.zoomIn}>+</button>
      </div>
    );
  }
}
