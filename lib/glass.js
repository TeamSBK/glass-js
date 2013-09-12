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

    // Get the application's base URL
    this.baseURL = window.location.origin;

    // Get the CSRF token that will be used for all requests
    this.token = this.getCsrfToken();

    this.getConfig((function (config) {
      if (config === undefined) throw new Error('Failed to get configuration data from the server.');

      this.config = config;

      // Set the app name (we'll use this as the namespace)
      var appName = 'glass'; // => should be config.appName;
      this.config.appName = appName.toLowerCase();

      var i = config.models.length;
      while (i--) {
        Glass.prototype[config.models[i]] = new this.Model(config.models[i]);
      }
    }).bind(this));
  };

  // Gets the CSRF token from the DOM
  Glass.prototype.getCsrfToken = function () {
    var token = document.querySelector('meta[name="csrf-token"]');
    if (!token) throw new Error('No CSRF token found.');

    return token;
  };

  // Fires an XHR to get the config data from the server
  Glass.prototype.getConfig = function (callback) {
    // Get the config from the server
    //this.get(this.baseURL + '/glass_config_path', function (res, error) {
      //if (!error) {
        //var config = JSON.parse(res.body);
        //callback(config, error);
      //}
      //else {
        //callback(null, error);
      //}
    //});

    var config = {
      appName: 'glass',
      models: ['User', 'Course', 'Level', 'Description']
    };

    callback(config);
  };

  Glass.prototype.get = function (url, callback) {
    if (url === undefined) throw new Error('No URL specified');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = (function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 || xhr.status === 0) callback(xhr, null);
        else callback(null, 'Could not complete XMLHttpRequest to ' + url);
      }
    }).bind(this);

    xhr.send();
  };


  // Glass.Model module
  var Model = Glass.prototype.Model = function (name) {
    this.init(name);
  };

  Model.prototype.url = {
    get: '',
    post: '',
    put: '',
    delete: ''
  };

  Model.prototype.name = null;

  // Returns the total rows
  Model.prototype.count = function () {};

  // Model initialization
  //
  // All the models defined in the app will be exposed in the Glass namespace as
  // Glass.[ModelName] (e.g. Glass.Users) and will be subclassing this object.
  Model.prototype.init = function (name) {
    if (name === undefined) throw new Error('Models should have names.');

    this.name = name;
  };

  Model.prototype.findAll = function(callback) {

  };

  Model.prototype.find = function(options, callback) {
    options || (options = {}); // providing no options means find all

    if (callback) callback(model, error);
  };

  Model.prototype.add = function(options, callback) {
    console.log('add()');
  };

  Model.prototype.update = function(options, callback) {
    console.log('update()');
    if (callback) callback(model, error);
  };

  Model.prototype.delete = function(options, callback) {
    console.log('delete()');
    if (callback) callback(error);
  };


  // Add Glass.js to window as the app name
  var g = new Glass();
  window[g.config.appName] = g;

}());
