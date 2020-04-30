/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/dialog-apply.png)
 * @asset(qx/icon/${qx.icontheme}/16/actions/dialog-cancel.png)
 */
qx.Class.define("omna.form.dialog.AbstractForm", {
    type: "abstract",
    extend: omna.dialog.AbstractDialog,
    include: [omna.mixin.MFormData],

    members: {
        _form: null,

        _createContent: function () {
            // Create form login
            this._form = new qx.ui.form.Form();

            // Create form fields
            this._createFormFields(this._form);

            // Add from renderer
            this._createRenderer();
        },

        _createRenderer: function () {
            let renderer = new omna.form.renderer.SingleWithOptionalLabel(this._form);

            this.add(renderer, { flex: 1 });
        },

        _createButtons: function () {
            this._createAcceptOrCancelButton();
        },

        _createAcceptOrCancelButton: function () {
            let bA = new qx.ui.form.Button(this.tr("Accept"), "icon/16/actions/dialog-apply.png"),
                bC = new qx.ui.form.Button(this.tr("Cancel"), "icon/16/actions/dialog-cancel.png"),
                manager = this._form.getValidationManager();

            bA.setAllowStretchX(true);
            bC.setAllowStretchX(true);
            this._form.addButton(bA);
            this._form.addButton(bC);

            bA.addListener("execute", function () {
                bA.setLabel(this.tr("Validating..."));
                manager.validate();
            }, this);

            bC.addListener("execute", function () {
                this.fireEvent('cancel', qx.event.type.Event, null);
                this.close();
            }, this);

            this.addListener("appear", function () {
                bC.focus();
            }, this);

            manager.addListener("complete", function () {
                bA.setLabel(this.tr("Sending"));
                if (manager.getValid()) this.fireDataEvent('accept', this.getData());
                bA.setLabel(this.tr("Accept"));
            }, this);
        },

        redefineResetter: function () {
            this._form.redefineResetter();
        },

        reset: function () {
            this._form.reset();
            return this;
        }
    },

    destruct: function () {
        if (!this._form.isDisposed()) {

            let name, items = this._form.getItems();

            for (name in items) items[name].destroy();

            this._form.getButtons().forEach(function (item) {
                item.destroy();
            });
        }

        this.getChildren().forEach(function (item) {
            item.destroy();
        });
    }
});
