/**
 * @asset(omna/icon/16/actions/save.png)
 * @asset(omna/icon/16/actions/clear.png)
 */
qx.Class.define("omna.form.AbstractForm", {
    type: "abstract",
    extend: qx.ui.form.Form,
    include: [omna.mixin.MFormData, omna.mixin.MI18n],
    implement: [omna.mixin.II18n],

    /**
     * Constructor
     */
    construct: function () {
        this.base(arguments);

        // Create fields.
        this.__createFormFields();

        // Create buttons actions
        this.__createButtons();
    },

    events: {
        save: 'qx.event.type.Data'
    },

    properties: {},

    members: {
        __createButtons: function () {
            let bS = new qx.ui.form.Button(this.i18nTrans("save"), "omna/icon/16/actions/save.png"),
                bR = new qx.ui.form.Button(this.i18nTrans("reset"), "omna/icon/16/actions/clear.png"),
                manager = this.getValidationManager();

            bS.setAllowStretchX(true);
            bR.setAllowStretchX(true);

            this.addButton(bS);
            this.addButton(bR);

            bS.addListener("execute", function () {
                bS.setLabel(this.i18nTrans("validating"));
                manager.validate();
            }, this);

            bR.addListener("execute", function () {
                this.reset();
            }, this);

            manager.addListener("complete", function () {
                bS.setLabel(this.i18nTrans("sending"));
                if (manager.getValid()) this.fireDataEvent('save', this.getData());
                bS.setLabel(this.i18nTrans("save"));
            }, this);
        }
    },

    destruct: function () {
        if (this.isDisposed()) return;
        let name, items = this.getItems();
        for (name in items) items[name].destroy();
        this.getButtons().forEach((item) => item.destroy());
    }
});
