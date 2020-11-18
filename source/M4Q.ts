class M4Q {
  $: any = null;
  numProps: string[] = ['opacity', 'zIndex'];
  nextHandle: number = 1;
  tasksByHandle: any = {};
  currentlyRunningATask: boolean = false;
  registerImmediate: any;
  global: any = window;
  attachTo: any;

  constructor($: any) {
    this.$ = $;

    this.attachTo = Object.getPrototypeOf && Object.getPrototypeOf(this.global);
    this.attachTo = this.attachTo && this.attachTo.setTimeout ? this.attachTo : this.global;

    if ({}.toString.call(this.global.process) === "[object process]") {
      this.installNextTickImplementation();
    } else if (this.global.MessageChannel) {
      this.installMessageChannelImplementation();
    } else {
      this.installPostMessageImplementation();
    }

    this.attachTo.setImmediate = this.setImmediate;
    this.attachTo.clearImmediate = this.clearImmediate;
  }

  setImmediate(callback: any) {
    if (typeof callback !== "function") {
      /* jshint -W054 */
      callback = new Function("" + callback);
    }
    let args = new Array(arguments.length - 1);
    for (let i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    }
    this.tasksByHandle[this.nextHandle] = { callback: callback, args: args };
    this.registerImmediate(this.nextHandle);
    return this.nextHandle++;
  }

  clearImmediate(handle: any) {
    delete this.tasksByHandle[handle];
  }

  run(task: any) {
    let callback = task.callback;
    let args = task.args;
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

  runIfPresent(handle: any) {
    if (this.currentlyRunningATask) {
      setTimeout(this.runIfPresent, 0, handle);
    } else {
      var task = this.tasksByHandle[handle];
      if (task) {
        this.currentlyRunningATask = true;
        try {
          this.run(task);
        } finally {
          this.clearImmediate(handle);
          this.currentlyRunningATask = false;
        }
      }
    }
  }

  installNextTickImplementation() {
    this.registerImmediate = (handle: any) => {
      this.global.process.nextTick(() => { this.runIfPresent(handle); });
    };
  }

  // web workers
  installMessageChannelImplementation() {
    let channel = new MessageChannel();
    channel.port1.onmessage = (event) => {
      let handle = event.data;
      this.runIfPresent(handle);
    };

    this.registerImmediate = (handle: any) => {
      channel.port2.postMessage(handle);
    };
  }

  // Browsers
  installPostMessageImplementation() {
    let messagePrefix = "setImmediate$" + Math.random() + "$";
    let onGlobalMessage = (event: any) => {
      if (event.source === this.global &&
        typeof event.data === "string" &&
        event.data.indexOf(messagePrefix) === 0) {
        this.runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    this.global.addEventListener("message", onGlobalMessage, false);

    this.registerImmediate = (handle: any) => {
      this.global.postMessage(messagePrefix + handle, "*");
    };
  }

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

  str2arr(str: string, sep: string = " ") {
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

  createScript(script) {
    var s = document.createElement('script');
    s.type = 'text/javascript';

    if (not(script)) return $(s);

    var _script = $(script)[0];

    if (_script.src) {
      s.src = _script.src;
    } else {
      s.textContent = _script.innerText;
    }

    document.body.appendChild(s);

    if (_script.parentNode) _script.parentNode.removeChild(_script);

    return s;
  }
}