// Generated by CoffeeScript 1.6.3
var MongooseEndlessScroll;

MongooseEndlessScroll = (function() {
  var DEFAULTS, DIRECTION_DOWN, DIRECTION_UP;

  DIRECTION_UP = "after";

  DIRECTION_DOWN = "before";

  DEFAULTS = {
    itemsToKeep: null,
    inflowPixels: 110,
    intervalFrequency: 250,
    autoStart: true,
    htmlLoading: "Loading...",
    htmlEnableScrollUp: "&uarr; More",
    htmlEnableScrollDown: "&darr; More",
    htmlDisableScrollUp: "~ No More ~",
    htmlDisableScrollDown: "~ No More ~",
    itemElementName: "a",
    paginationKey: "_id",
    formatItem: function(item) {
      return "<a href=\"/tickets/" + item._id + "\" class=\"list-group-item\" id=\"" + item._id + "\">\n  <div class=\"row\"><div class=\"col-md-1\">\n    <span class=\"label label-success\">" + item.status + "</span>\n  </div>\n  <div class=\"col-md-2\"><small><code>" + item._id + "</code></small></div>\n  <div class=\"col-md-5\">" + item.title + "</div>\n  <div class=\"col-md-1\">" + item.priority + "</div>\n  <div class=\"col-md-1 text-right\"><small title=\"2014-03-07T09:11:34.813Z\" class=\"muted timeago\">" + item.created_at + "</small></div>\n  <div class=\"col-md-1 text-right\"><small title=\"2014-03-07T09:11:52.074Z\" class=\"muted timeago\">" + item.updated_at + "</small></div>\n  <div class=\"col-md-1\">" + item.attempts + "</div></div></a>";
    }
  };

  function MongooseEndlessScroll(scope, options) {
    var scrollListener,
      _this = this;
    this.options = $.extend({}, DEFAULTS, options);
    this.container = $(options.container);
    this.elControlUp = $(this.options.elControlUp);
    this.elControlUp.click(function() {
      return _this.fetchUp();
    });
    this.elControlDown = this.options.elControlDown;
    this.elControlDown.click(function() {
      return _this.fetchDown();
    });
    this.topmostId = null;
    this.bottonmostId = null;
    this.query = {};
    this.idToData = {};
    this.ids = [];
    this.showLoading(false);
    scrollListener = function() {
      return $(window).one("scroll", function() {
        var bottomBoundary;
        var win = $(window);

        bottomBoundary = $(document).height() - $(window).height() - _this.options.inflowPixels / 2;
        
        if ($(window).scrollTop() >= bottomBoundary) {
          _this.fetchDown();
          //$(window).scrollTop(bottomBoundary - 20);
        }
        return setTimeout(scrollListener, _this.options.intervalFrequency);
      });
    };
    $(document).ready(function() {
      scrollListener();
      if (_this.options.autoStart) {
        return _this.fetchDown();
      }
    });
    return;
  }

  MongooseEndlessScroll.prototype.toString = function() {
    return "[MongooseEndlessScroll]";
  };

  MongooseEndlessScroll.prototype.empty = function() {
    this.container.empty();
    this.topmostId = null;
    this.bottonmostId = null;
    this.idToData = {};
    this.ids = [];
    this.showLoading(false);
  };

  MongooseEndlessScroll.prototype.fetchDown = function() {
    var data, id, record;
    data = $.extend({}, this.query);
    id = this.ids[this.ids.length - 1];
    record = this.idToData[id];
    if (record != null) {
      data[DIRECTION_DOWN] = record[this.options.paginationKey];
    }

    this.fetch(data);
  };

  MongooseEndlessScroll.prototype.fetchUp = function() {
    var data, id, record;
    data = $.extend({}, this.query);
    id = this.ids[0];
    record = this.idToData[id];
    if (record != null) {
      data[DIRECTION_UP] = record[this.options.paginationKey];
    }
    this.fetch(data);
  };

  MongooseEndlessScroll.prototype.showLoading = function(val) {
    this.isFecthing = Boolean(val);
    if (this.isFecthing) {
      this.elControlDown.html(this.options.htmlLoading);
      return this.elControlUp.html(this.options.htmlLoading);
    } else {
      if (this.topmostId) {
        this.elControlUp.html(this.options.htmlDisableScrollUp);
        if (this.elControlUp.is(":visible")) {
          this.elControlUp.fadeOut();
        }
      } else {
        this.elControlUp.html(this.options.htmlEnableScrollUp);
        if (!this.elControlUp.is(":visible")) {
          this.elControlUp.fadeIn();
        }
      }
      if (this.bottonmostId) {
        this.elControlDown.html(this.options.htmlDisableScrollDown);
        if (this.elControlDown.is(":visible")) {
          return this.elControlDown.fadeOut();
        }
      } else {
        this.elControlDown.html(this.options.htmlEnableScrollDown);
        if (!this.elControlDown.is(":visible")) {
          return this.elControlDown.fadeIn();
        }
      }
    }
  };

  MongooseEndlessScroll.prototype.fetch = function(data) {
    var ajaxOptions,
      _this = this;
    if (this.isFecthing) {
      console.log("[jquery.mongoose-endless-scroll::fetch] in fetching");
      return;
    }
    if ((data[DIRECTION_DOWN] === this.bottonmostId) || (data[DIRECTION_UP] === this.topmostId)) {
      console.log("[jquery.mongoose-endless-scroll::fetch] reach boundary");
      return;
    }
    this.showLoading(true);
    ajaxOptions = {
      dataType: "json",
      url: this.options.serviceUrl,
      data: data,
      success: function(res, textStatus) {
        var currentDirection, diff, item, pos;
        _this.showLoading(false);
        currentDirection = data[DIRECTION_UP] != null ? DIRECTION_UP : DIRECTION_DOWN;
        res.results || (res.results = []);
        pos = 0;
        while (pos < res.results.length) {
          item = res.results[pos];
          if (~_this.ids.indexOf(item._id)) {
            console.log("[jquery.mongoose-endless-scroll::remove duplicate] id:" + item._id + " title:" + item.title);
            res.results.splice(pos, 1);
          } else {
            ++pos;
          }
        }
        if (!(Array.isArray(res.results) && res.results.length)) {
          if (currentDirection === DIRECTION_DOWN) {
            _this.bottonmostId = data[DIRECTION_DOWN];
          } else {
            _this.topmostId = data[DIRECTION_UP];
          }
          console.log("[jquery.mongoose-endless-scroll::reach boundary] @topmostId:" + _this.topmostId + ", @bottonmostId:" + _this.bottonmostId);
          _this.showLoading(false);
          return;
        }
        _this.addInResults(res.results, currentDirection);
        if (currentDirection === DIRECTION_DOWN) {
          _this.renderBottomPartial();
        } else {
          _this.renderTopPartial();
        }
        if (_this.options.itemsToKeep > 0 && (diff = _this.ids.length - _this.options.itemsToKeep) > 0) {
          _this.clearRedundancy(diff, currentDirection);
        }
        if (typeof _this.options["onChange"] === "function") {
          _this.options["onChange"]();
        }
      },
      error: function(jqXHR, textStatus, err) {
        console.log("[jquery.mongoose-endless-scroll::error] err:" + err);
        _this.container.trigger("mescroll_error", err);
        _this.showLoading(false);
      }
    };
    $.ajax(ajaxOptions);
  };

  MongooseEndlessScroll.prototype.clearRedundancy = function(count, direction) {
    var id, item;
    while (count > 0) {
      id = direction === DIRECTION_DOWN ? this.ids.shift() : this.ids.pop();
      item = this.idToData[id];
      delete this.idToData[id];
      $("#" + id).remove();
      --count;
    }
    if (direction === DIRECTION_DOWN) {
      this.topmostId = null;
      this.showLoading(false);
    } else {
      this.bottonmostId = null;
      this.showLoading(false);
    }
  };

  MongooseEndlessScroll.prototype.addInResults = function(results, direction) {
    var id, result, _i, _len;
    if (direction === DIRECTION_UP) {
      results.reverse();
    }
    for (_i = 0, _len = results.length; _i < _len; _i++) {
      result = results[_i];
      id = result._id;
      if (~this.ids.indexOf(id)) {
        continue;
      }
      if (direction === DIRECTION_DOWN) {
        this.ids.push(id);
      } else {
        this.ids.unshift(id);
      }
      this.idToData[id] = result;
    }
  };

  MongooseEndlessScroll.prototype.getDisplayedTopmostId = function() {
    return $("" + this.container.selector + " " + this.options.itemElementName).first().attr("id");
  };

  MongooseEndlessScroll.prototype.getDisplayedBottommostId = function() {
    return $("" + this.container.selector + " " + this.options.itemElementName).last().attr("id");
  };

  MongooseEndlessScroll.prototype.renderTopPartial = function() {
    var id, item, pos, topmostId;
    topmostId = this.getDisplayedTopmostId();
    pos = this.ids.indexOf(topmostId) - 1;
    if (pos < -1) {
      pos = this.ids.length - 1;
    }
    while (pos > -1) {
      id = this.ids[pos];
      item = this.idToData[id];
      this.container.prepend(this.options.formatItem(item));
      --pos;
    }
  };

  MongooseEndlessScroll.prototype.renderBottomPartial = function() {
    var bottonmostId, id, item, pos;
    bottonmostId = this.getDisplayedBottommostId();
    pos = this.ids.indexOf(bottonmostId);
    if (pos <= -1) {
      pos = 0;
    } else {
      pos += 1;
    }
    while (pos < this.ids.length) {
      id = this.ids[pos];
      item = this.idToData[id];
      this.container.append(this.options.formatItem(item));
      ++pos;
    }
  };

  return MongooseEndlessScroll;

})();

(function($) {
  return $.fn.mongooseEndlessScroll = function(options) {
    return new MongooseEndlessScroll(this, options);
  };
})(jQuery);
