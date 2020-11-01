qx.Class.define("omna.request.Webhooks", {
  extend: omna.request.AbstractResource,

  construct: function () {
    this.base(arguments, 'webhooks');
  },

  members: {
    getTopics: function (callBack, scope) {
      let cacheId = 'webhook-topics',
        cache = this.getCacheItem(cacheId);

      if (cache) {
        callBack.call(scope, cache);
      } else {
        // Call remote service
        this.submit("GET", 'topics', null, function (response) {
          if (response.successful) {
            this.setCacheItem(cacheId, response);
          } else {
            let msg = omna.I18n.trans('Webhooks', 'Messages', 'FAILED-LOADING-WEBHOOK-TOPICS');
            q.messaging.emit('Application', 'error', msg)
          }
          callBack.call(scope, response);
        }, this);
      }
    }
  }
});
