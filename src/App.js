import React, { Component } from "react";
import Gantt from "./components/Gantt";
import Toolbar from "./components/Toolbar";
import MessageArea from "./components/MessageArea";
import taskData from "./data.json";
import "./style.css";

const data = taskData;
class App extends Component {
  state = {
    currentZoom: "week",
    messages: [],
    gridFlag: true,
  };

  addMessage(message) {
    const maxLogLength = 5;
    const newMessate = { message };
    const messages = [newMessate, ...this.state.messages];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (type, action, item, id) => {
    let text = item && item.text ? ` (${item.text})` : "";
    let message = `${type} ${action}: ${id} ${text}`;
    if (type === "link" && action !== "delete") {
      message += ` ( source: ${item.source}, target: ${item.target} )`;
    }
    this.addMessage(message);
  };

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom,
    });
  };
  handleGridToggle = () => {
    this.setState({ gridFlag: !this.state.gridFlag });
  };

  render() {
    const { currentZoom, messages, gridFlag } = this.state;
    return (
      <div>
        <div className="zoom-bar">
          <Toolbar zoom={currentZoom} onZoomChange={this.handleZoomChange} />
        </div>
        <div>
          <button onClick={this.handleGridToggle}> Show and Hide Grid</button>
        </div>
        <div className="gantt-container">
          <Gantt
            tasks={data}
            zoom={currentZoom}
            gridFlag={gridFlag}
            onDataUpdated={this.logDataUpdate}
          />
        </div>
        <MessageArea messages={messages} />
      </div>
    );
  }
}

export default App;
