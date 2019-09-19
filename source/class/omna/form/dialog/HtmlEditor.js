qx.Class.define("omna.form.dialog.HtmlEditor", {
    extend: omna.form.dialog.AbstractField,

    // override
    construct: function () {
        this.base(arguments, this.i18nTrans('content'));

        // Set properties
        this.set({
            modal: true,
            showMaximize: true,
            allowMaximize: true,
            resizable: true,
            width: 600,
            height: 350
        });
    },

    members: {
        _createFormFields: function (form) {
            var content;

            this.base(arguments);

            content = new omna.form.field.TextArea;
            content.setWrap(false);

            form.add(content, null, null, 'content');
        }
    }
});