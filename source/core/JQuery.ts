import $ from 'jquery';

class JQuery {
  m4q: any;

  constructor(m4q: any) {
    this.m4q = m4q;
  }

  extend() {
    $.extend({
      meta: (name: string) => {
        return this.m4q.not(name) ? $("meta") : $(`meta[name='${name}']`);
      },
    
      metaBy: (name: string) => {
        return this.m4q.not(name) ? $("meta") : $(`meta[${name}]`);
      },
    
      head: () => {
        return $("html").find("head");
      },
    
      charset: (val: string) => {
        let meta = $("meta[charset]");
    
        if (val) {
          meta.attr("charset", val);
        }
    
        return meta.attr("charset");
      },
    
      script: (el: any) => {
        if (m4q.not(el)) {
          return createScript();
        }
    
        var _el = $(el)[0];
    
        if (_el.tagName && _el.tagName === "SCRIPT") {
          createScript(_el);
        } else $.each($(_el).find("script"), () => {
          createScript(this);
        });
      },
    
      hasData: (elem: any) => {
        return dataSet.hasData(elem);
      },
    
      data: (elem, key, val) => {
        return dataSet.access(elem, key, val);
      },
    
      removeData: (elem, key) => {
        return dataSet.remove(elem, key);
      },
    
      dataSet: (ns) => {
        if (not(ns)) return dataSet;
        if (['INTERNAL', 'M4Q'].indexOf(ns.toUpperCase()) > -1) {
          throw Error("You can not use reserved name for your dataset");
        }
        return new Data(ns);
      },
    
      device: (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),
      localhost: isLocalhost(),
      isLocalhost: isLocalhost,
      touchable: isTouch(),
    
      uniqueId: (prefix) => {
        var d = new Date().getTime();
        if (not(prefix)) {
          prefix = 'm4q';
        }
        return (prefix !== '' ? prefix + '-' : '') + 'xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },
    
      toArray: (n) => {
        var i, out = [];
    
        for (i = 0; i < n.length; i++) {
          out.push(n[i]);
        }
    
        return out;
      },
    
      import: (ctx) => {
        var res = [];
        this.each(ctx, () => {
          res.push(this);
        });
        return this.merge($(), res);
      },
    
      merge: (first, second) => {
        var len = +second.length,
          j = 0,
          i = first.length;
    
        for (; j < len; j++) {
          first[i++] = second[j];
        }
    
        first.length = i;
    
        return first;
      },
    
      type: (obj) => {
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)]$/, '$1').toLowerCase();
      },
    
      sleep: (ms) => {
        ms += new Date().getTime();
        /* eslint-disable-next-line */
        while (new Date() < ms) { }
      },
    
      isSelector: (selector) => {
        if (typeof selector !== 'string') {
          return false;
        }
        try {
          document.querySelector(selector);
        } catch (error) {
          return false;
        }
        return true;
      },
    
      remove: (s) => {
        return $(s).remove();
      },
    
      camelCase: camelCase,
      dashedName: dashedName,
      isPlainObject: isPlainObject,
      isEmptyObject: isEmptyObject,
      isArrayLike: isArrayLike,
      acceptData: acceptData,
      not: not,
      parseUnit: parseUnit,
      getUnit: getUnit,
      unit: parseUnit,
      isVisible: isVisible,
      isHidden: isHidden,
      matches: function (el, s) { return matches.call(el, s); },
      random: function (from, to) {
        if (arguments.length === 1 && isArrayLike(from)) {
          return from[Math.floor(Math.random() * (from.length))];
        }
        return Math.floor(Math.random() * (to - from + 1) + from);
      },
      strip: strip,
      normName: normName,
      hasProp: hasProp,
    
      serializeToArray: function (form) {
        var _form = $(form)[0];
        if (!_form || _form.nodeName !== "FORM") {
          console.warn("Element is not a HTMLFromElement");
          return;
        }
        var i, j, q = [];
        for (i = _form.elements.length - 1; i >= 0; i = i - 1) {
          if (_form.elements[i].name === "") {
            continue;
          }
          switch (_form.elements[i].nodeName) {
            case 'INPUT':
              switch (_form.elements[i].type) {
                case 'checkbox':
                case 'radio':
                  if (_form.elements[i].checked) {
                    q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                  }
                  break;
                case 'file':
                  break;
                default: q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
              }
              break;
            case 'TEXTAREA':
              q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
              break;
            case 'SELECT':
              switch (_form.elements[i].type) {
                case 'select-one':
                  q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                  break;
                case 'select-multiple':
                  for (j = _form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                    if (_form.elements[i].options[j].selected) {
                      q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].options[j].value));
                    }
                  }
                  break;
              }
              break;
            case 'BUTTON':
              switch (_form.elements[i].type) {
                case 'reset':
                case 'submit':
                case 'button':
                  q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                  break;
              }
              break;
          }
        }
        return q;
      },
      serialize: function (form) {
        return $.serializeToArray(form).join("&");
      },
    
      events: [],
      eventHooks: {},
    
      eventUID: -1,
    
      /*
      * el, eventName, handler, selector, ns, id, options
      * */
      setEventHandler: function (obj) {
        var i, freeIndex = -1, eventObj, resultIndex;
        if (this.events.length > 0) {
          for (i = 0; i < this.events.length; i++) {
            if (this.events[i].handler === null) {
              freeIndex = i;
              break;
            }
          }
        }
    
        eventObj = {
          element: obj.el,
          event: obj.event,
          handler: obj.handler,
          selector: obj.selector,
          ns: obj.ns,
          id: obj.id,
          options: obj.options
        };
    
        if (freeIndex === -1) {
          this.events.push(eventObj);
          resultIndex = this.events.length - 1;
        } else {
          this.events[freeIndex] = eventObj;
          resultIndex = freeIndex;
        }
    
        return resultIndex;
      },
    
      getEventHandler: function (index) {
        if (this.events[index] !== undefined && this.events[index] !== null) {
          this.events[index] = null;
          return this.events[index].handler;
        }
        return undefined;
      },
    
      off: function () {
        $.each(this.events, function () {
          this.element.removeEventListener(this.event, this.handler, true);
        });
        this.events = [];
        return this;
      },
    
      getEvents: function () {
        return this.events;
      },
    
      getEventHooks: function () {
        return this.eventHooks;
      },
    
      addEventHook: function (event, handler, type) {
        if (not(type)) {
          type = "before";
        }
        $.each(str2arr(event), function () {
          this.eventHooks[camelCase(type + "-" + this)] = handler;
        });
        return this;
      },
    
      removeEventHook: function (event, type) {
        if (not(type)) {
          type = "before";
        }
        $.each(str2arr(event), function () {
          delete this.eventHooks[camelCase(type + "-" + this)];
        });
        return this;
      },
    
      removeEventHooks: function (event) {
        var that = this;
        if (not(event)) {
          this.eventHooks = {};
        } else {
          $.each(str2arr(event), function () {
            delete that.eventHooks[camelCase("before-" + this)];
            delete that.eventHooks[camelCase("after-" + this)];
          });
        }
        return this;
      },
    
      proxy: function (fn, ctx) {
        return typeof fn !== "function" ? undefined : fn.bind(ctx);
      },
    
      bind: function (fn, ctx) {
        return this.proxy(fn, ctx);
      },
    
      animation: {
        duration: 1000,
        ease: "linear",
        elements: {}
      },
    
      animate: function (args) {
        var el, draw, dur, ease, cb;
    
        if (arguments.length > 1) {
          el = $(arguments[0])[0];
          draw = arguments[1];
          dur = arguments[2] || $.animation.duration;
          ease = arguments[3] || $.animation.ease;
          cb = arguments[4];
    
          if (typeof dur === 'function') {
            cb = dur;
            ease = $.animation.ease;
            dur = $.animation.duration;
          }
    
          if (typeof ease === 'function') {
            cb = ease;
            ease = $.animation.ease;
          }
    
          return animate({
            el: el,
            draw: draw,
            dur: dur,
            ease: ease,
            onDone: cb
          });
        }
    
        return animate(args);
      },
      stop: stop,
      chain: chain,
    
      fx: {
        off: false
      }
    });
  }
}