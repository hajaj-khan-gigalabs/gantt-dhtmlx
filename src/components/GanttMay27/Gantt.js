import React, { Component } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./Gantt.css";

//  import "./material_skin.css";

export default class Gantt_27 extends Component {
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

  componentWillReceiveProps(someProp) {
    this.props = someProp;
    const { zoom, gridFlag } = this.props;

    this.setZoom(zoom);
    this.showHideGrid(gridFlag);
  }

  showHideGrid(value) {
    gantt.config.show_grid = value;
    gantt.render();
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

    gantt.config.columns = [
      { name: "text", label: "Task name", width: 180, tree: true },
      { name: "start_date", label: "Start date", width: 120, align: "center" },
      { name: "end_date", label: "Due date", width: 120, align: "center" },
      { label: "Predecessors", width: 100 },
      { name: "add", label: "", width: 44 },
    ];

    //enable colum reordring
    gantt.config.reorder_grid_columns = true;

    // for task vertically move from timeline
    // gantt.config.columns.push({
    //   name: "invisible_field",
    //   width: 1,
    //   template: function (task) {
    //     var invis =
    //       "<i class='invisible_task' style='margin-left:" +
    //       gantt.config.grid_width +
    //       "px'></i>";
    //     return invis;
    //   },
    // });

    // gantt.templates.leftside_text = function (start, end, task) {
    //   return "<i class='invisible_task'></i>";
    // };

    // gantt.config.order_branch = true;
    // gantt.config.order_branch_free = true;

    // gantt.config.fit_tasks = true;
    // gantt.config.open_tree_initially = true;

    // function invisible_mouse_control(element) {
    //   if (mouseDown) {
    //     let invis = document.getElementsByClassName("invisible_task");
    //     for (let i = 0; i < invis.length; i++) {
    //       invis[i].style["z-index"] = 0;
    //     }
    //   } else {
    //     let invis = document.getElementsByClassName("invisible_task");
    //     for (let i = 0; i < invis.length; i++) {
    //       invis[i].style["z-index"] = 2;
    //     }
    //   }
    // }

    // var mouseDown = 0;
    // document.body.onmousedown = function () {
    //   mouseDown = 1;
    //   invisible_mouse_control();
    // };
    // document.body.onmouseup = function () {
    //   mouseDown = 0;
    //   invisible_mouse_control();
    // };

    // for task vertically move fromm grid
    var drag_id = null;
    gantt.attachEvent("onRowDragStart", function (id, target, e) {
      drag_id = id;
      return true;
    });
    gantt.attachEvent("onRowDragEnd", function (id, target) {
      drag_id = null;
      gantt.render();
    });

    gantt.templates.grid_row_class = function (start, end, task) {
      if (
        drag_id &&
        task.id === drag_id &&
        task.$level === gantt.getTask(drag_id).$level
      ) {
        return "drag_highlight";
      }
      return "";
    };
    gantt.templates.task_row_class = function (start, end, task) {
      if (
        drag_id &&
        task.id === drag_id &&
        task.$level === gantt.getTask(drag_id).$level
      ) {
        return "drag_highlight";
      }
      return "";
    };

    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;
    gantt.config.open_tree_initially = true;

    // gantt.init("gantt_here");
    // gantt.parse(<data>);

    //drag project with all its tasks
    gantt.config.drag_project = true;

    //Task 2
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

    //Task 3
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

    //Task 4
    gantt.plugins({
      marker: true,
    });
    var marker;
    gantt.attachEvent("onBeforeTaskDrag", function (id, mode, e) {
      var task = gantt.getTask(id);
      var dateToStr = task.end_date;
      marker = gantt.addMarker({
        start_date: dateToStr,
        css: "marker-test",
        text: "Now",
        title: "Marker",
      });
      return true;
    });

    gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
      gantt.getMarker(marker).start_date = task.end_date;
      gantt.updateMarker(marker);
      gantt.renderMarkers();
    });

    gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
      gantt.deleteMarker(marker);
      gantt.renderMarkers();
    });

    //today Marker
    var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
    gantt.addMarker({
      start_date: new Date(), //a Date object that sets the marker's date
      css: "today", //a CSS class applied to the marker
      // text: "Now", //the marker title
      title: dateToStr(new Date()), // the marker's tooltip
    });
    gantt.renderMarkers();

    // Task 5
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

    gantt.attachEvent("onTaskCreated", function (task) {
      task.type = "project";
      return true;
    });
    gantt.templates.scale_cell_class = function (date) {
      if (
        left_date &&
        right_date &&
        +gantt.date.date_part(new Date(left_date)) <= +date &&
        +date <= +right_date
      ) {
        return "weekend";
      }
    };
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

    //Task 6
    // gantt.plugins({
    //   auto_scheduling: true,
    // });
    // gantt.config.auto_types = true;
    // gantt.config.auto_scheduling = true;
    // gantt.config.auto_scheduling_compatibility = true;
    // gantt.locale.labels.section_split = "Display";
    // gantt.attachEvent("onBeforeTaskDrag", function (id, mode, e) {
    //   let task = gantt.getTask(id);
    //   console.log(tasks);
    //   tasks.data.push({
    //     id: 22,
    //     text: task.text,
    //     start_date: task.start_date,
    //     duration: task.duration,
    //     parent: task.parent,
    //     progress: task.progress,
    //     open: true,
    //   });
    //   gantt.render();
    //   gantt.parse(tasks);
    //   return true;
    // });

    // gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
    //   //   console.log("enddddddddddd", id);
    //   //   let task = gantt.getTask(id);
    //   gantt.deleteTask(22);
    //   let removeIndex = tasks.data.map((item) => item.id).indexOf(22);

    //   ~removeIndex && tasks.data.splice(removeIndex, 1);

    //   gantt.render();
    // });

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

    //row height
    gantt.config.row_height = 25;

    //add task less then one day
    gantt.config.duration_unit = "hour";

    gantt.templates.task_class = function (start, end, task) {
      return "task_class";
    };

    gantt.templates.timeline_cell_class = function (task, date) {
      if (date.getDay() === 0 ) {
        return "gantt_cell_left";
      }
      if (date.getDay() === 7) {
        return "gantt_cell_right";
      }
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
    const { zoom, gridFlag } = this.props;

    this.setZoom(zoom);
    this.showHideGrid(gridFlag);
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