/**
 * @childControl title {qx.ui.basic.Atom} show the panel title.
 * @childControl description {qx.ui.embed.Html} show the task description.
 * @childControl tabsPanel {qx.ui.tabview.TabView} show the tabs of task details.
 * @childControl executions {qx.ui.table.Table} show the task executions.
 * @childControl notifications {qx.ui.table.Table} show the task notifications.
 * @childControl scheduler {qx.ui.table.Table} show the task notifications.
 */
qx.Class.define("omna.management.task.Details", {
    extend: omna.management.AbstractManagement,

    statics: {
        propertiesDefaultValues: qx.lang.Object.mergeWith(
            {}, omna.management.AbstractManagement.propertiesDefaultValues, false
        )
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        this.setAppearance('management');

        if (settings.listenFromComponentId) this.getChildControl("title");
        this.getChildControl("description");
        this.getChildControl("executions");
        this.getChildControl("notifications");
        this.getChildControl("scheduler");

        if (settings.listenFromComponentId) {
            this.addMessagingListener('selection-change', this.onSelectionChange, settings.listenFromComponentId)
        } else {
            this.setCustomData(customData ? customData : {});
            this.addMessagingListener("execute-remove", this.onExecuteRemove);
        }

        this.addMessagingListener("execute-reload", this.onExecuteReload);
    },

    members: {
        // overridden
        _createChildControlImpl: function (id, hash) {
            let control;

            switch ( id ) {
                case "title":
                    control = new qx.ui.basic.Atom(this.i18nTrans('Titles', 'details'));
                    control.setMaxHeight(27);
                    this._add(control, { flex: 1 });
                    break;

                case "description":
                    control = new qx.ui.basic.Label();
                    control.set({ rich: true, padding: [0, 5], margin: 0, minHeight: 120 });
                    this._fillDescription(null, control);

                    let container = new qx.ui.container.Composite(new qx.ui.layout.VBox(0)).set({ decorator: "main" });
                    container._add(control);

                    this._add(container, { flex: 2 });
                    break;

                case "tabsPanel":
                    control = new qx.ui.tabview.TabView();
                    this._add(control, { flex: 3 });
                    break;

                case "executions":
                    control = this._createTable(['status', 'started_at', 'completed_at']);
                    this._createTapPage(control, 'executions');
                    break;

                case "notifications":
                    control = this._createTable(['type', 'message']);
                    control.addListener('cellTap', this.onNotificationCellTap, this);
                    this._createTapPage(control, 'notifications');
                    break;

                case "scheduler":
                    control = this._createScheduler();
                    this._createTapPage(control, 'scheduler');
                    break;
            }

            return control || this.base(arguments, id);
        },

        _createTapPage: function (control, label) {
            let page = new qx.ui.tabview.Page(this.i18nTrans(label));

            page.set({ layout: new qx.ui.layout.VBox(), enabled: false });
            page.add(control, { flex: 1 });

            this.getChildControl("tabsPanel").add(page);
        },

        _createScheduler: function () {
            let control = new omna.form.task.Scheduler(false);

            return control
        },

        _createTable: function (fields) {
            let tableModel = new qx.ui.table.model.Simple(),
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

            let tableColumnModel = table.getTableColumnModel(),
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

        _fillDescription: function (description, control) {
            control = control || this.getChildControl("description");

            control.setValue(
                qx.bom.Template.render('<p><b>{{title}}:</b></p><dd>{{description}}</dd>', {
                    title: this.i18nTrans('description'),
                    description: description ? description : '...'
                })
            );

            control.setEnabled(!!description)
        },

        _fillTable: function (items, controlId) {
            let control = this.getChildControl(controlId);

            items = items ? items : [];
            control.getLayoutParent().setEnabled(items.length != 0);
            control.getTableModel().setDataAsMapArray(items);
        },

        _fillScheduler: function (scheduler, controlId) {
            let control = this.getChildControl('scheduler');

            control.setData(scheduler != 'none' ? scheduler : {}, true);
            control.getLayoutParent().setEnabled(scheduler != 'none');
        },

        onExecuteReload: function (e) {
            let request = this.getRequestManagement(),
                data = this.getCustomData();

            this.emitMessaging('enabled-toolbar', false);
            this.setCustomData({});
            request.reload(data.item, function (response) {
                this.emitMessaging('enabled-toolbar', true);
                if (response.successful) {
                    data.item = response.data;
                    this.setCustomData(data);
                }
            }, this);
        },

        onExecuteRemove: function () {
            this.getModulePage().fireEvent("close");
        },

        onNotificationCellTap: function (cellInfo) {
            let data = cellInfo.getTarget().getTable().getTableModel().getRowData(cellInfo.getRow()) || [];

            q.messaging.emit("Application", data[0], data[1]);
        },

        onSelectionChange: function (data) {
            this.setCustomData(data.customData ? data.customData : {});
        },

        onChangeCustomData: function (e) {
            let customData = e.getData(),
                item = customData.item || {};

            this._fillDescription(item.description);
            this._fillTable(item.executions, 'executions');
            this._fillTable(item.notifications, 'notifications');
            this._fillScheduler(item.scheduler || 'none');

            this.emitMessaging('selection-change', customData)

            if (item.id && item.executions === undefined) this.emitMessaging('execute-reload');
        }
    }
});