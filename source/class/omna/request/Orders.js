qx.Class.define("omna.request.Orders", {
  extend: omna.request.AbstractResource,

  construct: function () {
    this.base(arguments, 'orders');
  },

  members: {
    getOrderDocTypes: function (order, callBack, scope) {
      let cacheId = 'order-doc-types-' + order.integration.channel,
        cache = this.getCacheItem(cacheId);

      if (cache) {
        callBack && callBack.call(scope, cache);
      } else {
        let path = qx.bom.Template.render('/integrations/{{integration.id}}/orders/{{number}}/doc/types', order);

        // Call remote service
        this.submit("GET", path, null, function (response) {
          if (response.successful) {
            this.setCacheItem(cacheId, response);
          } else {
            let msg = omna.I18n.trans('Orders', 'Messages', 'FAILED-LOAD-DOC-TYPES');
            q.messaging.emit('Application', 'error', msg)
          }

          callBack && callBack.call(scope, response);
        }, this);
      }
    },

    getOrderDoc: function (order, documentType, callBack, scope) {
      let path = qx.bom.Template.render('/integrations/{{integration_id}}/orders/{{number}}/doc/{{type}}', {
        integration_id: order.integration.id,
        number: order.number,
        type: documentType
      });

      // Call remote service
      this.submit("GET", path, null, function (response) {
        if (!response.successful) {
          let msg = omna.I18n.trans('Orders', 'Messages', 'FAILED-LOAD-DOC', [response.message]);
          q.messaging.emit('Application', 'error', msg)
        }

        callBack && callBack.call(scope, response);
      }, this);
    },

    reImport: function (order, callBack, scope) {
      let path = qx.bom.Template.render('/integrations/{{integration.id}}/orders/{{number}}/import', order);

      // Call remote service
      this.submit("GET", path, null, function (response) {
        let msg;

        if (response.successful) {
          msg = omna.I18n.trans('Orders', 'Messages', 'SUCCESSFUL-REIMPORT');
          q.messaging.emit('Application', 'good', msg);
        } else {
          msg = omna.I18n.trans('Orders', 'Messages', 'FAILED-REIMPORT', [response.message]);
          q.messaging.emit('Application', 'error', msg)
        }

        callBack && callBack.call(scope, response);
      }, this);
    },


    export: function (order, callBack, scope) {
      let path = qx.bom.Template.render('/integrations/{{integration.id}}/orders/{{number}}', order);

      // Call remote service
      this.submit("PUT", path, null, function (response) {
        let msg;

        if (response.successful) {
          msg = omna.I18n.trans('Orders', 'Messages', 'SUCCESSFUL-EXPORT');
          q.messaging.emit('Application', 'good', msg);
        } else {
          msg = omna.I18n.trans('Orders', 'Messages', 'FAILED-EXPORT', [response.message]);
          q.messaging.emit('Application', 'error', msg)
        }

        callBack && callBack.call(scope, response);
      }, this);
    },

    reload: function (order, callBack, scope) {
      let path = qx.bom.Template.render('/integrations/{{integration.id}}/orders/{{number}}', order);

      // Call remote service
      this.submit("GET", path, null, function (response) {
        let msg;

        if (!response.successful) {
          msg = omna.I18n.trans('Orders', 'Messages', 'FAILED-RELOAD', [response.message]);
          q.messaging.emit('Application', 'error', msg)
        }

        callBack && callBack.call(scope, response);
      }, this);
    }
  }
});
