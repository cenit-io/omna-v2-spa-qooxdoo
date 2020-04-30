/**
 * @asset(qx/icon/${qx.icontheme}/16/actions/dialog-apply.png)
 * @asset(qx/icon/${qx.icontheme}/16/actions/edit-undo.png)
 */
qx.Class.define("omna.form.task.Scheduler", {
    extend: omna.form.renderer.SingleWithOptionalLabel,
    include: [omna.mixin.MI18n],
    implement: [omna.mixin.II18n],

    construct: function (editable) {
        this.base(arguments, new qx.ui.form.Form());

        this.setEnabled(editable);
        this.__createFormFields();
        this.__createButtons();

        let row, layout = this.getLayout(),
            count = layout.getRowCount();

        for (row = 0; row < count; row++) {
            layout.setRowFlex(row, row < count - 1 ? null : 1)
        }
    },

    members: {
        __model: null,
        __flowId: null,

        __createFormFields: function () {
            let field, validator;

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

            let controller = new qx.data.controller.Form(null, this._form);
            this.__model = controller.createModel();
        },

        __createButtons: function () {
            if (!this.getEnabled()) return;

            let bA = new qx.ui.form.Button(this.tr("Accept"), "icon/16/actions/dialog-apply.png"),
                bR = new qx.ui.form.Button(this.tr("Reset"), "icon/16/actions/edit-undo.png"),
                manager = this._form.getValidationManager();

            bA.setAllowStretchX(true);
            bR.setAllowStretchX(true);
            this._form.addButton(bA);
            this._form.addButton(bR);
            this._buttonRow.set({ allowGrowY: false, alignY: 'bottom' });

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
            let data = qx.util.Serializer.toNativeObject(this.__model),
                dateFormat = new qx.util.format.DateFormat('YYYY-MM-dd'),
                items = this._form.getItems(),
                name;

            // Remove disabled items.
            for (name in items) if (!items[name].isEnabled()) delete data[name];

            data.start_date = items.start_date.getDateFormat().format(data.start_date);
            data.end_date = items.end_date.getDateFormat().format(data.end_date);

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
            q.messaging.emit("Application", "accept-update-scheduler", data);
        }
    },

    destruct: function () {
        let name, items = this._form.getItems();

        for (name in items) items[name].destroy();

        this._form.getButtons().forEach(function (item) {
            item.destroy();
        });
    }
});