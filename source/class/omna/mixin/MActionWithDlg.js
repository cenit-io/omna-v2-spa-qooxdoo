qx.Mixin.define('omna.mixin.MActionWithDlg', {
    members: {
        onExecute: function () {
            this.setEnabled(false);
            q.messaging.emit('Application', 'loading-start');
            setTimeout(qx.lang.Function.bind(this._createDlg, this), 0);
        },

        onAppear: function () {
            this.setEnabled(true);
            q.messaging.emit('Application', 'loading-release');
        }
    }
});
