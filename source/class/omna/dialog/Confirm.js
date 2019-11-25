/**
 * @asset(omna/icon/32/question.png)
 * @asset(qx/icon/${qx.icontheme}/16/actions/dialog-apply.png)
 * @asset(qx/icon/${qx.icontheme}/16/actions/dialog-cancel.png)
 */
qx.Class.define('omna.dialog.Confirm', {
    extend: omna.dialog.AbstractDialog,

    statics: {
        /**
         * Shortcut for confirm dialog
         * @param message {String} The message to display
         * @param callback {Function} The callback function
         * @param context {Object} The context to use with the callback function
         */
        show: function (message, callback, scope) {
            (new omna.dialog.Confirm(message, callback, scope)).show();
        }
    },

    /**
     * Constructor
     *
     * @param properties {Map} Properties of confirm dialog.
     */
    construct: function (message, callback, scope) {
        this.setCallback(callback);
        this.setScope(scope || this);

        this.base(arguments, this.i18nTrans('Titles', 'CONFIRMATION'), 'omna/icon/32/question.png');

        this._message.setValue(message);
    },

    properties: {
        /**
         * Callback function that will be called when the user has interacted with the widget.
         */
        callback: {
            check: 'Function',
            nullable: false
        },

        /**
         * The context for the callback function.
         */
        scope: {
            check: 'Object',
            nullable: true
        }
    },

    members: {
        _createContent: function () {
            this._message = new qx.ui.basic.Label();
            this._message.setRich(true);
            this._message.setWidth(400);
            this._message.setAllowStretchX(true);

            this.add(this._message, { flex: 1 });
        },

        _createButtons: function () {
            var bP = this.base(arguments),
                bY = new qx.ui.form.Button(this.i18nTrans('yes'), 'icon/16/actions/dialog-apply.png'),
                bN = new qx.ui.form.Button(this.i18nTrans('no'), 'icon/16/actions/dialog-cancel.png');

            bY.setAllowStretchX(true);
            bN.setAllowStretchX(true);
            bP.add(bY);
            bP.add(bN);

            bY.addListener('execute', function () {
                this.getCallback().call(this.getScope(), 'yes');
                this.destroy();
            }, this);

            bN.addListener('execute', function () {
                this.getCallback().call(this.getScope(), 'no');
                this.destroy();
            }, this);

            this.addListener('appear', function () {
                bN.focus();
            }, this);
        }
    }
});
