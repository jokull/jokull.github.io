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
          url: "https://api.instagram.com/v1/users/self/media/recent?count=10&access_token=" + token,
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

window.require.define({"slideshow": function(exports, require, module) {
  (function() {
    var ShortcutView, ShortcutsView,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    ShortcutView = (function(_super) {

      __extends(ShortcutView, _super);

      function ShortcutView() {
        this.click = __bind(this.click, this);
        ShortcutView.__super__.constructor.apply(this, arguments);
      }

      ShortcutView.prototype.events = {
        click: "click"
      };

      ShortcutView.prototype.initialize = function(options) {};

      ShortcutView.prototype.click = function(event) {
        event.preventDefault();
        return this.model.select();
      };

      return ShortcutView;

    })(Backbone.View);

    ShortcutsView = (function(_super) {

      __extends(ShortcutsView, _super);

      function ShortcutsView() {
        this.select = __bind(this.select, this);
        this.reset = __bind(this.reset, this);
        this.add = __bind(this.add, this);
        ShortcutsView.__super__.constructor.apply(this, arguments);
      }

      ShortcutsView.prototype.initialize = function(options) {
        this.collection.bind("select", this.select);
        return this.reset();
      };

      ShortcutsView.prototype.add = function(model) {
        var view;
        view = new ShortcutView({
          el: this.el,
          model: model
        });
        ($(this.el)).append(view.el);
        return ($(view.el)).attr("href", "#");
      };

      ShortcutsView.prototype.reset = function() {
        ($(this.el)).html("");
        return this.collection.each(this.add);
      };

      ShortcutsView.prototype.select = function(slide) {
        ($("a", this.el)).removeClass("selected");
        return ($("a.index-" + slide.get("index"), this.el)).addClass("selected");
      };

      return ShortcutsView;

    })(Backbone.View);

    exports.SlideView = (function(_super) {

      __extends(SlideView, _super);

      function SlideView() {
        this.left = __bind(this.left, this);
        SlideView.__super__.constructor.apply(this, arguments);
      }

      SlideView.prototype.tagName = "a";

      SlideView.prototype.initialize = function(options) {
        return ($(this.el)).css("left", this.left());
      };

      SlideView.prototype.left = function() {
        return ($(this.el)).width() * (this.model.get("index"));
      };

      return SlideView;

    })(Backbone.View);

    exports.SlidesView = (function(_super) {

      __extends(SlidesView, _super);

      function SlidesView() {
        this.select = __bind(this.select, this);
        this.previous = __bind(this.previous, this);
        this.next = __bind(this.next, this);
        this.addDOMSlides = __bind(this.addDOMSlides, this);
        this.setHeight = __bind(this.setHeight, this);
        SlidesView.__super__.constructor.apply(this, arguments);
      }

      SlidesView.prototype.heightSelector = ".carousel, .carousel nav a, .carousel li";

      SlidesView.prototype.widthSelector = ".carousel li";

      SlidesView.prototype.events = {
        "click .next": "next",
        "click .previous": "previous"
      };

      SlidesView.prototype.initialize = function(options) {
        this.setHeight();
        return this.shortcuts = new ShortcutsView({
          collection: this.collection,
          el: ($("nav.slides", this.el)).get(0)
        });
      };

      SlidesView.prototype.setHeight = function() {
        var height, width;
        width = ($(this.el)).css("width");
        height = ($("li", this.el)).first().css("height");
        ($(this.heightSelector, this.el)).css("height", height);
        ($(this.widthSelector, this.el)).css("width", width);
        ($(this.el)).addClass("ready");
        return this.collection.bind("select", this.select);
      };

      SlidesView.prototype.addDOMSlides = function() {
        var _this = this;
        return ($("ol.slides li", this.el)).each(function(i, el) {
          var index, model;
          index = ($(el)).data("index" || i);
          model = new exports.Slide({
            index: index
          });
          model.view = new exports.SlideView({
            el: el,
            model: model
          });
          return _this.collection.add(model);
        });
      };

      SlidesView.prototype.next = function(e) {
        e.preventDefault();
        return this.collection.selected.next().select();
      };

      SlidesView.prototype.previous = function(e) {
        e.preventDefault();
        return this.collection.selected.previous().select();
      };

      SlidesView.prototype.select = function(slide) {
        var index;
        index = slide.get("index");
        ($("nav a", this.el)).removeClass("disabled");
        if (this.collection.last() === slide) {
          ($("nav a.next", this.el)).addClass("disabled");
        }
        if (this.collection.first() === slide) {
          ($("nav a.previous", this.el)).addClass("disabled");
        }
        return ($("ol.slides", this.el)).css("margin-left", slide.view.left() * -1);
      };

      return SlidesView;

    })(Backbone.View);

    exports.Slide = (function(_super) {

      __extends(Slide, _super);

      function Slide() {
        this.previous = __bind(this.previous, this);
        this.next = __bind(this.next, this);
        this.shift = __bind(this.shift, this);
        this.select = __bind(this.select, this);
        Slide.__super__.constructor.apply(this, arguments);
      }

      Slide.prototype.select = function() {
        return this.collection.select(this);
      };

      Slide.prototype.shift = function(direction) {
        var index, slide,
          _this = this;
        index = Number(this.get("index")) + direction;
        slide = this.collection.find(function(slide) {
          return (slide.get("index")) === String(index);
        });
        return slide;
      };

      Slide.prototype.next = function() {
        return this.shift(1);
      };

      Slide.prototype.previous = function() {
        return this.shift(-1);
      };

      return Slide;

    })(Backbone.Model);

    exports.Slides = (function(_super) {

      __extends(Slides, _super);

      function Slides() {
        this.select = __bind(this.select, this);
        Slides.__super__.constructor.apply(this, arguments);
      }

      Slides.prototype.model = exports.Slide;

      Slides.prototype.select = function(slide) {
        this.selected = slide;
        return this.trigger("select", this.selected);
      };

      return Slides;

    })(Backbone.Collection);

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

window.require.define({"views": function(exports, require, module) {
  (function() {



  }).call(this);
  
}});

