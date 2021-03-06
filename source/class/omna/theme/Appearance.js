/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

/**
 * @asset(omna/icon/16/actions/search.png)
 * @asset(omna/icon/16/actions/filter.png)
 * @asset(omna/css/styles.css)
 */
qx.Theme.define("omna.theme.Appearance", {
  extend: qx.theme.indigo.Appearance,

  appearances: {
    "app-footer": {
      style: function () {
        return {
          decorator: "app-footer",
          font: "footer",
          padding: 5,
          textColor: "text-selected",
          alignY: "middle",
          alignX: "center"
        };
      }
    },

    "content-box": {
      style: function () {
        return {
          decorator: "content-box-odd",
          textAlign: "justify",
          margin: 5,
          marginBottom: 10,
          padding: 5,
          cursor: "text"
        }
      }
    },

    "management": {
      style: function () {
        return {
          decorator: "main",
          padding: 0
        };
      }
    },

    "management/title": {
      style: function () {
        return {
          decorator: "table-header-column-button",
          font: 'bold',
          center: true
        };
      }
    },

    "management/form-panel/pane": "pane",
    "management/form-panel/scrollbar-x": "scrollbar",
    "management/form-panel/scrollbar-y": "scrollbar",
    "management/tabsPanel": "tabview",
    "management/executions": "table",
    "management/notifications": "table",
    "management/scheduler": "table",
    "management/general-tab": "tabview-page",

    "cell": {
      style: function (states) {
        return {
          backgroundColor: states.selected ? "table-row-background-selected" : "table-row-background-even",
          textColor: states.selected ? "text-selected" : "text",
          padding: [5, 6]
        }
      }
    },

    "qooxdoo-table-cell": {
      style: function (states) {
        return {
          backgroundColor: states.selected ? "table-row-background-selected" : "table-row-background-even",
          textColor: "red",
          padding: [5, 6]
        }
      }
    },

    "profile": {
      style: function (states) {
        return {
          textColor: 'black',
          padding: 10
        };
      }
    },

    "textfield": {
      style: function (states) {
        let textColor,
          decorator = "inset",
          padding = [2, 3],
          backgroundColor = "white";

        if (states.showingPlaceholder) {
          textColor = "text-placeholder";
        }

        if (states.disabled) {
          textColor = "text-disabled";
          backgroundColor = "background-disabled"
        } else if (states.readonly) {
          textColor = "text-readonly";
          backgroundColor = "background-readonly"
        } else if (states.invalid) {
          decorator = "border-invalid";
          padding = [1, 2];
        } else if (states.focused) {
          decorator = "focused-inset";
          padding = [1, 2];
        }

        return {
          decorator: decorator,
          padding: padding,
          textColor: textColor,
          backgroundColor: backgroundColor
        };
      }
    },

    "search-text-field": {
      style: function (states) {
        return {
          icon: "omna/icon/16/actions/search.png",
          margin: 1,
          maxHeight: 30,
          allowGrowX: true,
          allowGrowY: false
        };
      }
    },

    "search-text-field/icon": {
      style: function (states) {
        return {
          alignX: "right",
          marginLeft: -20,
          paddingRight: 4
        };
      }
    },

    "search-text-field/text-field": {
      include: "textfield",
      alias: "textfield",

      style: function (states) {
        return {
          font: "default",
          textColor: "black"
        };
      }
    },

    "global-search-text-field": {
      include: "search-text-field",
      alias: "search-text-field",

      style: function (states) {
        return {
          margin: [5, 10]
        };
      }
    },

    "global-search-text-field/text-field": {
      include: "search-text-field/text-field",

      style: function (states) {
        return {
          width: 200,
          backgroundColor: states.focused ? "white" : "transparent",
          decorator: "global-search-text-field-" + (states.focused ? "focused-inset" : "inset")
        };
      }
    },

    "filter-select-box": "textfield",
    "filer-select-box/search-text-field": {
      include: "search-text-field",

      style: function (states) {
        return { icon: "omna/icon/16/actions/filter.png" };
      }
    },
    "filer-select-box/search-text-field/text-field": {
      style: function (states) {
        return { decorator: "none" };
      }
    },

    "toolbar-button": {
      alias: "atom",

      style: function (states) {
        let decorator = "button-box";

        if (states.disabled) {
          decorator = "button-box";
        } else if (states.hovered && !states.pressed && !states.checked) {
          decorator = "button-box-hovered";
        } else if (states.hovered && (states.pressed || states.checked)) {
          decorator = "button-box-pressed-hovered";
        } else if (states.pressed || states.checked) {
          decorator = "button-box-pressed";
        }

        // set the right left and right decoratos
        if (states.left) {
          decorator += "-left";
        } else if (states.right) {
          decorator += "-right";
        } else if (states.middle) {
          decorator += "-middle";
        }

        // set the margin
        let margin = [0, 10];
        if (states.left || states.middle || states.right) {
          margin = [0, 0];
        }

        return {
          cursor: states.disabled ? undefined : "pointer",
          decorator: decorator,
          margin: margin,
          padding: [3, 5]
        };
      }
    }
  }
});