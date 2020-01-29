/**
 * @ignore(Map)
 */
qx.Class.define("omna.model.DataGridRestService", {
    extend: qx.ui.table.model.Remote,
    include: [qx.locale.MTranslation],

    construct: function (fields, settings, params, requestManagement) {
        this.base(arguments);
        this.set({
            blockSize: settings.blockSize || 20,
            maxCachedBlockCount: settings.maxCachedBlockCount || 5,
            requestManagement: requestManagement,
            serviceBasePath: settings.serviceBasePath || null,
            params: params
        });

        this.__fields = [];

        var i18nCatalog = settings.i18n,
            columnNames = [],
            columnIDs = [];

        fields.forEach(function (field) {
            if (field.showInGrid) {
                columnNames.push(omna.I18n.trans(i18nCatalog, 'Labels', field.label || field.name));
                columnIDs.push(field.name);
                this.__fields.push(field);
            }
        }, this);

        this.setColumns(columnNames, columnIDs);
        this.addListener('changeFilter', this.reloadData, this);
    },

    properties: {
        params: {
            check: 'Object',
            init: {},
            event: 'changeFilter'
        },

        requestManagement: {
            check: 'omna.request.AbstractResource'
        },

        serviceBasePath: {
            nullable: true
        }
    },

    members: {
        _loadRowCount: function () {
            var request = this.getRequestManagement();

            request.count(this.getParams(), function (response) {
                if (response.successful) this._onRowCountLoaded(response.pagination.total);
            }, this);

            this._onRowCountLoaded(0);
        },

        _loadRowData: function (pFrom, pTo) {
            var request = this.getRequestManagement();

            request.findRange(pFrom, pTo, this.getOrder(), this.getParams(), function (response) {
                if (response.successful) {
                    response.data.forEach(function (record, index) {
                        Object.keys(record).forEach(function (field) {
                            record[field] = this.parseValue(field, record[field]);
                        }, this);
                    }, this);

                    this._onRowDataLoaded(response.data);
                }
            }, this);
        },

        reloadData: function () {
            this.clearCache();
            this.base(arguments)
        },

        getOrder: function () {
            var sortField = this.getColumnId(this.getSortColumnIndex()),
                sortOrder = this.isSortAscending() ? " asc" : " desc";

            return sortField ? sortField + sortOrder : null;
        },

        parseValue: function (fieldName, fieldValue) {
            var field = this.__fields[this.getColumnIndexById(fieldName)],
                widgetClass = field ? qx.Class.getByName(field.widgetClass) : null;

            return (widgetClass && widgetClass.parseValue) ? widgetClass.parseValue(fieldValue) : fieldValue;
        },

        // overridden
        getValue: function (columnIndex, rowIndex) {
            var value = this.base(arguments, columnIndex, rowIndex),
                field = this.__fields[columnIndex];

            if (field.attrPath) {
                field.attrPath.split('.').forEach(function (attr) {
                    value = qx.lang.Type.isObject(value) ? value[attr] : null;
                });
            }

            return value;
        }
    },

    destruct: function () {
        delete this.__fields;
    }
});
