qx.Mixin.define('omna.mixin.MSettings', {
    include: [qx.locale.MTranslation],
    members: {
        loadSettings: function (pUrlOrClass, pCallback) {
            var url, id, path;

            pUrlOrClass = pUrlOrClass || this.constructor;

            if (qx.lang.Type.isString(pUrlOrClass)) {
                if (!pUrlOrClass.match(/\//)) {
                    path = this.constructor.classname.replace(/\.[^\.]+$/, '').replace(/\./g, '/');
                    pUrlOrClass = path + '/settings/' + pUrlOrClass;
                }
            } else {
                path = pUrlOrClass.classname.replace(/\.[^\.]+$/, '').replace(/\./g, '/');
                pUrlOrClass = path + '/settings/' + pUrlOrClass.classname;
            }

            if (!pUrlOrClass.match(/\.json$/)) pUrlOrClass += '.json';

            url = qx.util.ResourceManager.getInstance().toUri(pUrlOrClass);

            omna['settings'] = omna['settings'] || {};
            id = qx.util.Base64.encode(url);

            if (!omna['settings'][id]) {
                var req = new qx.io.request.Xhr(url);

                req.setAsync(false);

                req.addListenerOnce('success', function (e) {
                    omna['settings'][id] = e.getTarget().getResponse();
                }, this);

                req.addListenerOnce('statusError', function (e) {
                    // Send message to logs
                    q.messaging.emit("Application", "error", this.tr("Failed load setting from: '%1'.", url));
                }, this);

                req.send();
            }

            if (omna['settings'][id]) {
                if (typeof pCallback === 'function') {
                    pCallback.call(this, omna['settings'][id] || {})
                } else {
                    this.set(omna['settings'][id] || {});
                }
            }
        }
    }
})
;
