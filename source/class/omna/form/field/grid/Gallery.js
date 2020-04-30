/**
 * @childControl dlg {omna.form.dialog.GridGallery} Form dialog.
 */
qx.Class.define("omna.form.field.grid.Gallery", {
    extend: qx.ui.form.Button,
    implement: [
        qx.ui.form.IStringForm,
        qx.ui.form.IForm
    ],
    include: [
        qx.ui.form.MForm,
        omna.form.field.util.MSetProperties,
        omna.form.field.util.MReadOnly
    ],

    statics: {
        cellRendererClass: omna.table.cellrenderer.GridGallery
    },

    // override
    construct: function () {
        this.base(arguments, omna.I18n.trans('styles'));
        this.addListener('execute', this._onOpenDlg, this);
    },

    events: {
        /** Fired when the value was modified */
        "changeValue": "qx.event.type.Data"
    },

    properties: {
        value: {
            check: 'Array',
            init: null,
            event: 'changeValue',
            transform: '_transformValue'
        }
    },

    members: {
        _transformValue: function (value) {
            return qx.lang.Type.isString(value) ? qx.lang.Json.parse(value) : value;
        },

        _onOpenDlg: function (e) {
            if (!this.isReadOnly()) {
                let dlg = new omna.form.dialog.GridGallery();
                
                dlg.setData(this.getValue());
                dlg.addListener('accept', function (e) {
                    this.setValue(e.getData());
                    dlg.close();
                }, this);

                dlg.open();
            }
        }
    }
});