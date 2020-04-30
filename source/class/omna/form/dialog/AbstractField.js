qx.Class.define("omna.form.dialog.AbstractField", {
    type: 'abstract',
    extend: omna.form.dialog.AbstractForm,

    // override
    construct: function (caption, icon) {
        this.base(arguments, caption, icon);
        this.addListener("close", this.destroy);
    },

    members: {
        _createFormFields: function (form) {

        },

        _createAcceptOrCancelButton: function () {
            let bA = new qx.ui.form.Button(this.tr("Accept"), "icon/16/actions/dialog-apply.png"),
                bC = new qx.ui.form.Button(this.tr("Cancel"), "icon/16/actions/dialog-cancel.png");

            bA.setAllowStretchX(true);
            bC.setAllowStretchX(true);
            this._form.addButton(bA);
            this._form.addButton(bC);

            bA.addListener("execute", function () {
                if (this._form.validate()) {
                    this.fireDataEvent('accept', this.getData());
                    this.close();
                }
            }, this);

            bC.addListener("execute", function () {
                this.fireEvent('cancel', qx.event.type.Event);
                this.close();
            }, this);
        }
    }
});