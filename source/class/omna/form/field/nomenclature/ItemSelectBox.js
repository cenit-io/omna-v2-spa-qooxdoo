qx.Class.define("omna.form.field.nomenclature.ItemSelectBox", {
    extend: omna.form.field.util.AbstractSelectBox,

    statics: {
        cellRendererClass: omna.table.cellrenderer.NomenclatureItem
    },

    properties: {
        nomenclatureId: {
            check: 'Integer',
            nullable: true,
            apply: '_applyNomenclatureId'
        },

        parentNomenclatureComponentId: {
            check: 'Integer',
            nullable: true,
            apply: '_applyParentNomenclatureComponentId'
        },

        filters: {
            check: 'Object'
        }
    },

    construct: function () {
        this.base(arguments);
        this.setFilters({});
        this._request = new omna.request.NomenclatureItems(true);
        this.addListener('changeSelection', this._onChangeSelection, this);
    },

    members: {
        _request: null,
        _parentChangeSelectionId: null,

        _applyNomenclatureId: function (value) {
            var filters = this.getFilters();

            filters.nomenclatureId = value;
        },

        _applyParentNomenclatureComponentId: function (value) {
            if (value) {
                var channel = 'Nomenclature' + value;

                this.getFilters().parentId = -1;

                this._parentChangeSelectionId && q.messaging.remove(this._parentChangeSelectionId);
                this._parentChangeSelectionId = q.messaging.on(channel, 'change-selection', function (data) {
                    this.getFilters().parentId = data.params.parentId;
                    this.initialize();
                }, this);
            }
        },

        /**
         * Fired when change selection value.
         *
         * @param e {qx.event.type.Data}
         */
        _onChangeSelection: function (e) {
            var channel = 'Nomenclature' + this.getSettings().id,
                item = e.getData()[0],
                model, value;

            if (item) {
                model = item.getModel();
                value = qx.lang.Type.isObject(model) ? model.getId() : model;
                q.messaging.emit(channel, 'change-selection', { parentId: value });
            }
        },

        initialize: function () {
            this.removeAll();

            if (!this.isRequired()) {
                this.addAt(this._blanckItem, 0);
            }

            this._request.findAll('label', this.getFilters(), function (response) {
                if (response.successful) {
                    var jsonModel = qx.data.marshal.Json.createModel(response.data),
                        controller = new qx.data.controller.List(jsonModel, this, "label");
                } else {
                    var msg = this.i18nTrans('Messages', 'FAILED-LOAD');
                    q.messaging.emit('Application', 'error', msg);
                }
            }, this);
        }
    },

    destruct: function () {
        this._parentChangeSelectionId && q.messaging.remove(this._parentChangeSelectionId);
    }
});