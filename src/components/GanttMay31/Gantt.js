import React, { Component } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./Gantt.css";
import AddColumnBox from "../modalboxes/add_column_box";
//  import "./material_skin.css";

export default class Gantt_31 extends Component {
  constructor(props) {
    super(props);
    this.initZoom();
  }

  // instance of gantt.dataProcessor
  dataProcessor = null;

  initZoom() {
    var zoomConfig = {
      levels: [
        {
          name: "day",
          scale_height: 27,
          min_column_width: 80,
          scales: [
            { unit: "day", step: 1, format: "%d %M" },
            {
              unit: "day",
              step: 1,
              format: function (date) {
                return "1|2|3|4|5|6|7|8";
              },
            },
          ],
        },
        {
          name: "week",
          scale_height: 50,
          min_column_width: 50,
          scales: [
            {
              unit: "week",
              step: 1,
              format: function (date) {
                var dateToStr = gantt.date.date_to_str("%M %d");
                var endDate = gantt.date.add(date, -6, "day");
                var weekNum = gantt.date.date_to_str("%W")(date);
                return (
                  dateToStr(date) +
                  " _ " +
                  dateToStr(endDate) +
                  "   W" +
                  weekNum
                );
              },
            },
            { unit: "day", step: 1, format: "%D" },
          ],
        },
        {
          name: "month",
          scale_height: 50,
          min_column_width: 120,
          scales: [
            { unit: "month", format: "%F, %Y" },
            { unit: "week", format: "Week #%W" },
          ],
        },
        {
          name: "quarter",
          height: 50,
          min_column_width: 90,
          scales: [
            { unit: "month", step: 1, format: "%M" },
            {
              unit: "quarter",
              step: 1,
              format: function (date) {
                var dateToStr = gantt.date.date_to_str("%M");
                var endDate = gantt.date.add(
                  gantt.date.add(date, 3, "month"),
                  -1,
                  "day"
                );
                return dateToStr(date) + " - " + dateToStr(endDate);
              },
            },
          ],
        },
        {
          name: "year",
          scale_height: 50,
          min_column_width: 30,
          scales: [{ unit: "year", step: 1, format: "%Y" }],
        },
      ],
    };
    gantt.ext.zoom.init(zoomConfig);
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
    var predecessors = { type: "predecessor", map_to: "auto" };

    gantt.config.columns = [
      { name: "wbs", label: "№", width: 40, template: gantt.getWBSCode },
      { name: "text", label: "Task name", width: 180, tree: true },
      // { name: "start_date", label: "Start date", width: 120, align: "center" },
      { name: "end_date", label: "Due date", width: 120, align: "center" },
      {
        name: "predecessors",
        label: "Predecessors",
        width: 100,
        align: "left",
        editor: predecessors,
        resize: true,
        template: function (task) {
          var links = task.$target;

          var labels = [];
          for (var i = 0; i < links.length; i++) {
            var link = gantt.getLink(links[i]);
            var source_task = gantt.getTask(link.source);
            // var source_task = gantt.getTask(link.source);

            labels.push(source_task.text);
          }
          return labels.join(", ");
        },
      },
      // {  label: "Predecessors", width: 100 },
      { name: "add", label: "", width: 44 },
    ];
    gantt.attachEvent("onLinkCreated", function (link) {
      // your code here
      var source_task = gantt.getTask(link.source);
      var target_task = gantt.getTask(link.target);
      switch (link.type) {
        case "0":
          target_task.start_date = source_task.end_date;
          break;
        case "1":
          target_task.start_date = source_task.start_date;
          break;
        case "2":
          target_task.end_date = source_task.end_date;
          break;
        case "3":
          target_task.end_date = source_task.start_date;
          break;
        default:
          break;
      }
      // gantt.render();
      return true;
    });

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
      if (date.getDay() === 0) {
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
  add_column = (data) => {
    let column = { label: data.label, width: data.columnWidth };
    gantt.config.columns.push(column);
    gantt.render();
  };

  add_gridHideAndShow_button = () => {
    setTimeout(() => {
      let invis = document.getElementsByClassName(
        "gantt_layout_cell  timeline_cell gantt_layout_outer_scroll gantt_layout_outer_scroll_vertical gantt_layout_outer_scroll gantt_layout_outer_scroll_horizontal"
      );
      var tag = document.createElement("span");
      tag.setAttribute("id", "span_id");
      invis[0].appendChild(tag);
      let innerdiv = document.getElementById("span_id");

      var div = document.createElement("div");
      div.setAttribute("class", "inner_div");
      div.innerHTML = "<i class='fa fa-chevron-left'></i>";
      innerdiv.appendChild(div);
      tag.addEventListener("click", function () {
        let icon = document.getElementsByClassName("inner_div");
        if (gantt.config.show_grid) {
          icon[0].innerHTML = "<i class='fa fa-chevron-right'></i>";
        } else {
          icon[0].innerHTML = "<i class='fa fa-chevron-left'></i>";
        }
        gantt.config.show_grid = !gantt.config.show_grid;
        gantt.render();
      });
    }, 200);
  };

  render() {
    const { zoom } = this.props;

    this.setZoom(zoom);
    this.add_gridHideAndShow_button();

    return (
      <>
        <AddColumnBox onColumnAdd={this.add_column} />
        <div
          ref={(input) => {
            this.ganttContainer = input;
          }}
          style={{ width: "100%", height: "100%", position: "absolute" }}
        ></div>
      </>
    );
  }
}