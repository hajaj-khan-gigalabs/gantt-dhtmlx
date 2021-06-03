import React, { Component } from "react";
import Gantt from "./components/Gantt";
import GanttMay31 from "./components/GanttMay31";
import GanttMay27 from "./components/GanttMay27";
import GanttMay20 from "./components/GanttMay20";
import Toolbar from "./components/Toolbar";
import ToolbarMay27 from "./components/ToolbarMay27";
import MessageArea from "./components/MessageArea";
import taskData from "./data.json";
import "./style.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const data = taskData;
class App extends Component {
  state = {
    currentZoom: "week",
    currentZoom_27: "Days",
    currentZoom_20: "Days",
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
  handleZoomChange_27 = (zoom) => {
    this.setState({
      currentZoom_27: zoom,
    });
  };
  handleGridToggle = () => {
    this.setState({ gridFlag: !this.state.gridFlag });
  };

  render() {
    const { currentZoom, messages, currentZoom_27, currentZoom_20, gridFlag } =
      this.state;
      
    return (
      <Router>
        <div>
          {/* <h2>Welcome to React Router Tutorial</h2>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav mr-auto">
              <li>
                <Link to={"/"} className="nav-link">
                  Current
                </Link>
              </li>
              <li>
                <Link to={"/revision/may31"} className="nav-link">
                  Last Monday
                </Link>
              </li>
              <li>
                <Link to={"/revision/may27"} className="nav-link">
                  Last Thursday
                </Link>
              </li>
              <li>
                <Link to={"/revision/may20"} className="nav-link">
                  Initial
                </Link>
              </li>
            </ul>
          </nav>
          <hr /> */}
          <Switch>
            <Route exact path="/">
              <div className="zoom-bar">
                <Toolbar
                  zoom={currentZoom}
                  onZoomChange={this.handleZoomChange}
                />
              </div>
              {window.location.pathname === "/" ? (
                <div className="gantt-container">
                  <Gantt tasks={data} zoom={currentZoom} />
                </div>
              ) : (
                " "
              )}
            </Route>
            <Route exact path="/revision/may31">
              <div className="zoom-bar">
                <Toolbar
                  zoom={currentZoom}
                  onZoomChange={this.handleZoomChange}
                />
              </div>
              {window.location.pathname === "/revision/may31" ? (
                <div className="gantt-container">
                  <GanttMay31 tasks={data} zoom={currentZoom} />
                </div>
              ) : (
                ""
              )}
            </Route>
            <Route exact path="/revision/may27">
              <div className="zoom-bar-27">
                <ToolbarMay27
                  zoom={currentZoom_27}
                  onZoomChange={this.handleZoomChange_27}
                />
              </div>
              <div>
                <button onClick={this.handleGridToggle}>
                  Show and Hide Grid
                </button>
              </div>
              {window.location.pathname === "/revision/may27" ? (
                <div className="gantt-container">
                  <GanttMay27
                    tasks={data}
                    zoom={currentZoom_27}
                    gridFlag={gridFlag}
                  />
                </div>
              ) : (
                " "
              )}
            </Route>
            <Route exact path="/revision/may20">
              {window.location.pathname === "/revision/may20" ? (
                <div className="gantt-container">
                  <GanttMay20 tasks={data} zoom={currentZoom_27} />
                </div>
              ) : (
                " "
              )}
            </Route>
          </Switch>
          {/* <MessageArea messages={messages} /> */}
        </div>
      </Router>
    );
  }
}

export default App;
