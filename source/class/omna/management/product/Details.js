/**
 * @childControl tabsPanel {qx.ui.tabview.TabView} show the tabs of task details.
 * @childControl description {qx.ui.embed.Html} show the task description.
 * @childControl notifications {qx.ui.table.Table} show the product notifications.
 * @ignore(showdown.*)
 */
qx.Class.define("omna.management.product.Details", {
    extend: omna.management.AbstractManagement,
    include: [omna.mixin.MSettings],

    statics: {
        propertiesDefaultValues: qx.lang.Object.mergeWith(
            {}, omna.management.AbstractManagement.propertiesDefaultValues, false
        )
    },

    // override
    construct: function (settings, customData, modulePage) {
        settings.requestManagementClass = 'omna.request.Products';

        this.base(arguments, settings, customData, modulePage);

        this.setAppearance('management');
        this.getChildControl("general");
        this.getChildControl("notifications");

        this.setCustomData(customData ? customData : {});

        this.addMessagingListener("execute-reload", this.onExecuteReload);
        this.addMessagingListener("execute-remove", this.onExecuteRemove);
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            var control;

            switch ( id ) {
                case "tabsPanel":
                    control = new qx.ui.tabview.TabView();
                    this._add(control, { flex: 2 });
                    break;

                case "general":
                    control = new qx.ui.basic.Label();
                    control.set({ rich: true, padding: [0, 5], margin: 0, minHeight: 120 });
                    this._fillGeneral({}, control);
                    this._createTapPage(control, 'general');
                    break;

                case "notifications":
                    control = this._createTable(['type', 'message']);
                    this._createTapPage(control, 'notifications');
                    break;
            }

            return control || this.base(arguments, id);
        },

        _createTapPage: function (control, label) {
            var page = new qx.ui.tabview.Page(this.i18nTrans(label));

            page.set({ layout: new qx.ui.layout.VBox() });
            page.add(control, { flex: 1 });

            this.getChildControl("tabsPanel").add(page);
        },

        _createTable: function (fields) {
            var tableModel = new qx.ui.table.model.Simple(),
                table, columnNames = [], columnIDs = [];

            fields.forEach(function (field) {
                columnNames.push(this.i18nTrans(field));
                columnIDs.push(field);
            }, this);

            tableModel.setColumns(columnNames, columnIDs);

            table = new qx.ui.table.Table(tableModel, {
                tableColumnModel: function (table) {
                    return new qx.ui.table.columnmodel.Resize(table);
                }
            });

            table.set({
                rowHeight: 28,
                showCellFocusIndicator: false,
                decorator: 'omna-data-grid',
                columnVisibilityButtonVisible: false
            });

            var tableColumnModel = table.getTableColumnModel(),
                behavior = tableColumnModel.getBehavior();

            behavior.setWidth(0, 90);

            fields.forEach(function (field, index) {
                tableColumnModel.setDataCellRenderer(index, this._createCellRenderer(field));
            }, this);

            return table
        },

        _createCellRenderer: function (field) {
            switch ( field ) {
                case "status":
                    return new omna.table.cellrenderer.String({
                        name: field,
                        gridRendererStyle: {
                            conditions: [
                                { color: "#FFC107", value: "pending" },
                                { color: "#28A745", value: "running" },
                                { color: "#17A2B8", value: "paused" },
                                { color: "#007BFF", value: "completed" },
                                { color: "#DC3545", value: "failed" }
                            ]
                        }
                    });

                case "type":
                    return new omna.table.cellrenderer.String({
                        name: field,
                        gridRendererStyle: {
                            conditions: [
                                { color: "#007BFF", value: "info" },
                                { color: "#FFC107", value: "warning" },
                                { color: "#DC3545", value: "error" }
                            ]
                        }
                    });

                case "started_at":
                case "completed_at":
                    return new omna.table.cellrenderer.Date();
                default:
                    return new omna.table.cellrenderer.String({ name: field });
            }
        },

        _fillGeneral: function (item, control) {
            console.log(item);
            control = control || this.getChildControl("general");

            this.loadTemplate('omna/templates/ProductsDetails.html.hbs', function (template) {
                control.setValue(qx.bom.Template.render(template, item));
            }, this);
        },

        _fillTable: function (items, controlId) {
            var control = this.getChildControl(controlId);

            items = items ? items : [];
            control.getTableModel().setDataAsMapArray(items);
        },

        onExecuteReload: function (e) {
            var request = this.__requestManagement = this.getRequestManagement(),
                data = this.getCustomData();

            this.emitMessaging('enabled-toolbar', false);
            this.setCustomData({});
            request.reload(data.item, function (response) {
                if (response.successful) data.item = response.data;
                this.setCustomData(data);
                this.emitMessaging('enabled-toolbar', true);
            }, this);
        },

        onExecuteRemove: function () {
            this.getModulePage().fireEvent("close");
        },


        onSelectionChange: function (data) {
            this.setCustomData(data.customData ? data.customData : {});
        },

        onChangeCustomData: function (e) {
            var data = e.getData(),
                item = data.item || {};

            this._fillGeneral(item);
            this._fillTable(item.notifications, 'notifications');

            this.emitMessaging("selection-change", { index: data.index, item: data.item, sender: this });
        }
    },

    destruct: function () {
        this.__requestManagement && this.__requestManagement.dispose();
    }
});