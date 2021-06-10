import React, { Component } from "react";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./Gantt.css";
import AddColumnBox from "../modalboxes/add_column_box";
//  import "./material_skin.css";

export default class Gantt extends Component {
  constructor(props) {
    super(props);
    this.initZoom();
  }

  // instance of gantt.dataProcessor
  dataProcessor = null;

  initZoom() {
    // var hourToStr = gantt.date.date_to_str("%H:%i");
    // var hourRangeFormat = function (step) {
    //   return function (date) {
    //     var intervalEnd = new Date(gantt.date.add(date, step, "hour") - 1);
    //     return hourToStr(date) + " - " + hourToStr(intervalEnd);
    //   };
    // };
    // var zoomConfig = {
    //   levels: [
    //     {
    //       name: "year",
    //       scale_height: 50,
    //       min_column_width: 30,
    //       scales: [{ unit: "year", step: 1, format: "%Y" }],
    //     },
    //     {
    //       name: "quarter",
    //       height: 50,
    //       min_column_width: 90,
    //       scales: [
    //         { unit: "month", step: 1, format: "%M" },
    //         {
    //           unit: "quarter",
    //           step: 1,
    //           format: function (date) {
    //             var dateToStr = gantt.date.date_to_str("%M");
    //             var endDate = gantt.date.add(
    //               gantt.date.add(date, 3, "month"),
    //               -1,
    //               "day"
    //             );
    //             return dateToStr(date) + " - " + dateToStr(endDate);
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       name: "month",
    //       scale_height: 50,
    //       min_column_width: 120,
    //       scales: [
    //         { unit: "month", format: "%F, %Y" },
    //         { unit: "week", format: "Week #%W" },
    //       ],
    //     },
    //     {
    //       name: "week",
    //       scale_height: 50,
    //       min_column_width: 50,
    //       scales: [
    //         {
    //           unit: "week",
    //           step: 1,
    //           format: function (date) {
    //             var dateToStr = gantt.date.date_to_str("%M %d");
    //             var endDate = gantt.date.add(date, -6, "day");
    //             var weekNum = gantt.date.date_to_str("%W")(date);
    //             return (
    //               dateToStr(date) +
    //               " _ " +
    //               dateToStr(endDate) +
    //               "   W" +
    //               weekNum
    //             );
    //           },
    //         },
    //         { unit: "day", step: 1, format: "%D" },
    //       ],
    //     },
    //     {
    //       name: "day",
    //       scale_height: 27,
    //       min_column_width: 80,
    //       scales: [
    //         { unit: "day", step: 1, format: "%d %M" },
    //         {
    //           unit: "day",
    //           step: 1,
    //           format: function (date) {
    //             return "1|2|3|4|5|6|7|8";
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       name: "12hours",
    //       scale_height: 50,
    //       min_column_width: 120,
    //       scales: [
    //         { unit: "day", format: "%d %M", step: 1 },
    //         { unit: "hour", format: hourRangeFormat(12), step: 12 },
    //       ],
    //     },
    //     // {
    //     //   name: "6hours",
    //     //   scale_height: 50,
    //     //   min_column_width: 120,
    //     //   scales: [
    //     //     { unit: "day", format: "%d %M", step: 1 },
    //     //     { unit: "hour", format: hourRangeFormat(6), step: 6 },
    //     //   ],
    //     // },
    //     {
    //       name: "day",
    //       scale_height: 50,
    //       min_column_width: 120,
    //       scales: [
    //         { unit: "day", format: "%d %M", step: 1 },
    //         { unit: "hour", format: "%H", step: 1 },
    //       ],
    //     },
    //   ],
    //   // startDate: "2021-05-12",
    //   // endDate: "2048-9-25",
    //   useKey: "ctrlKey",
    //   // trigger: "wheel",
    //   element: function () {
    //     return gantt.$root.querySelector(".gantt_task");
    //   },
    // };
    // gantt.ext.zoom.init(zoomConfig);
    function onMouseWheel(e) {
      var wy = gantt.env.isFF ? e.deltaY * -40 : e.wheelDelta;
      var diff = wy < 0 ? -1 : 1;
      var currentLevel = gantt.config.min_column_width;
      var level = currentLevel + diff * 10;
      if (level !== currentLevel) {
        currentLevel = level;

        gantt.config.min_column_width = currentLevel;
        // gantt.render();
      }

      var zoom_level = gantt.ext.zoom.getCurrentLevel();

      if (zoom_level === 0) {
        if (gantt.config.min_column_width < 50) {
          gantt.ext.zoom.zoomOut();
          // gantt.render();
        }
      }

      if (zoom_level === 1) {
        if (gantt.config.min_column_width > 60) {
          gantt.ext.zoom.zoomIn();
          // gantt.render();
        }
        if (gantt.config.min_column_width < 20) {
          gantt.ext.zoom.zoomOut();
          gantt.config.min_column_width = 130;
          // gantt.render();
        }
      }

      if (zoom_level === 2) {
        if (gantt.config.min_column_width > 130) {
          gantt.ext.zoom.zoomIn();
          gantt.config.min_column_width = 30;
          // gantt.render();
        }
        if (gantt.config.min_column_width < 30) {
          gantt.ext.zoom.zoomOut();
          // gantt.render();
        }
      }

      if (zoom_level === 3) {
        if (gantt.config.min_column_width > 120) {
          gantt.ext.zoom.zoomIn();
          gantt.config.min_column_width = 30;
          // gantt.render();
        }
        if (gantt.config.min_column_width < 30) {
          gantt.ext.zoom.zoomOut();
          // gantt.render();
        }
      }

      if (zoom_level === 4) {
        if (gantt.config.min_column_width > 60) {
          gantt.ext.zoom.zoomIn();
          gantt.config.min_column_width = 90;
          // gantt.render();
        }
        if (gantt.config.min_column_width < 20) {
          gantt.config.min_column_width = 20;
          // gantt.render();
        }
      }
      var selected_task = gantt.getSelectedId();
      if (selected_task) gantt.showTask(selected_task);
      gantt.render();
      if (e.preventDefault) e.preventDefault();
      e.cancelBubble = true;
      return false;
    }
    var zoomConfig = {
      levels: [
        {
          name: "day",
          scale_height: 50,
          min_column_width: 80,
          scales: [
            { unit: "day", step: 1, format: "%d %M" },
            // {
            //   unit: "day",
            //   step: 1,
            //   format: function (date) {
            //     return "1|2|3|4|5|6|7|8";
            //   },
            // },
          ],
        },
        {
          name: "week",
          scale_height: 50,
          min_column_width: 50,
          scales: [
            {
              unit: "week",
              step: 2,
              format: function (date) {
                var dateToStr = gantt.date.date_to_str("%d %M");
                var endDate = gantt.date.add(date, -6, "day");
                var weekNum = gantt.date.date_to_str("%W")(date);
                return (
                  "#" +
                  weekNum +
                  ", " +
                  dateToStr(date) +
                  " - " +
                  dateToStr(endDate)
                );
              },
            },
            { unit: "day", step: 1, format: "%j %D" },
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
          scales: [
            { unit: "year", step: 1, format: "%Y" },
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
      ],
      useKey: "ctrlKey",
      trigger: "wheel",
      handler: onMouseWheel,
      element: function () {
        return gantt.$root.querySelector(".gantt_task");
      },
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
    gantt.plugins({
      auto_scheduling: true,
    });

    // gantt.config.work_time = true;

    gantt.config.auto_scheduling = true;
    gantt.config.auto_scheduling_initial = false;

    gantt.config.auto_scheduling_compatibility = true;
    gantt.config.auto_scheduling_strict = true;

    // gantt.config.date_format = "%d-%m-%Y";
    //
    gantt.attachEvent("onBeforeAutoSchedule", function () {
      console.log("onBeforeAutoSchedule");
      return true;
    });
    gantt.attachEvent("onAfterAutoSchedule", function () {
      console.log("onAfterAutoSchedule");
    });
    gantt.attachEvent("onBeforeTaskAutoSchedule", function () {
      console.log("onBeforeTaskAutoSchedule");
      return true;
    });
    gantt.attachEvent(
      "onAfterTaskAutoSchedule",
      function (task, new_date, constraint, predecessor) {
        console.log("onAfterTaskAutoSchedule");
      }
    );

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

    //enable colum reordring
    gantt.config.reorder_grid_columns = true;

    // gantt.attachEvent("onLinkCreated", function (link) {
    //   // your code here
    //   var source_task = gantt.getTask(link.source);
    //   var target_task = gantt.getTask(link.target);
    //   let duration = target_task.duration;
    //   console.log(duration);
    //   switch (link.type) {
    //     case "0":
    //       target_task.start_date = source_task.end_date;
    //       target_task.duration = duration;
    //       console.log("target_task.duration: ", target_task.duration);

    //       break;
    //     case "1":
    //       target_task.start_date = source_task.start_date;
    //       target_task.duration = duration;
    //       break;
    //     case "2":
    //       target_task.end_date = source_task.end_date;
    //       target_task.duration = duration;
    //       break;
    //     case "3":
    //       target_task.end_date = source_task.start_date;
    //       target_task.duration = duration;
    //       break;
    //     default:
    //       break;
    //   }
    //   // gantt.render();
    //   return true;
    // });

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
    gantt.config.fit_tasks = true;

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
    // var left_date, right_date;
    // gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
    //   left_date = task.start_date;
    //   right_date = task.end_date;
    //   // if(task.type !== "project"){
    //   // gantt.render();
    //   // }
    // });

    // gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
    //   left_date = right_date = null;
    //   gantt.render();
    // });

    // gantt.attachEvent("onTaskCreated", function (task) {
    //   task.type = "project";
    //   return true;
    // });
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
    // gantt.templates.timeline_cell_class = function (task, date) {
    //   if (
    //     left_date &&
    //     right_date &&
    //     +gantt.date.date_part(new Date(left_date)) <= +date &&
    //     +date <= +right_date
    //   ) {
    //     return "weekend";
    //   }
    // };

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

    // performance Work
    gantt.config.show_task_cells = false;
    // gantt.config.static_background = true;
    gantt.config.static_background_cells = false;

    // gantt.config.start_date = "2021-05-14";
    // gantt.config.end_date = "2021-09-14";

    // gantt.config.show_progress = false;
    // gantt.config.smart_scales = true;

    gantt.templates.progress_text = function (start, end, task) {
      return '<svg height="20" width="20"><circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="red" />Sorry, your browser does not support inline SVG.</svg> ';
    };

    const task_operations = (task_id, action) => {
      var task = gantt.getTask(task_id);

      if (action === "left_decrease") {
        task.start_date = gantt.date.add(task.start_date, -1, "day");
      }
      if (action === "left_increase") {
        task.start_date = gantt.date.add(task.start_date, 1, "day");
      }
      if (action === "right_decrease") {
        task.end_date = gantt.date.add(task.end_date, -1, "day");
      }
      if (action === "right_increase") {
        task.end_date = gantt.date.add(task.end_date, 1, "day");
      }

      gantt.render();
    };

    gantt.templates.leftside_text = function (start, end, task) {
      if (task.type !== "project" && task.type !== "milestone") {
        var buttons = `
        <i id="left_F_${task.id}" class="fa fa-plus" aria-hidden="true"></i>
        <i id="left_S_${task.id}" class="fa fa-minus" aria-hidden="true"></i>`;

        // <svg id="left_${task.id}" height="20" width="20" ><circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="red" />Sorry, your browser does not support inline SVG.</svg>
        // <svg id="right_${task.id} height="20" width="20" ><circle cx="5" cy="5" r="4" stroke="black" stroke-width="1" fill="red" />Sorry, your browser does not support inline SVG.</svg>`;
        setTimeout(() => {
          if (document.getElementById("left_F_" + task.id)) {
            document
              .getElementById("left_F_" + task.id)
              .addEventListener("click", function (e) {
                task_operations(task.id, "left_decrease");
              });
          }
          if (document.getElementById("left_S_" + task.id)) {
            document
              .getElementById("left_S_" + task.id)
              .addEventListener("click", function (e) {
                task_operations(task.id, "left_increase");
              });
          }
        }, 200);
        return buttons;
      }
    };

    gantt.templates.rightside_text = function (start, end, task) {
      if (task.type !== "project" && task.type !== "milestone") {
        var buttons = `
        <i id="right_F_${task.id}" class="fa fa-plus" aria-hidden="true"></i>
        <i id="right_S_${task.id}" class="fa fa-minus" aria-hidden="true"></i>`;
        setTimeout(() => {
          if (document.getElementById("right_F_" + task.id)) {
            document
              .getElementById("right_F_" + task.id)
              .addEventListener("click", function (e) {
                task_operations(task.id, "right_increase");
              });
          }
          if (document.getElementById("right_S_" + task.id)) {
            document
              .getElementById("right_S_" + task.id)
              .addEventListener("click", function (e) {
                task_operations(task.id, "right_decrease");
              });
          }
        }, 200);
        return buttons;
      }
    };

    // gantt.config.autosize = "xy";

    gantt.init(this.ganttContainer);
    this.add_gridHideAndShow_button();
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
    }, 500);
  };

  render() {
    const { zoom } = this.props;

    this.setZoom(zoom);

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
