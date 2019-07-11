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
    this.speed = 10;
    this.rotateSpeed = Math.PI * 2;
    this.direction = direction;
    this.init();
  }

  _createClass(Player, [{
    key: "init",
    value: function init() {
      this.info = document.createElement('div');
      this.info.classList.add('player-info');
      document.body.appendChild(this.info);
    }
  }, {
    key: "rotate",
    value: function rotate(angle) {
      this.direction = (this.direction + angle + circle) % circle;
    }
  }, {
    key: "move",
    value: function move(distance, map) {
      var dx = Math.cos(this.direction) * distance;
      var dy = Math.sin(this.direction) * distance;
      if (!map.isWall(this.x + dx, this.y)) this.x += dx;
      if (!map.isWall(this.x, this.y + dy)) this.y += dy;
    }
  }, {
    key: "update",
    value: function update(controls, map, tick) {
      if (controls.left) this.rotate(-this.rotateSpeed * tick);
      if (controls.right) this.rotate(this.rotateSpeed * tick);
      if (controls.forward) this.move(this.speed * tick, map);
      if (controls.backward) this.move(-(this.speed * tick), map);
      this.updateInfo(controls);
    }
  }, {
    key: "updateInfo",
    value: function updateInfo(_ref) {
      var left = _ref.left,
          right = _ref.right,
          forward = _ref.forward,
          backward = _ref.backward;
      this.info.innerHTML = "\n      x: ".concat(this.x.toFixed(2), ";\n      y: ").concat(this.y.toFixed(2), ";\n      r: ").concat(this.direction.toFixed(2), "rad;\n      L: ").concat(left, ";\n      R: ").concat(right, ";\n      F: ").concat(forward, ";\n      B: ").concat(backward, "\n    ");
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
    _classCallCheck(this, Map);

    this.walls = ['###############', '#.............#', '#.............#', '#.............#', '#..........####', '#.............#', '#.............#', '#.............#', '#.............#', '#.......###...#', '#.............#', '#.............#', '#.............#', '###############'];
    this.width = this.walls[0].length;
    this.height = this.walls.length;
    this.eyeshot = [];
    this.charSet = {
      wall: '#',
      floor: '.'
    };
  }

  _createClass(Map, [{
    key: "get",
    value: function get(x, y) {
      x = Math.floor(x);
      y = Math.floor(y);

      if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
        return -1;
      }

      return this.walls[y][x];
    }
  }, {
    key: "isWall",
    value: function isWall(x, y) {
      var char = this.get(x, y);
      return char === this.charSet.wall;
    }
  }, {
    key: "cast",
    value: function cast(player, angle, depth) {
      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      var distance = 0;
      var hitWall = false;
      var boundary = false;

      while (!hitWall && distance < depth) {
        distance += 1;
        var nTestX = Math.floor(player.x + cos * distance);
        var nTestY = Math.floor(player.y + sin * distance);
        this.eyeshot[nTestY] = this.eyeshot[nTestY] || [];
        this.eyeshot[nTestY][nTestX] = true;

        if (nTestX < 0 || nTestX >= this.width || nTestY < 0 || nTestY >= this.height) {
          distance = depth;
          hitWall = true;
        } else {
          if (this.walls[nTestY][nTestX] === this.charSet.wall) {
            hitWall = true;
            var p = [];

            for (var tx = 0; tx < 2; tx++) {
              for (var ty = 0; ty < 2; ty++) {
                var vy = nTestX + tx - player.x;
                var vx = nTestY + ty - player.y;
                var d = Math.hypot(vx, vy);
                var dot = sin * vx / d + cos * vy / d;
                p.push([d, dot]);
              }
            }

            var bound = 0.01;
            var sorted = p.sort(function (a, b) {
              return a[0] < b[0];
            });
            if (Math.acos(sorted[0][1]) < bound) boundary = true;
            if (Math.acos(sorted[1][1]) < bound) boundary = true;
            if (Math.acos(sorted[2][1]) < bound) boundary = true;
          }
        }
      } // remove fisheye effect


      distance *= Math.cos(angle - player.direction);
      return {
        distance: distance,
        boundary: boundary
      };
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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Camera =
/*#__PURE__*/
function () {
  function Camera(map, player) {
    _classCallCheck(this, Camera);

    this.map = map;
    this.player = player;
    this.width = 250;
    this.height = 80;
    this.depth = 14;
    this.fov = 45 * (Math.PI / 180);
    this.screen = new Array(this.width * this.height);
    this.charSet = {
      ceiling: ' ',
      boundary: ' ',
      wall1: '█',
      wall2: '▓',
      wall3: '▒',
      wall4: '░',
      floor1: '#',
      floor2: 'x',
      floor3: '.',
      floor4: '-'
    };
    this.init();
  }

  _createClass(Camera, [{
    key: "init",
    value: function init() {
      this.canvas = document.createElement('div');
      this.canvas.classList.add('camera');
      document.body.append(this.canvas);
    } // Big thanks to [Javidx9](https://github.com/OneLoneCoder) for this simple solution

  }, {
    key: "render",
    value: function render() {
      // reset sight
      this.map.eyeshot = [];

      for (var x = 0; x < this.width; x++) {
        var angle = this.player.direction - this.fov / 2 + x / this.width * this.fov;

        var _this$map$cast = this.map.cast(this.player, angle, this.depth),
            distance = _this$map$cast.distance,
            boundary = _this$map$cast.boundary; // calc ceiling and floor height


        var ceiling = this.height / 2 - this.height / distance;
        var floor = this.height - ceiling;

        for (var y = 0; y < this.height; y++) {
          var cell = y * this.width + x;
          var paint = ' ';

          if (y <= ceiling) {
            // ceiling
            paint = this.charSet.ceiling;
          } else if (y > ceiling && y <= floor) {
            // wall
            if (distance <= this.depth / 4) paint = this.charSet.wall1; // very close
            else if (distance < this.depth / 3) paint = this.charSet.wall2;else if (distance < this.depth / 2) paint = this.charSet.wall3;else if (distance < this.depth) paint = this.charSet.wall4; // far
              else paint = ' ';
            if (boundary) paint = this.charSet.boundary;
          } else {
            // floot
            var b = 1 - (y - this.height / 2) / (this.height / 2);
            if (b < 0.25) paint = this.charSet.floor1;else if (b < 0.5) paint = this.charSet.floor2;else if (b < 0.75) paint = this.charSet.floor3;else if (b < 0.9) paint = this.charSet.floor4;else paint = ' ';
          }

          this.screen[cell] = paint;
        }
      }

      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      var chunk = function chunk() {
        var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var size = arguments.length > 1 ? arguments[1] : undefined;
        return array.length ? [array.slice(0, size)].concat(_toConsumableArray(chunk(array.slice(size), size))) : [];
      };

      var chunks = chunk(this.screen, this.width); // draw buffer

      this.canvas.innerHTML = chunks.map(function (chunk) {
        return chunk.join('');
      }).join('<br/>');
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
  function Minimap(map, player, camera) {
    _classCallCheck(this, Minimap);

    this.map = map;
    this.player = player;
    this.charSet = {
      player: 'P',
      wall: '#',
      floor: '.',
      sight: ' '
    };
    this.init();
  }

  _createClass(Minimap, [{
    key: "init",
    value: function init() {
      this.el = document.createElement('pre');
      this.el.classList.add('minimap');
      this.compass = document.createElement('div');
      this.compass.classList.add('compass');
      document.body.appendChild(this.el);
      document.body.appendChild(this.compass);
    }
  }, {
    key: "getPlayerPos",
    value: function getPlayerPos() {
      return {
        x: Math.floor(this.player.x),
        y: Math.floor(this.player.y)
      };
    }
  }, {
    key: "update",
    value: function update() {
      var _this = this;

      var _this$getPlayerPos = this.getPlayerPos(),
          playerX = _this$getPlayerPos.x,
          playerY = _this$getPlayerPos.y;

      var buffer = this.map.walls.map(function (row, rowIndex) {
        return row.split('').map(function (col, colIndex) {
          // player
          if (colIndex === playerX && rowIndex === playerY) {
            return _this.charSet.player;
          } // wall


          if (col === _this.map.charSet.wall) {
            return _this.charSet.wall;
          } // eyesight


          if (_this.map.eyeshot[rowIndex] && _this.map.eyeshot[rowIndex][colIndex]) {
            return _this.charSet.sight;
          } // floor


          return _this.charSet.floor;
        }).join('');
      }).join('\n');
      this.el.innerHTML = buffer;
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
  var map = new _map.default();
  var player = new _player.default(2, 1, Math.PI * 0.5);
  var camera = new _camera.default(map, player);
  var minimap = new _minimap.default(map, player, camera);
  var fps = 30;

  function loop() {
    var lastTime = null;
    requestAnimationFrame(function animate(time) {
      requestAnimationFrame(animate);
      var delta = time - lastTime;
      var tick = (time - lastTime) / 1000;
      lastTime = time;

      if (delta > lastTime % (1000 / fps)) {
        player.update(_controls.default, map, tick);
        camera.render(player, map);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46453" + '/');

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