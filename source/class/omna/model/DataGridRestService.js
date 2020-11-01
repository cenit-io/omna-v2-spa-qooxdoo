/**
 * @ignore(Map)
 */
qx.Class.define("omna.model.DataGridRestService", {
  extend: qx.ui.table.model.Remote,
  include: [qx.locale.MTranslation],

  construct: function (fields, settings, requestManagement) {
    this.base(arguments);
    this.set({
      blockSize: settings.blockSize || 20,
      maxCachedBlockCount: settings.maxCachedBlockCount || 5,
      requestManagement: requestManagement,
      serviceBasePath: settings.serviceBasePath || null
    });

    this.__fields = [];

    let i18nCatalog = settings.i18n,
      columnNames = [],
      columnIDs = [],
      sortables = [];

    fields.forEach(function (field) {
      if (field.showInGrid) {
        columnNames.push(omna.I18n.trans(i18nCatalog, 'Labels', field.label || field.name));
        columnIDs.push(field.name);
        sortables.push(field.sortable !== false);
        this.__fields.push(field);
      }
    }, this);

    sortables.forEach(function (sortable, columnIndex) {
      this.setColumnSortable(columnIndex, sortable)
    }, this);

    this.setColumns(columnNames, columnIDs);
  },

  properties: {
    requestManagement: {
      check: 'omna.request.AbstractResource'
    },

    serviceBasePath: {
      nullable: true
    }
  },

  members: {
    _loadRowCount: function () {
      let request = this.getRequestManagement();

      request.count({}, function (response) {
        if (!this.isDisposed()) {
          this._onRowCountLoaded(response.successful ? response.pagination.total : 0);
        }
      }, this);

      this._onRowCountLoaded(0);
    },

    _loadRowData: function (pFrom, pTo) {
      let request = this.getRequestManagement();

      request.findRange(pFrom, pTo, this.getSort(), {}, function (response) {
        if (!this.isDisposed()) {
          if (response.successful) {
            response.data.forEach(function (record, index) {
              Object.keys(record).forEach(function (field) {
                record[field] = this.parseValue(field, record[field]);
              }, this);
            }, this);

            this._onRowDataLoaded(response.data);
          } else {
            this._onRowCountLoaded(0);
            this._onRowDataLoaded([]);
          }
        }
      }, this);
    },

    reloadData: function () {
      this.clearCache();
      this.base(arguments)
    },

    getSort: function () {
      let field = this.__fields[this.getSortColumnIndex()];

      if (!field) return null;

      let sortField = field.sortByField || field.customModelName || field.name,
        sort = {};

      sort[sortField] = this.isSortAscending() ? "asc" : "desc";

      return sort
    },

    parseValue: function (fieldName, fieldValue) {
      let field = this.__fields[this.getColumnIndexById(fieldName)],
        widgetClass = field ? qx.Class.getByName(field.widgetClass) : null;

      return (widgetClass && widgetClass.parseValue) ? widgetClass.parseValue(fieldValue) : fieldValue;
    },

    // overridden
    getValue: function (columnIndex, rowIndex) {
      let rowData = this.getRowData(rowIndex);

      if (rowData == null) return null;

      let columnId = this.getColumnId(columnIndex),
        value = rowData;

      columnId.split('.').forEach(function (attr) {
        value = qx.lang.Type.isObject(value) ? value[attr] : null;
      });

      return value;
    }
  },

  destruct: function () {
    delete this.__fields;
  }
});
