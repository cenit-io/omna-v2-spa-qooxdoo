/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/media-seek-forward.png)
 */
qx.Class.define("omna.management.DataGridRestService", {
    extend: omna.management.AbstractManagement,

    statics: {
        propertiesDefaultValues: qx.lang.Object.mergeWith(
            {
                serviceBasePath: '/serviceBasePath',
                formWidth: 500,
                searchFormWidth: 400,
                rowHeight: 28,
                blockSize: 25,
                maxCachedBlockCount: 5,
                primaryFieldName: 'id',
                localFieldName: null,
                baseParams: {}
            }, omna.management.AbstractManagement.propertiesDefaultValues, false
        )
    },

    // override
    construct: function (settings, customData, modulePage) {
        this.base(arguments, settings, customData, modulePage);

        this._createTable();

        this.addMessagingListener("execute-reload", this.onExecuteReload);
        this.addMessagingListener("execute-add", this.onExecuteAdd);
        this.addMessagingListener("execute-update", this.onExecuteUpdate);
        this.addMessagingListener("execute-remove", this.onExecuteRemove);
        this.addMessagingListener("execute-search", this.onExecuteSearch);
        this.addMessagingListener("execute-global-search", this.onExecuteGlobalSearch);
        this.addMessagingListener('selection-change', this.onSelectionChange, settings.listenFromComponentId);

        this.onExecuteReload();
    },

    members: {
        getFields: function () {
            return this.getSettings().fields || [];
        },

        _createTable: function () {
            var fields = this.getFields(),
                settings = this.getSettings(),
                columnFields = fields.filter((f) => f.showInGrid);

            var tableModel = new omna.model.DataGridRestService(columnFields, settings, this.getRequestManagement()),
                table = this.__table = new qx.ui.table.Table(tableModel, {
                    tableColumnModel: function (table) {
                        return new qx.ui.table.columnmodel.Resize(table);
                    }
                }),
                tableColumnModel = table.getTableColumnModel();

            table.set({
                rowHeight: settings.rowHeight || 28,
                showCellFocusIndicator: false,
                decorator: 'omna-data-grid',
                columnVisibilityButtonVisible: true
            });

            columnFields.forEach(function (field, index) {
                var cellRendererClass, widgetClass;

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
                    cellRendererClass = this._getClassByName(field.cellRendererClass);
                } else if (field.widgetClass && (widgetClass = this._getClassByName(field.widgetClass))) {
                    cellRendererClass = widgetClass.cellRendererClass || omna.table.cellrenderer.String
                }

                if (cellRendererClass) tableColumnModel.setDataCellRenderer(index, new cellRendererClass(field));
            }, this);

            this.add(table, { flex: 2 });
            table.getSelectionModel().addListener("changeSelection", this.onChangeSelection, this);
            table.addListener("cellDbltap", this.onCellDbltap, this);
        },

        onChangeCustomData: function (e) {
            var data = e.getData();

            if (data.params) this.onExecuteReload();
        },

        onExecuteReload: function () {
            this.getRequestManagement().setBaseParams(this.getRequestBaseParams());
            this.__table.getSelectionModel().resetSelection();
            this.__table.getTableModel().reloadData();
        },

        onExecuteAdd: function (data) {
            this.onExecuteReload();
        },

        onExecuteUpdate: function (data) {
            this.onExecuteReload();
        },

        onExecuteRemove: function (data) {
            var settings = this.getSettings();

            if (settings.reloadAfterRemove) return this.onExecuteReload();

            this.__table.getSelectionModel().resetSelection();
            this.__table.getTableModel().removeRow(data.customData.index);
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

        onCellDbltap: function (e) {
            var tableModel = this.__table.getTableModel(),
                data = { index: e.getRow(), item: tableModel.getRowData(e.getRow()), sender: this };

            this.emitMessaging("open-details", data);
        },

        /**
         * Fired when the selection has changed.
         *
         * @param e {qx.event.type.Event}
         */
        onChangeSelection: function (e) {
            var selectionModel = e.getTarget(),
                tableModel = this.__table.getTableModel(),
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
    },

    destruct: function () {
        this.__table.getTableModel().dispose();
        this.__table.dispose();
    }
});
