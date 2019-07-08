// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/controls.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var codes = {
  37: 'left',
  39: 'right',
  38: 'forward',
  40: 'backward'
};
var state = {
  left: false,
  right: false,
  forward: false,
  backward: false
};

function onKey(pressed, direction) {
  if (!direction) {
    return;
  }

  state[direction] = pressed;
}

document.addEventListener('keydown', function (_ref) {
  var which = _ref.which;
  return onKey(true, codes[which]);
});
document.addEventListener('keyup', function (_ref2) {
  var which = _ref2.which;
  return onKey(false, codes[which]);
});
var _default = state;
exports.default = _default;
},{}],"src/player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var circle = Math.PI * 2;

var Player =
/*#__PURE__*/
function () {
  function Player(x, y, direction) {
    _classCallCheck(this, Player);

    this.x = x;
    this.y = y;
    this.speed = 5;
    this.rotateSpeed = 3;
    this.direction = direction;
    this.debugPane = document.body.querySelector('#playerInfo');
  }

  _createClass(Player, [{
    key: "rotate",
    value: function rotate(angle) {
      this.direction += angle;
    }
  }, {
    key: "move",
    value: function move(distance, map) {
      var dx = Math.cos(this.direction) * distance;
      var dy = Math.sin(this.direction) * distance;
      if (map.get(this.x + dx, this.y) <= 0) this.x += dx;
      if (map.get(this.x, this.y + dy) <= 0) this.y += dy;
    }
  }, {
    key: "update",
    value: function update(controls, map, tick) {
      if (controls.left) this.rotate(-this.rotateSpeed * tick);
      if (controls.right) this.rotate(this.rotateSpeed * tick);

      if (controls.forward) {
        // this.move((this.speed * tick), map)
        this.x += Math.cos(this.direction) * this.speed * tick;
        this.y += Math.sin(this.direction) * this.speed * tick;
      }

      if (controls.backward) {
        // this.move(-(this.speed * tick), map)
        this.x -= Math.cos(this.direction) * this.speed * tick;
        this.y -= Math.sin(this.direction) * this.speed * tick;
      }

      this.debugPane.innerHTML = "\n    <div>tick: ".concat(tick, "</div>\n    <div>direction: ").concat(this.direction, "</div>\n    <div>left: ").concat(controls.left, "</div>\n    <div>up: ").concat(controls.forward, "</div>\n    <div>right: ").concat(controls.right, "</div>\n    <div>down: ").concat(controls.backward, "</div>\n    <div>x: ").concat(this.x, "</div>\n    <div>y: ").concat(this.y, "</div>");
    }
  }]);

  return Player;
}();

exports.default = Player;
},{}],"src/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Map =
/*#__PURE__*/
function () {
  function Map() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 40;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

    _classCallCheck(this, Map);

    this.width = width;
    this.height = height; // this.walls = new Uint8Array(this.width * this.height)

    this.walls = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  }

  _createClass(Map, [{
    key: "get",
    value: function get(x, y) {
      x = Math.floor(x);
      y = Math.floor(y);

      if (x < 0 || x > this.width - 1 || y < 0 || y > this.height) {
        return -1;
      }

      return this.walls[y * this.width + x];
    }
  }, {
    key: "cast",
    value: function cast(_ref, angle, depth) {
      var x = _ref.x,
          y = _ref.y;
      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      var wallHit = false;
      var distance = 0;

      while (!wallHit && distance < depth) {
        distance += 0.1;
        var checkPosX = x + eyeX * distance;
        var checkPosY = y + eyeY * distance;
        var hitTest = this.get(checkPosX, checkPosY);

        if (hitTest === -1) {
          wallHit = true;
          distance = depth;
        } else {
          if (hitTest !== 0) {
            wallHit = true;
          }
        }
      }

      return distance;
    }
  }]);

  return Map;
}();

