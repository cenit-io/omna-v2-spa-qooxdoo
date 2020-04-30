qx.Class.define("omna.table.cellrenderer.String", {
    extend: qx.ui.table.cellrenderer.String,

    /**
     * Constructor
     *
     * @param settings {Map} Settings to apply to the cell renderer.
     * <pre class='javascript'>
     *     new omna.table.cellrenderer.String({
     *          gridRendererStyle: {
     *              aling: "center",
     *              color: "red",
     *              fontStyle: "italic",
     *              fontWeight: "bold"
     *          }
     *     })
     * </pre>
     */
    construct: function (settings) {
        settings = settings || {};

        let rendererStyle = settings.gridRendererStyle || {},
            conditions = rendererStyle.conditions || [];

        this.set({
            i18nSetting: settings.i18n || {},
            cellClass: settings.cellClass || settings.name || '',
            template: settings.isTemplate || false,
            richText: settings.isRichText || false
        });

        this.base(arguments,
            rendererStyle.textAlign || 'left',
            rendererStyle.textColor,
            rendererStyle.fontStyle,
            rendererStyle.fontWeight
        );

        conditions.forEach(function (item) {
            let operator;

            if (qx.lang.Type.isArray(item.value) || this.betweenAllowed.indexOf(item.operator) != -1) {
                operator = item.operator ? item.operator : 'between';
                this.addBetweenCondition(operator, item.value[0], item.value[1], item.align, item.color, item.style, item.weight, null)
            } else if (!item.operator || this.numericAllowed.indexOf(item.operator) != -1) {
                operator = item.operator ? item.operator : '==';
                this.addNumericCondition(operator, item.value, item.align, item.color, item.style, item.weight, null)
            } else {
                this.addRegex(item.operator, item.align, item.color, item.style, item.weight, null)
            }
        }, this)
    },

    properties: {
        i18nSetting: {
            check: 'Object'
        },

        cellClass: {
            check: 'String',
            init: ''
        },

        template: {
            check: 'Boolean',
            init: false
        },

        richText: {
            check: 'Boolean',
            init: false
        }
    },

    members: {
        _getContentHtml: function (cellInfo) {
            let result = String(cellInfo.value || ""),
                i18n = qx.lang.Object.clone(this.getI18nSetting());

            if (cellInfo.rowData && !qx.lang.Object.isEmpty(i18n)) {
                i18n.catalog = i18n.catalog || 'Common';
                i18n.subCatalog = i18n.subCatalog || 'Labels';
                i18n.name = i18n.name || cellInfo.value;

                let catalog = qx.bom.String.unescape(qx.bom.Template.render(i18n.catalog, cellInfo.rowData)),
                    subCatalog = qx.bom.String.unescape(qx.bom.Template.render(i18n.subCatalog, cellInfo.rowData)),
                    name = qx.bom.String.unescape(qx.bom.Template.render(i18n.name, cellInfo.rowData));

                result = omna.I18n.trans(catalog, subCatalog, name);
            }

            if (this.isTemplate()) result = qx.bom.Template.render(result, cellInfo.rowData);

            return this.isRichText() ? result : qx.bom.String.escape(result);
        },

        // overridden
        _getCellClass: function (cellInfo) {
            return "qooxdoo-table-cell " + this.getCellClass();
        },

        // overridden
        _getCellStyle: function (cellInfo) {
            let tableModel = cellInfo.table.getTableModel(),
                i, cond_test, compareValue,
                style = {
                    "text-align": this.__defaultTextAlign,
                    "color": this.__defaultColor,
                    "font-style": this.__defaultFontStyle,
                    "font-weight": this.__defaultFontWeight
                };

            this.conditions.forEach(function (condition) {

                cond_test = false;

                if (qx.lang.Array.contains(this.numericAllowed, condition[0])) {
                    compareValue = condition[6] == null ? cellInfo.value : tableModel.getValueById(condition[6], cellInfo.row);

                    switch ( condition[0] ) {
                        case "==":
                            if (compareValue == condition[5]) cond_test = true;
                            break;

                        case "!=":
                            if (compareValue != condition[5]) cond_test = true;
                            break;

                        case ">":
                            if (compareValue > condition[5]) cond_test = true;
                            break;

                        case "<":
                            if (compareValue < condition[5]) cond_test = true;
                            break;

                        case ">=":
                            if (compareValue >= condition[5]) cond_test = true;
                            break;

                        case "<=":
                            if (compareValue <= condition[5]) cond_test = true;
                            break;
                    }
                } else if (qx.lang.Array.contains(this.betweenAllowed, condition[0])) {
                    if (condition[7] == null) {
                        compareValue = cellInfo.value;
                    } else {
                        compareValue = tableModel.getValueById(condition[7], cellInfo.row);
                    }

                    switch ( condition[0] ) {
                        case "between":
                            if (compareValue >= condition[5] && compareValue <= condition[6]) cond_test = true;
                            break;

                        case "!between":
                            if (compareValue < condition[5] || compareValue > condition[6]) cond_test = true;
                            break;
                    }
                } else if (condition[0] == "regex") {
                    compareValue = condition[6] == null ? cellInfo.value : tableModel.getValueById(condition[6], cellInfo.row);

                    let m = condition[5].match(/\/(.*)\/(\w*)/),
                        the_pattern;

                    the_pattern = m ? new RegExp(m[1], m[2]) : new RegExp(condition[5]);
                    cond_test = the_pattern.test(compareValue);
                }

                // Apply formatting, if any.
                if (cond_test == true) this.__applyCellFormatting(condition, style);
            }, this);

            let styleString = [];
            for (let key in style) if (style[key]) styleString.push(key, ":", style[key], ";");

            return styleString.join("");
        },

        __applyCellFormatting: function (condition, style) {
            if (condition[1] != null) style["text-align"] = condition[1];
            if (condition[2] != null) style["color"] = condition[2];
            if (condition[3] != null) style["font-style"] = condition[3];
            if (condition[4] != null) style["font-weight"] = condition[4];
        }
    }
});