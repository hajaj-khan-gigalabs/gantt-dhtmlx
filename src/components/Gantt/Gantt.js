import React, { Component } from "react";
import { gantt } from "dhtmlx-gantt";
import "./material_skin.css";

export default class Gantt extends Component {
  constructor(props) {
    super(props);
    this.initZoom();
  }

  // instance of gantt.dataProcessor
  dataProcessor = null;

  initZoom() {
    gantt.ext.zoom.init({
      levels: [
        {
          name: "Hours",
          scale_height: 60,
          min_column_width: 30,
          scales: [
            { unit: "day", step: 1, format: "%d %M" },
            { unit: "hour", step: 1, format: "%H" },
          ],
        },
        {
          name: "Days",
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "week", step: 1, format: "Week #%W" },
            { unit: "day", step: 1, format: "%d %M" },
          ],
        },
        {
          name: "Months",
          scale_height: 60,
          min_column_width: 70,
          scales: [
            { unit: "month", step: 1, format: "%F" },
            { unit: "week", step: 1, format: "#%W" },
          ],
        },
      ],
    });
  }

  setZoom(value) {
    gantt.ext.zoom.setLevel(value);
  }

  initGanttDataProcessor() {
    /**
     * type: "task"|"link"
     * action: "create"|"update"|"delete"
     * item: data object object
     */
    const onDataUpdated = this.props.onDataUpdated;
    this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
      return new Promise((resolve, reject) => {
        if (onDataUpdated) {
          onDataUpdated(type, action, item, id);
        }

        // if onDataUpdated changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
        // resolve({id: databaseId});
        return resolve();
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentDidMount() {
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    const { tasks } = this.props;

    //Task 1
    function change_highlight(id, type) {
      var elements = document.querySelectorAll(
        '.gantt_task_row[task_id="' + gantt.$previous_id + '"]'
      );
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList[type]("gantt_selected");
      }
    }
    gantt.attachEvent("onMouseMove", function (id, e) {
      if (id && gantt.$previous_id !== id) {
        if (gantt.$previous_id) change_highlight(gantt.$previous_id, "remove");
        gantt.$previous_id = id;
        change_highlight(id, "add");
      }
    });

    //Task 2
    gantt.plugins({
      keyboard_navigation: true,
    });
    gantt.addShortcut(
      "shift+z",
      function (e) {
        gantt.addTask({
          id: 6,
          text: "Task #6",
          start_date: "2020-02-12",
          duration: 8,
          progress: 0.6,
          parent: 1,
        });
        gantt.showLightbox(6);
      },
      "taskRow"
    );

    // Task 3
    var left_date, right_date;
    gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
      left_date = task.start_date;
      right_date = task.end_date;
      gantt.render();
    });

    gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
      left_date = right_date = null;
      gantt.render();
    });
    // gantt.templates.scale_cell_class = function (date) {
    //   if (
    //     left_date &&
    //     right_date &&
    //     +gantt.date.date_part(new Date(left_date)) <= +date &&
    //     +date <= +right_date
    //   ) {
    //     return "weekend";
    //   }
    // };
    gantt.templates.timeline_cell_class = function (task, date) {
      if (
        left_date &&
        right_date &&
        +gantt.date.date_part(new Date(left_date)) <= +date &&
        +date <= +right_date
      ) {
        return "weekend";
      }
    };

    //Task 8
    gantt.plugins({
      undo: true,
    });
    gantt.plugins({
      redo: true,
    });

    //drag timeLine
    gantt.plugins({
      drag_timeline: true,
    });
    gantt.config.drag_timeline = {
      ignore: ".gantt_task_line, .gantt_task_link",
      useKey: false,
    };

    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    gantt.parse(tasks);
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }

  render() {
    const { zoom } = this.props;
    this.setZoom(zoom);
    return (
      <div
        ref={(input) => {
          this.ganttContainer = input;
        }}
        style={{ width: "100%", height: "100%", position: "absolute" }}
      ></div>
    );
  }
}