exports.default = Map;
},{}],"src/camera.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Camera =
/*#__PURE__*/
function () {
  function Camera(canvas, player, map) {
    _classCallCheck(this, Camera);

    this.canvas = canvas;
    this.map = map;
    this.resolution = 320;
    this.spacing = this.map.width / this.resolution;
    this.depth = 14;
    this.fov = 0.8;
    this.screen = new Array(this.map.width * this.map.height);
    this.debugger = document.querySelector('#debugger');
    this.canvas = document.querySelector('#hitbox');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = '#ff0000';
  }

  _createClass(Camera, [{
    key: "render",
    value: function render(player) {
      for (var x = 0; x < this.map.width; x++) {
        var angle = player.direction - this.fov / 2 + x / this.map.width * this.fov;
        var hitWall = false;
        var distance = 0;
        var eyeX = Math.cos(angle);
        var eyeY = Math.sin(angle);
        this.ctx.clearRect(0, 0, 400, 300);
        this.ctx.beginPath();

        while (!hitWall && distance < this.depth) {
          distance += 0.1;
          var testX = Math.floor(player.x + eyeX * distance);
          var testY = Math.floor(player.y + eyeY * distance);

          if (testX < 0 || testX >= this.map.width || testY < 0 || testY >= this.map.height) {
            hitWall = true;
            distance = this.depth;
          } else {
            if (this.map.walls[testY * this.map.width + testX] !== 0) {
              hitWall = true;
            }
          }

          var posx = player.x * 10 + 10;
          var posy = player.y * 10 + 10;
          this.debugger.innerHTML = "".concat(angle, ", ").concat(angle + this.fov / 2, ", ").concat(angle - this.fov / 2);
          this.ctx.arc(posx, posy, 50, angle + this.fov / 2, angle - this.fov / 2, true);
          this.ctx.fillRect(testX * 10, testY * 10, 1, 1);
        }

        this.ctx.stroke();
        distance *= Math.cos(angle);
        var ceiling = this.map.height / 2 - this.map.height / distance;
        var floor = this.map.height - ceiling;

        for (var y = 0; y < this.map.height; y++) {
          var point = y * this.map.width + x;

          if (y < ceiling) {
            // ceiling
            this.screen[point] = ' ';
          } else if (y > ceiling && y <= floor) {
            var shade = ' '; // wall

            if (distance < this.depth / 4) shade = '█';else if (distance < this.depth / 3) shade = '▓';else if (distance < this.depth / 2) shade = '▒';else if (distance < this.depth) shade = '░';
            this.screen[point] = shade;
          } else {
            // floor
            this.screen[point] = ' ';
          }
        }
      }

      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this = this;

      var str = "";
      this.screen.forEach(function (el, index) {
        if (index % _this.map.width === 0) {
          str += "<br>";
        }

        str += el;
      });
      canvas.innerHTML = str;
    }
  }]);

  return Camera;
}();

exports.default = Camera;
},{}],"src/minimap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Minimap =
/*#__PURE__*/
function () {
  function Minimap(el, map, player, camera) {
    _classCallCheck(this, Minimap);

    this.el = el;
    this.map = map;
    this.player = player;
    this.camera = camera;
    this.miniPlayer = document.querySelector('#minimapPlayer');
    this.draw();
  }

  _createClass(Minimap, [{
    key: "draw",
    value: function draw() {
      this.el.style.width = "".concat(this.map.width * 10, "px");
      this.el.style.height = "".concat(this.map.height * 10, "px");
    }
  }, {
    key: "update",
    value: function update() {
      var angle = this.player.direction * (180 / Math.PI);
      var pX = this.player.x * 10;
      var pY = this.player.y * 10;
      this.miniPlayer.style.transform = "rotate(".concat(angle, "deg)");
      this.miniPlayer.style.top = "".concat(pY, "px");
      this.miniPlayer.style.left = "".concat(pX, "px");
    }
  }]);

  return Minimap;
}();

exports.default = Minimap;
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _controls = _interopRequireDefault(require("./controls"));

var _player = _interopRequireDefault(require("./player"));

var _map = _interopRequireDefault(require("./map"));

var _camera = _interopRequireDefault(require("./camera"));

var _minimap = _interopRequireDefault(require("./minimap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Game() {
  var canvasEl = document.querySelector('#canvas');
  var minimapEl = document.querySelector('#minimap');
  var player = new _player.default(10, 5, Math.PI * 1.4);
  var map = new _map.default();
  var camera = new _camera.default(canvasEl, player, map);
  var minimap = new _minimap.default(minimapEl, map, player, camera);
  var fps = 30;

  function loop() {
    var lastTime = null; // requestAnimationFrame(function animate (time) {
    //   const tick = (time - lastTime) / 1000
    //   player.update(controls, map, tick)
    //   camera.render(player)
    //   minimap.update()
    // })

    requestAnimationFrame(function animate(time) {
      requestAnimationFrame(animate);
      var delta = time - lastTime;
      var tick = (time - lastTime) / 1000;
      lastTime = time;

      if (delta > lastTime % (1000 / fps)) {
        player.update(_controls.default, map, tick);
        camera.render(player);
        minimap.update();
      }
    });
  }

  loop();
}

document.addEventListener('DOMContentLoaded', function () {
  return new Game();
});
},{"./controls":"src/controls.js","./player":"src/player.js","./map":"src/map.js","./camera":"src/camera.js","./minimap":"src/minimap.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58906" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map