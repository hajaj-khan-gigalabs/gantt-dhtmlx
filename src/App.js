import React, { Component } from 'react';
import Gantt from './components/Gantt';
import Toolbar from './components/Toolbar';
import MessageArea from './components/MessageArea';
// import { Gantt, DefaultTheme, MaterialTheme } from "@dhtmlx/trial-react-gantt";
import './style.css';

const data = {
  data: [
    { id: 1, text: 'Task #1', start_date: '2020-02-12', duration: 3, progress: 0.6 },
    { id: 2, text: 'Task #2', start_date: '2020-02-16', duration: 3, progress: 0.4 }
  ],
  links: [
    { id: 1, source: 1, target: 2, type: '0' }
  ]
};
const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "d" }
  ];
  
  const columns = [
    { name: "text", label: "Task name", width: "100%" },
    { name: "start", label: "Start time", align: "center" },
    { name: "duration", label: "Duration", width: "70px", align: "center" },
    { name: "add-task", label: "", width: "50px", align: "center" }
  ];
  
  const tasks = [
    {
      id: 1,
      open: true,
      start_date: "2020-11-06",
      duration: 8,
      text: "React Gantt Widget",
      progress: 60,
      type: "project"
    },
    {
      id: 2,
      parent: 1,
      start_date: "2020-11-06",
      duration: 4,
      text: "Lib-Gantt",
      progress: 80
    },
    {
      id: 3,
      parent: 1,
      start_date: "2020-11-08",
      duration: 4,
      text: "UI Layer",
      progress: 30
    },
    {
      id: 4,
      start_date: "2020-11-07",
      duration: 8,
      text: "Documentation",
      progress: 10,
      type: "project"
    },
    {
      id: 5,
      parent: 4,
      start_date: "2020-11-07",
      duration: 1,
      text: "Overview",
      progress: 30
    },
    {
      id: 6,
      parent: 4,
      start_date: "2020-11-07",
      duration: 8,
      text: "API reference",
      progress: 0
    }
  ];
  
  const links = [
    { source: 2, target: 3, type: 0 },
    { source: 1, target: 4, type: 1 },
    { source: 5, target: 6, type: 2 }
  ];
  
  export { scales, columns, tasks, links };
  
class App extends Component {
  state = {
    currentZoom: 'Days',
    messages: []
  };

  addMessage(message) {
    const maxLogLength = 5;
    const newMessate = { message };
    const messages = [
      newMessate,
      ...this.state.messages
    ];

    if (messages.length > maxLogLength) {
      messages.length = maxLogLength;
    }
    this.setState({ messages });
  }

  logDataUpdate = (type, action, item, id) => {
    let text = item && item.text ? ` (${item.text})` : '';
    let message = `${type} ${action}: ${id} ${text}`;
    if (type === 'link' && action !== 'delete') {
      message += ` ( source: ${item.source}, target: ${item.target} )`;
    }
    this.addMessage(message);
  }

  handleZoomChange = (zoom) => {
    this.setState({
      currentZoom: zoom
    });
  }

  render() {
    const { currentZoom, messages } = this.state;
    return (
      <div>
        <div className="zoom-bar">
          <Toolbar
            zoom={currentZoom}
            onZoomChange={this.handleZoomChange}
          />
        </div>
        <div className="gantt-container">
          <Gantt
            tasks={data}
            zoom={currentZoom}
            onDataUpdated={this.logDataUpdate}
          />
        </div>
        <MessageArea
          messages={messages}
        />
      </div>
    );
        // return (
        //   <MaterialTheme>
        //     <Gantt scales={scales} columns={columns} tasks={tasks} links={links} />
        //   </MaterialTheme>
        //   // <MaterialTheme>
        //   //   <Gantt scales={scales} columns={columns} tasks={tasks} links={links} />
        //   // </MaterialTheme>
        // );
      
  }
}

export default App;