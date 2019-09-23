/**
 * @ignore(Map)
 */
qx.Class.define("omna.model.DataGridRestService", {
    extend: qx.ui.table.model.Remote,
    include: [qx.locale.MTranslation],

    construct: function (fields, settings, filters) {
        this.base(arguments);
        this.set({
            blockSize: settings.blockSize || 20,
            maxCachedBlockCount: settings.maxCachedBlockCount || 5,
            requestManagementClass: settings.requestManagementClass,
            serviceBasePath: settings.serviceBasePath,
            filters: filters
        });

        this.__widgetsClass = new Map();

        var i18nCatalog = settings.i18n,
            columnNames = [],
            columnIDs = [];

        fields.forEach(function (field) {
            if (field.showInGrid) {
                columnNames.push(omna.I18n.trans(i18nCatalog, 'Labels', field.label || field.name));
                columnIDs.push(field.name);
                this.__widgetsClass.set(field.name, field.widgetClass);
            }
        }, this);

        this.setColumns(columnNames, columnIDs);
        this.addListener('changeFilter', this.reloadData, this);
    },

    properties: {
        filters: {
            check: 'Object',
            init: {},
            event: 'changeFilter'
        },

        requestManagementClass: {
            nullable: true
        },

        serviceBasePath: {
            nullable: true
        }
    },

    members: {
        getRequestManagement: function () {
            var RequestManagementClass = this.getRequestManagementClass();

            if (RequestManagementClass) {
                RequestManagementClass = qx.Class.getByName(RequestManagementClass);
                return new RequestManagementClass()
            }

            return new omna.request.Customs(this.getServiceBasePath())
        },

        _loadRowCount: function () {
            var requestManagement = this.getRequestManagement();

            requestManagement.count(this.getFilters(), function (response) {
                if (response.successful) this._onRowCountLoaded(response.pagination.total);
                requestManagement.dispose()
            }, this);

            this._onRowCountLoaded(0);
        },

        _loadRowData: function (pFrom, pTo) {
            var requestManagement = this.getRequestManagement();

            requestManagement.findRange(pFrom, pTo, this.getOrder(), this.getFilters(), function (response) {
                if (response.successful) {
                    response.data.forEach(function (record, index) {
                        Object.keys(record).forEach(function (field) {
                            record[field] = this.parseValue(field, record[field]);
                        }, this);
                    }, this);

                    this._onRowDataLoaded(response.data);
                }
                requestManagement.dispose()
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
            var widgetClass = qx.Class.getByName(this.__widgetsClass.get(fieldName));

            return (widgetClass && widgetClass.parseValue) ? widgetClass.parseValue(fieldValue) : fieldValue;
        }
    }
});
