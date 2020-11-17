import $ from 'jquery';

class M4Q {
  $: any = null;
  numProps: string[] = ['opacity', 'zIndex'];
  nextHandle: number = 1;
  tasksByHandle: any = {};
  currentlyRunningATask: boolean = false;
  registerImmediate: any;

  constructor($: any) {
    this.$ = $;
  }
/*
  setImmediate(callback: any) {
    if (typeof callback !== "function") {
      /* jshint -W054 *//*
      callback = new Function("" + callback);
    }
    var args = new Array(arguments.length - 1);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    }
    tasksByHandle[nextHandle] = { callback: callback, args: args };
    registerImmediate(nextHandle);
    return nextHandle++;
  }

  clearImmediate(handle) {
    delete tasksByHandle[handle];
  }

  run(task) {
    var callback = task.callback;
    var args = task.args;
    switch (args.length) {
      case 0:
        callback();
        break;
      case 1:
        callback(args[0]);
        break;
      case 2:
        callback(args[0], args[1]);
        break;
      case 3:
        callback(args[0], args[1], args[2]);
        break;
      default:
        callback.apply(undefined, args);
        break;
    }
  }

  runIfPresent(handle) {
    if (currentlyRunningATask) {
      setTimeout(runIfPresent, 0, handle);
    } else {
      var task = tasksByHandle[handle];
      if (task) {
        currentlyRunningATask = true;
        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }

  // global.process
  function installNextTickImplementation() {
    registerImmediate = function(handle) {
        global.process.nextTick(function () { runIfPresent(handle); });
    };
}

// web workers
function installMessageChannelImplementation() {
    var channel = new MessageChannel();
    channel.port1.onmessage = function(event) {
        var handle = event.data;
        runIfPresent(handle);
    };

    registerImmediate = function(handle) {
        channel.port2.postMessage(handle);
    };
}

// Browsers
function installPostMessageImplementation() {
    var messagePrefix = "setImmediate$" + Math.random() + "$";
    var onGlobalMessage = function(event) {
        if (event.source === global &&
            typeof event.data === "string" &&
            event.data.indexOf(messagePrefix) === 0) {
            runIfPresent(+event.data.slice(messagePrefix.length));
        }
    };

    global.addEventListener("message", onGlobalMessage, false);

    registerImmediate = function(handle) {
        global.postMessage(messagePrefix + handle, "*");
    };
}

var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

if ({}.toString.call(global.process) === "[object process]") {

    installNextTickImplementation();

} else if (global.MessageChannel) {

    installMessageChannelImplementation();

} else {

    installPostMessageImplementation();

}

attachTo.setImmediate = setImmediate;
attachTo.clearImmediate = clearImmediate;*/

  isSimple(v: any) {
    return typeof v === "string" || typeof v === "boolean" || typeof v === "number";
  }

  isVisible(elem: any) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  }

  isHidden(elem: any) {
    let s = getComputedStyle(elem);
    return !this.isVisible(elem) || +s.opacity === 0 || elem.hidden || s.visibility === "hidden";
  }

  not(value: any) {
    return value === undefined || value === null;
  }

  camelCase(string: string) {
    return string.replace(/-([a-z])/g, (all, letter) => {
      return letter.toUpperCase();
    });
  }

  dashedName(str: string) {
    return str.replace(/([A-Z])/g, (u) => { return "-" + u.toLowerCase(); });
  }

  isPlainObject(obj: any) {
    let proto: any;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") {
      return false;
    }
    proto = obj.prototype !== undefined;
    if (!proto) {
      return true;
    }
    return proto.constructor && typeof proto.constructor === "function";
  }

  isEmptyObject(obj: any) {
    for (let name in obj) {
      if (this.hasProp(obj, name)) return false;
    }
    return true;
  }

  isArrayLike(o: any) {
    return o instanceof Object && 'length' in o;
  }

  str2arr(str: string, sep: string) {
    sep = sep || " ";
    return str.split(sep).map((el) => {
      return ("" + el).trim();
    }).filter((el) => {
      return el !== "";
    });
  }

  parseUnit(str: string, out: any) {
    if (!out) out = [0, ''];
    str = String(str);
    out[0] = parseFloat(str);
    out[1] = str.match(/[\d.\-+]*\s*(.*)/)[1] || '';
    return out;
  }

  getUnit(val: any, und: any) {
    let split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
    return typeof split[1] !== "undefined" ? split[1] : und;
  }

  setStyleProp(el: any, key: any, val: any) {
    key = this.camelCase(key);

    if (["scrollLeft", "scrollTop"].indexOf(key) > -1) {
      el[key] = (parseInt(val));
    } else {
      el.style[key] = isNaN(val) || this.numProps.indexOf("" + key) > -1 ? val : val + 'px';
    }
  }

  acceptData(owner: any) {
    return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
  }

  getData(data: any) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }

  dataAttr(elem: any, key: any, data: any) {
    let name: any;

    if (this.not(data) && elem.nodeType === 1) {
      name = "data-" + key.replace(/[A-Z]/g, "-$&").toLowerCase();
      data = elem.getAttribute(name);

      if (typeof data === "string") {
        data = this.getData(data);
        dataSet.set(elem, key, data);
      } else {
        data = undefined;
      }
    }
    return data;
  }

  normName(name: string) {
    return typeof name !== "string" ? undefined : name.replace(/-/g, "").toLowerCase();
  }

  strip(name: string, what: any) {
    return typeof name !== "string" ? undefined : name.replace(what, "");
  }

  hasProp(obj: any, prop: any) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  isLocalhost(host: any) {
    let hostname = host || window.location.hostname;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname === "" ||
      hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null
    );
  }

  isTouch() {
    return (('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
  }
}

let m4q = new M4Q($);

$.extend({
  meta: (name: string) => {
    return m4q.not(name) ? $("meta") : $(`meta[name='${name}']`);
  },

  metaBy: (name: string) => {
    return m4q.not(name) ? $("meta") : $(`meta[${name}]`);
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

export { $ as $$ };