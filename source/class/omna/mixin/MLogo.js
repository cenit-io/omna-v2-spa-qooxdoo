qx.Mixin.define('omna.mixin.MLogo', {
  members: {
    decamelize: function (str, separator) {
      separator = typeof separator === 'undefined' ? '_' : separator;

      return str
        .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        .toLowerCase();
    },

    integrationLogo: function (value) {
      if (!value) return null;
      if (value.match(/^(http|data:image)/)) return value;

      value = this.decamelize(value.replace(/^Ov2|omna_v2_|[A-Z]{2}$/g, ''));

      return 'omna/icon/24/logos/' + value + '.png'
    }
  }
});
