(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  (function() {
    var Aldin, InstagramView, Photo,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Photo = (function(_super) {

      __extends(Photo, _super);

      function Photo() {
        this.render = __bind(this.render, this);
        Photo.__super__.constructor.apply(this, arguments);
      }

      Photo.prototype.template = require('templates/photo');

      Photo.prototype.className = "post";

      Photo.prototype.tagName = "li";

      Photo.prototype.render = function() {
        ($(this.el)).html(this.template(this.model.toJSON()));
        return this;
      };

      return Photo;

    })(Backbone.View);

    InstagramView = (function(_super) {

      __extends(InstagramView, _super);

      function InstagramView() {
        this.all = __bind(this.all, this);
        this.add = __bind(this.add, this);
        InstagramView.__super__.constructor.apply(this, arguments);
      }

      InstagramView.prototype.el = "#photos ul";

      InstagramView.prototype.initialize = function(options) {
        this.collection.on("reset", this.all);
        return this.collection.on("add", this.add);
      };

      InstagramView.prototype.add = function(model) {
        return ($(this.el)).append((new Photo({
          model: model
        })).render().el);
      };

      InstagramView.prototype.all = function() {
        var model, _i, _len, _ref, _results;
        ($(this.el)).html("");
        _ref = this.collection.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          _results.push(this.add(model));
        }
        return _results;
      };

      return InstagramView;

    })(Backbone.View);

    Aldin = (function() {

      function Aldin() {}

      Aldin.prototype.views = {};

      Aldin.prototype.collections = {};

      Aldin.prototype.ready = function() {
        var token, user,
          _this = this;
        this.collections.instagram = new Backbone.Collection;
        this.views.instagram = new InstagramView({
          collection: this.collections.instagram
        });
        user = '14382443';
        token = '1049644.884e778.85dd826cf0d146408e7d0e509678badb';
        return $.ajax({
          url: "https://api.instagram.com/v1/users/self/media/recent?count=12&access_token=" + token,
          dataType: "jsonp",
          success: function(data, status) {
            return _this.collections.instagram.reset(data.data);
          }
        });
      };

      Aldin.prototype.initialize = function(options) {
        var _this = this;
        return $(function() {
          return _this.ready(_this);
        });
      };

      return Aldin;

    })();

    module.exports = new Aldin;

  }).call(this);
  
}});

window.require.define({"templates/photo": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('  <a title="Photo taken by ');
      
        __out.push(__sanitize(this.user.full_name));
      
        __out.push('" \n     href="');
      
        __out.push(__sanitize(this.link));
      
        __out.push('" target="_blank">\n    <img alt="Photo taken by ');
      
        __out.push(__sanitize(this.user.full_name));
      
        __out.push('" \n         src="');
      
        __out.push(__sanitize(this.images.low_resolution.url));
      
        __out.push('">\n  </a>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

