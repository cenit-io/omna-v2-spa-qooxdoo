qx.Class.define("omna.form.dialog.Import", {
    extend: omna.dialog.Confirm,
    include: [omna.mixin.MWithManagement],

    statics: {
        show: function (management, integration, callback, scope) {
            (new omna.form.dialog.Import(management, integration, callback, scope)).show();
        }
    },

    /**
     * Constructor
     *
     * @param management {omna.management.AbstractManagement}
     * @param integration {Object}
     */
    construct: function (management, integration, callback, scope) {
        this.set({ management: management, width: 500, integration: integration });

        let question = this.i18nTrans('Messages', 'CONFIRM-IMPORT', [integration.name, integration.channel_title]);

        this.base(arguments, question, callback, scope);
    },

    properties: {
        integration: {
            check: Object
        }
    },

    members: {
        // override
        _createContent: function () {
            let integration = this.getIntegration(),
                dateFormat = new qx.util.format.DateFormat('YYYY-MM-dd HH:mm:ss'),
                date;

            this.__importType = new omna.form.field.LocalSelectBox();

            this.__importType.set({
                required: true,
                options: ['orders', 'products', 'categories', 'brands'].map(function (item) {
                    date = integration['last_import_' + item + '_date'];

                    if (date) {
                        date = new Date(date);
                    } else {
                        date = new Date();
                        date.setDate(date.getDate() - 180)
                    }

                    date = dateFormat.format(date);

                    return { label: this.i18nTrans("import_items", [item, date]), value: item }
                }, this)
            });

            this.add(this.__importType, { flex: 1 });

            this.base(arguments);
        },

        getImportType: function () {
            return this.__importType.getSelection()[0].getModel()
        }
    }
});