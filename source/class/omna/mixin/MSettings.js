qx.Mixin.define('omna.mixin.MSettings', {
    include: [qx.locale.MTranslation],
    members: {
        __loadResource: function (pathOrClass, container, extension, callback) {
            let url, id, cache, path, isDev;

            pathOrClass = pathOrClass || this.constructor;

            if (qx.lang.Type.isString(pathOrClass)) {
                path = pathOrClass;
                if (!path.match(/\//)) {
                    path = this.constructor.classname.replace(/\.[^\.]+$/, '').replace(/\./g, '/');
                    path = path + '/' + container + '/' + pathOrClass;
                }
            } else {
                path = pathOrClass.classname.replace(/\.[^\.]+$/, '').replace(/\./g, '/');
                path = path + '/' + container + '/' + pathOrClass.classname;
            }

            if (!path.match(new RegExp('\\' + extension + '$'))) path += extension;

            url = qx.util.ResourceManager.getInstance().toUri(path);
            id = qx.util.Base64.encode(url);
            isDev = this.isDevelopment();

            cache = omna['__cache'] = omna['__cache'] || {};
            cache[container] = cache[container] || {};

            if (isDev || !cache[container][id]) {
                url = isDev ? url + '?tc=' + (new Date()).getTime() : url;

                let req = new omna.request.Xhr(url);

                req.setAsync(false);

                req.addListener('success', function (e) {
                    cache[container][id] = e.getTarget().getResponse();
                }, this);

                req.addListener('statusError', function (e) {
                    q.messaging.emit("Application", "error", this.tr("Failed load setting from: '%1'.", url));
                }, this);

                req.send();
            }

            if (cache[container][id]) {
                if (typeof callback === 'function') {
                    callback.call(this, cache[container][id] || {})
                } else {
                    this.set(cache[container][id] || {});
                }
            }
        },

        loadSettings: function (pathOrClass, callback) {
            this.__loadResource(pathOrClass, 'settings', '.json', callback)
        },

        loadTemplate: function (pathOrClass, callback) {
            this.__loadResource(pathOrClass, 'templates', '.hbs', callback)
        },

        isDevelopment: function () {
            return window.location.href.match(/https?:\/\/(omna-v2-dev|localhost|127.0.0.1)/)
        }
    }
});
