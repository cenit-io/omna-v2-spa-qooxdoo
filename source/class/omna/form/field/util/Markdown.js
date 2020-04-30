/**
 * @childControl dlg {omna.form.dialog.MarkdownEditor} Form dialog.
 */
qx.Class.define("omna.form.field.util.Markdown", {
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
        cellRendererClass: omna.table.cellrenderer.String
    },

    // override
    construct: function () {
        this.base(arguments, '...');
        this.addListener('execute', this._onOpenDlg, this);
    },

    events: {
        /** Fired when the value was modified */
        "changeValue": "qx.event.type.Data"
    },

    properties: {
        value: {
            check: 'String',
            init: '',
            event: 'changeValue'
        }
    },

    members: {
        _onOpenDlg: function (e) {
            if (!this.isReadOnly()) {
                let dlg = new omna.form.dialog.MarkdownEditor();

                dlg.setData({ content: this.getValue() });
                dlg.addListener('accept', function (e) {
                    this.setValue(e.getData().content);
                    dlg.close();
                }, this);

                dlg.open();
            }
        }
    }
});