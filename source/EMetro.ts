class ELMetro {
  $: any;
  version: string = "@@version";
  compileTime: string = "@@compile";
  buildNumber: string = "@@build";
  isTouchable: any;
  fullScreenEnabled: any;
  sheet: any = null;
  controlsPosition: {
    INSIDE: "inside",
    OUTSIDE: "outside"
  };

  groupMode: {
      ONE: "one",
      MULTI: "multi"
  };

  aspectRatio: any = {
      HD: "hd",
      SD: "sd",
      CINEMA: "cinema"
  };

  fullScreenMode: any = {
      WINDOW: "window",
      DESKTOP: "desktop"
  };

  position: {
      TOP: "top",
      BOTTOM: "bottom",
      LEFT: "left",
      RIGHT: "right",
      TOP_RIGHT: "top-right",
      TOP_LEFT: "top-left",
      BOTTOM_LEFT: "bottom-left",
      BOTTOM_RIGHT: "bottom-right",
      LEFT_BOTTOM: "left-bottom",
      LEFT_TOP: "left-top",
      RIGHT_TOP: "right-top",
      RIGHT_BOTTOM: "right-bottom"
  };

  popoverEvents: {
      CLICK: "click",
      HOVER: "hover",
      FOCUS: "focus"
  };

  stepperView: {
      SQUARE: "square",
      CYCLE: "cycle",
      DIAMOND: "diamond"
  };

  listView: {
      LIST: "list",
      CONTENT: "content",
      ICONS: "icons",
      ICONS_MEDIUM: "icons-medium",
      ICONS_LARGE: "icons-large",
      TILES: "tiles",
      TABLE: "table"
  };

  events: {
      click: 'click',
      start: isTouch ? 'touchstart' : 'mousedown',
      stop: isTouch ? 'touchend' : 'mouseup',
      move: isTouch ? 'touchmove' : 'mousemove',
      enter: isTouch ? 'touchstart' : 'mouseenter',

      startAll: 'mousedown touchstart',
      stopAll: 'mouseup touchend',
      moveAll: 'mousemove touchmove',

      leave: 'mouseleave',
      focus: 'focus',
      blur: 'blur',
      resize: 'resize',
      keyup: 'keyup',
      keydown: 'keydown',
      keypress: 'keypress',
      dblclick: 'dblclick',
      input: 'input',
      change: 'change',
      cut: 'cut',
      paste: 'paste',
      scroll: 'scroll',
      mousewheel: 'mousewheel',
      inputchange: "change input propertychange cut paste copy drop",
      dragstart: "dragstart",
      dragend: "dragend",
      dragenter: "dragenter",
      dragover: "dragover",
      dragleave: "dragleave",
      drop: 'drop',
      drag: 'drag'
  };

keyCode: {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    BREAK: 19,
    CAPS: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    COMMA: 188
},

media_queries: {
    FS: "(min-width: 0px)",
    XS: "(min-width: 360px)",
    SM: "(min-width: 576px)",
    MD: "(min-width: 768px)",
    LG: "(min-width: 992px)",
    XL: "(min-width: 1200px)",
    XXL: "(min-width: 1452px)"
},

media_sizes: {
    FS: 0,
    XS: 360,
    SM: 576,
    LD: 640,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1452
},

media_mode: {
    FS: "fs",
    XS: "xs",
    SM: "sm",
    MD: "md",
    LG: "lg",
    XL: "xl",
    XXL: "xxl"
},

media_modes: ["fs","xs","sm","md","lg","xl","xxl"],

actions: {
    REMOVE: 1,
    HIDE: 2 ,
    SHOW: 3 ,
    TOGGLE: 4
},

hotkeys: {},
locales: {},
utils: {},
colors: {},
dialog: null,
pagination: null,
md5: null,
storage: null,
export: null,
animations: null,
cookie: null,
template: null,

  constructor($: any) {
    this.$ = $;
    this.isTouch = (('ontouchstart' in window) || (navigator["MaxTouchPoints"] > 0) || (navigator["msMaxTouchPoints"] > 0));
    this.isTouchable = this.isTouch;
    this.fullScreenEnabled = document.fullscreenEnabled

    if (!('MutationObserver' in window)) {
        throw new Error('Metro 4 requires MutationObserver!');
    }
  }

  isTouch() {

  }
}