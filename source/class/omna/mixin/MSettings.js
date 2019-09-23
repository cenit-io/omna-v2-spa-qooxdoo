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
                url = url.match(/\/source\//) ? url + '?tc=' + (new Date()).getTime() : url;
                var req = new omna.request.Xhr(url);

                req.setAsync(false);

                req.addListener('success', function (e) {
                    omna['settings'][id] = e.getTarget().getResponse();
                }, this);

                req.addListener('statusError', function (e) {
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
});
