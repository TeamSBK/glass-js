(function () {

  // No-operation function
  var noop = function () {};

  // Glass core module
  var Glass = Glass = function () {
    this.init();
  };

  // Configuration settings
  Glass.prototype.config = {};

  // CSRF token
  Glass.prototype.token = null;

  // Base URL
  Glass.prototype.baseURL = null;

  // Model names
  Glass.prototype.models = [];

  // Initialization
  Glass.prototype.init = function () {
    if (window === undefined) throw new Error('Glass.js initialization must be done inside a browser');

    // Get the CSRF token that will be used for all requests
    this.token = this.getCsrfToken();

    this.getConfig((function (config) {
      if (config === undefined) throw new Error('Failed to get configuration data from the server.');

      this.config = config;

      var i = config.models.length;
      while (i--) {
        m = config.models[i];
        Glass.prototype[m] = new this.Model(m, config.routes[m.toLowerCase()]);
      }
    }).bind(this));
  };

  // Gets the CSRF token from the DOM
  Glass.prototype.getCsrfToken = function () {
    var token = document.querySelector('meta[name="csrf-token"]');
    if (!token) throw new Error('Could not find csrf-token in the DOM.');

    return token;
  };

  // Fires an XHR to get the config data from the server
  Glass.prototype.getConfig = function (callback) {
    // Get the config from the server
    this.get('/api/glass/config.json', function (res, error) {
      if (!error) {
        var config = JSON.parse(res.response);
        callback(config, error);
      }
      else {
        callback(null, error);
      }
    }, false);
  };

  Glass.prototype.get = function (url, callback, async) {
    this.doXHR('GET', url, callback, async);
  };

  Glass.prototype.post = function (url, callback, async) {
    this.doXHR('POST', url, callback, async);
  }

  Glass.prototype.put = function (url, callback, async) {
    this.doXHR('PUT', url, callback, async);
  }

  Glass.prototype.delete = function (url, callback, async) {
    this.doXHR('DELETE', url, callback, async);
  }

  Glass.prototype.doXHR = function (type, url, callback, async) {
    if (arguments.length < 3) throw new Error('Glass#doXHR is missing ' + (3 - arguments.length) + ' parameters.');
    if (async === undefined) async = true;

    var xhr = new XMLHttpRequest();
    xhr.open(type, url, async);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = (function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 || xhr.status === 0) callback(xhr, null);
        else callback(null, 'Could not complete XMLHttpRequest to ' + url);
      }
    }).bind(this);

    xhr.send();
  }


  // Glass.Model module
  var Model = Glass.prototype.Model = function (name, routes) {
    this.init(name, routes);

    // Let's add the XHR functions to our model as well
    this.get = Glass.prototype.get;
    this.post = Glass.prototype.post;
    this.put = Glass.prototype.put;
    this.delete = Glass.prototype.delete;
    this.doXHR = Glass.prototype.doXHR;
  };

  Model.prototype.routes = null;

  Model.prototype.name = null;

  // Returns the total rows
  Model.prototype.count = function () {};

  // Model initialization
  Model.prototype.init = function (name, routes) {
    if (arguments.length < 2) throw new Error('Model#init() is missing ' + (2 - arguments.length) + ' parameters.');

    // Build the model's routes
    this.routes = routes;

    // Set this model's name
    this.name = name;
  };

  Model.prototype.findAll = function(callback) {
    this.find({}, callback); // Just call Model#find() with a blank options
  };

  Model.prototype.find = function(options, callback) {
    options || (options = {}); // providing no options means find all

    var queryParams = this.serialize(options),
        path = '/api' + this.routes['index'].path,
        url = (queryParams.length > 0) ? path + '?' + queryParams : path;

    this.get(url, function (res, error) {
      if (!error) {
        var result = JSON.parse(res.response);
        if (callback) callback(result, null);
      }
      else {
        if (callback) callback(null, error);
      }
    });
  };

  Model.prototype.create = function(options, callback) {
    if (typeof options == 'function' || options === undefined) throw new Error("Model#create() is missing 'options' parameter.");

    var queryParams = this.serialize(options),
        path = '/api' + this.routes['create'].path,
        url = (queryParams.length > 0) ? path + '?' + queryParams : path;

    this.post(url, function (res, error) {
      if (!error) {
        var result = JSON.parse(res.response);
        if (callback) callback(result, null);
      }
      else {
        if (callback) callback(null, error);
      }
    });
  };

  Model.prototype.update = function(options, callback) {
    if (callback) callback(model, error);
  };

  Model.prototype.delete = function(options, callback) {
    if (callback) callback(error);
  };

  Model.prototype.serialize = function (obj) {
    var values = [],
        prefix = '';
    return this.recursiveSerialize(obj, values, prefix).join('&');
  };

  Model.prototype.recursiveSerialize = function(obj, values, prefix) {
    for (var key in obj) {
      if (typeof obj[key] == 'object') {
        if (prefix.length == 0) prefix += '[' + key + ']';
        else prefix += key;

        values = this.recursiveSerialize(obj[key], values, prefix);

        var prefixes = values.split('[');

        if (prefixes.length > 1) prefix = prefixes.slice(0, prefixes.length - 1).join('[');
        else prefix = prefixes[0];
      }
      else {
        value = encodeURIComponent(obj[key]);
        if (prefix.length > 0) var prefixedKey = prefix + '[' + key + ']';
        else prefixedKey = key;

        prefixedKey = encodeURIComponent(prefixedKey);

        if (value) values.push(prefixedKey + '=' + value);
      }
    }

    return values;
  };


  // Add Glass.js to window as the app name
  window.addEventListener('load', function () {
    var g = new Glass();
    window[(g.config.app_name).toLowerCase()] = g;
  }, false);

}());
