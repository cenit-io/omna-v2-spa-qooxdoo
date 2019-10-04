/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/media-seek-forward.png)
 */
qx.Class.define("omna.management.DataGridRestService", {
    extend: omna.management.AbstractManagement,

    statics: {
        propertiesDefaultValues: {
            i18n: 'Common',
            serviceBasePath: '/serviceBasePath',
            formWidth: 500,
            edge: 'center',
            region: 100,
            rowHeight: 28,
            blockSize: 25,
            maxCachedBlockCount: 5,
            listenFromComponentId: null,
            primaryFieldName: 'id',
            localFieldName: null,
            baseParams: {}
        }
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        this._createTable(customData);

        this.addMessagingListener("execute-reload", this.onExecuteReload);
        this.addMessagingListener("execute-add", this.onExecuteAdd);
        this.addMessagingListener("execute-update", this.onExecuteUpdate);
        this.addMessagingListener("execute-remove", this.onExecuteRemove);
        this.addMessagingListener("execute-search", this.onExecuteSearch);
        this.addMessagingListener("execute-global-search", this.onExecuteGlobalSearch);
        this.addMessagingListener('selection-change', this.onSelectionChange, settings.listenFromComponentId);
    },

    members: {
        getFields: function () {
            return this.getSettings().fields || [];
        },

        getRequestManagement: function () {
            var settings = this.getSettings();

            if (settings.requestManagementClass) {
                var RequestManagementClass = qx.Class.getByName(settings.requestManagementClass);
                return new RequestManagementClass()
            } else {
                return new omna.request.Customs(settings.serviceBasePath);
            }
        },

        _createTable: function (customData) {
            var fields = this.getFields(),
                columnFields = fields.filter(function (f) {
                    return f.showInGrid
                }),
                settings = this.getSettings(),
                localFieldName = settings.localFieldName,
                params = {};

            qx.lang.Object.mergeWith(params, settings.baseParams);
            qx.lang.Object.mergeWith(params, customData.params);

            if (localFieldName && params[localFieldName] === undefined) {
                params[localFieldName] = -1;
            }

            var tableModel = new omna.model.DataGridRestService(columnFields, settings, params),
                table = this._table = new qx.ui.table.Table(tableModel, {
                    tableColumnModel: function (table) {
                        return new qx.ui.table.columnmodel.Resize(table);
                    }
                }),
                tableColumnModel = table.getTableColumnModel(),
                cellRendererClass, widgetClass;

            table.set({
                rowHeight: settings.rowHeight || 28,
                showCellFocusIndicator: false,
                decorator: 'omna-data-grid',
                columnVisibilityButtonVisible: true
            });

            columnFields.forEach(function (field, index) {
                if (field.gridColumnWidth) {
                    var width = String(field.gridColumnWidth);

                    width = width.match(/^\d+%$/) ? width : parseInt(width);

                    if (width !== '' && width !== 0 && width !== '0%') {
                        tableColumnModel.getBehavior().setWidth(index, width);
                    }
                } else {
                    tableColumnModel.getBehavior().setMinWidth(index, 40);
                }

                if (field.cellRendererClass) {
                    cellRendererClass = qx.Class.getByName(field.cellRendererClass);
                } else {
                    widgetClass = qx.Class.getByName(field.widgetClass);
                    cellRendererClass = widgetClass ? widgetClass.cellRendererClass : omna.table.cellrenderer.String;
                }

                if (cellRendererClass) {
                    tableColumnModel.setDataCellRenderer(index, new cellRendererClass(field));
                } else {
                    q.messaging.emit("Application", "error", this.tr("Class no found: '%1'.", field.cellRendererClass));
                }
            }, this);

            this.add(table, { flex: 2 });
            table.getSelectionModel().addListener("changeSelection", this.onChangeSelection, this);
        },

        onChangeCustomData: function (e) {
            var data = e.getData();
            if (data.params) {
                this._table.getSelectionModel().resetSelection();
                this._table.getTableModel().setParams(data.params);
            }
        },

        onExecuteReload: function () {
            this._table.getSelectionModel().resetSelection();
            this._table.getTableModel().reloadData();
        },

        onExecuteAdd: function (data) {
            this.onExecuteReload();
        },

        onExecuteUpdate: function (data) {
            this.onExecuteReload();
        },

        onExecuteRemove: function (data) {
            this._table.getSelectionModel().resetSelection();
            this._table.getTableModel().removeRow(data.customData.index);
        },

        onExecuteSearch: function (data) {
            // Save original customData before apply first search.
            this._customData = this._customData || qx.lang.Object.clone(this.getCustomData(), true);

            var dlg = data.customData.dlg,
                customData = qx.lang.Object.clone(this._customData, true),
                baseParams = this.getSettings().baseParams,
                searchData = data.params;

            // Merge params with searchData and baseParams.
            customData.params = customData.params || {};
            qx.lang.Object.mergeWith(customData.params, searchData);
            qx.lang.Object.mergeWith(customData.params, baseParams);

            dlg.close();
            this.setCustomData(customData);
        },

        onExecuteGlobalSearch: function (data) {
            var globalSearchText = this.getModulePage().getGlobalSearchText();

            if (globalSearchText != data.customData) {
                var customData = qx.lang.Object.clone(this.getCustomData(), true),
                    baseParams = this.getSettings().baseParams;

                // Merge params with searchData and baseParams.
                customData.params = customData.params || {};
                customData.params.term = data.customData;
                qx.lang.Object.mergeWith(customData.params, baseParams);

                this.getModulePage().setGlobalSearchText(data.customData);
                this.setCustomData(customData);
            }
        },

        /**
         * Fired when the selection has changed.
         *
         * @param e {qx.event.type.Event}
         */
        onChangeSelection: function (e) {
            var selectionModel = e.getTarget(),
                tableModel = this._table.getTableModel(),
                index, data, item;

            if (selectionModel.getSelectedCount()) {
                index = selectionModel.getSelectedRanges()[0].minIndex;
                item = tableModel.getRowData(index);
                data = item ? { index: index, item: item, sender: this } : null;
            } else {
                data = null
            }

            // Send message to accions
            this.emitMessaging("selection-change", data);
        },

        /**
         * TODO: Deprecate
         * Fired when emitted 'changed-selection' in any component of current modules.
         *
         * @param data {Object} Selected item data.
         */
        onSelectionChange: function (data) {
            if (data.customData) {
                var sender = data.customData.sender,
                    settings = this.getSettings(),
                    listenFromComponentId = settings.listenFromComponentId,
                    primaryFieldName = settings.primaryFieldName || 'id',
                    localFieldName = settings.localFieldName || 'id';

                if (sender && sender != this && sender.getSettings().id == listenFromComponentId) {
                    var customData = qx.lang.Object.clone(this.getCustomData(), true);

                    customData.params = qx.lang.Object.mergeWith(customData.params || {}, settings.baseParams);
                    customData.params[localFieldName] = data.customData.item[primaryFieldName];

                    this.setCustomData(customData);
                }
            }
        }
    }
});
