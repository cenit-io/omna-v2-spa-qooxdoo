qx.Mixin.define('omna.mixin.MActionWithDlg', {
    members: {
        __dlg: null,

        __openDlg: function () {
            if (!this.__dlg) {
                this.__dlg = this._createDlg();

                this.__dlg.addListener('appear', this.onAppear, this);
                this.__dlg.addListener('accept', this.onAccept, this);
                this.__dlg.addListener('close', this.onClose, this);
            }

            this.getSelectedItem ? this.__dlg.setData(this.getSelectedItem()) : this.__dlg.reset();

            this.__dlg.open();
        },

        onExecute: function () {
            this.setEnabled(false);
            q.messaging.emit('Application', 'loading-start');
            setTimeout(qx.lang.Function.bind(this.__openDlg, this), 0);
        },

        onAppear: function () {
            this.setEnabled(true);
            q.messaging.emit('Application', 'loading-release');
        },

        onClose: function () {
            this.setEnabled(true);
        }
    },

    destruct: function () {
        this.__dlg && this.__dlg.destroy();
    }
});
