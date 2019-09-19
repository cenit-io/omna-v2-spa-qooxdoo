/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/dialog-apply.png)
 * @asset(qx/icon/${qx.icontheme}/16/actions/edit-undo.png)
 */
qx.Class.define("omna.form.task.Scheduler", {
    extend: omna.form.renderer.SingleWithOptionalLabel,
    include: [omna.mixin.MI18n],
    implement: [omna.mixin.II18n],

    construct: function () {
        this.base(arguments, new qx.ui.form.Form());

        this.__createFormFields();
        this.__createButtons();
    },

    members: {
        __model: null,

        __createFormFields: function () {
            var field, validator;

            field = new omna.form.field.calendar.DateField();
            field.setStrDateFormat('YYYY-MM-dd');
            this._form.add(field, this.i18nTrans('start_date'), null, 'start_date');

            field = new omna.form.field.calendar.DateField();
            field.setStrDateFormat('YYYY-MM-dd');
            this._form.add(field, this.i18nTrans('end_date'), null, 'end_date');

            field = new omna.form.field.TextField();
            field.set({ pattern: 'TIME-24H', filterIn: 'TIME-24H' });
            validator = new omna.form.validator.TextField();
            this._form.add(field, this.i18nTrans('time'), validator, 'time');

            field = new omna.form.field.calendar.DaysOfWeek();
            this._form.add(field, this.i18nTrans('days_of_week'), null, 'days_of_week');

            field = new omna.form.field.calendar.WeeksOfMonth();
            this._form.add(field, this.i18nTrans('weeks_of_month'), null, 'weeks_of_month');

            field = new omna.form.field.calendar.MonthsOfYear();
            this._form.add(field, this.i18nTrans('months_of_year'), null, 'months_of_year');

            field = new qx.ui.form.CheckBox();
            this._form.add(field, this.i18nTrans('active'), null, 'active');

            var controller = new qx.data.controller.Form(null, this._form);
            this.__model = controller.createModel();
        },

        __createButtons: function () {
            var bA = new qx.ui.form.Button(this.tr("Accept"), "icon/16/actions/dialog-apply.png"),
                bR = new qx.ui.form.Button(this.tr("Reset"), "icon/16/actions/edit-undo.png"),
                manager = this._form.getValidationManager();

            bA.setAllowStretchX(true);
            bR.setAllowStretchX(true);
            this._form.addButton(bA);
            this._form.addButton(bR);

            bA.addListener("execute", function () {
                bA.setEnabled(false);
                bA.setLabel(this.tr("Validating..."));
                manager.validate();
            }, this);

            bR.addListener("execute", this.onReset, this);

            manager.addListener("complete", function () {
                // configure the accept button
                bA.setEnabled(true);
                bA.setLabel(this.tr("Accept"));
                // check the validation status
                if (manager.getValid()) this.onAccept(this.getData());
            }, this);
        },

        getI18nCatalog: function () {
            return 'Tasks'
        },

        getData: function () {
            var data = qx.util.Serializer.toNativeObject(this.__model),
                name, items = this._form.getItems();

            // Remove disabled items.
            for (name in items) if (!items[name].isEnabled()) delete data[name];

            return data;
        },

        setData: function (data, redefineResetter) {
            qx.Class.getProperties(this.__model.constructor).forEach(function (name) {
                if (typeof data[name] != 'undefined') this.__model.set(name, data[name]);
            }, this);

            redefineResetter && this._form.redefineResetter();
            return this;
        },

        onReset: function () {
            this._form.reset()
        },

        onAccept: function (data) {
            console.log(data);
        },

        onSaved: function (response) {
            if (response.successful) {
                q.messaging.emit("Application", "good", this.tr("Operation successful"));
                q.messaging.emit("Application", "update-task-scheduler");

                this.close();
            }
        }
    },

    destruct: function () {
        var name, items = this._form.getItems();

        for (name in items) items[name].destroy();

        this._form.getButtons().forEach(function (item) {
            item.destroy();
        });
    }
});