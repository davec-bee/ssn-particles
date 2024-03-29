function Point(e, t) {
    if (!e)
        e = 0;
    if (!t)
        t = 0;
    this.x = e;
    this.y = t
}
function Rectangle(e, t, n, r) {
    if (!e)
        e = 0;
    if (!t)
        t = 0;
    if (!n)
        n = 0;
    if (!r)
        r = 0;
    this.x = e;
    this.y = t;
    this.width = n;
    this.height = r
}
function Transform() {
    this._obj = null;
    this._mdirty = false;
    this._vdirty = false;
    this._tmat = Point._m4.create();
    this._imat = Point._m4.create();
    this._atmat = Point._m4.create();
    this._aimat = Point._m4.create();
    this._pscal = Point._m4.create();
    this._cmat = Point._m4.create();
    this._cvec = Point._v4.create();
    this._cID = true;
    this._scaleX = 1;
    this._scaleY = 1;
    this._scaleZ = 1;
    this._rotationX = 0;
    this._rotationY = 0;
    this._rotationZ = 0
}
function EventDispatcher() {
    this.lsrs = {};
    this.cals = {}
}
function Event(e, t) {
    if (!t)
        t = false;
    this.type = e;
    this.target = null;
    this.currentTarget = null;
    this.bubbles = t
}
function MouseEvent(e, t) {
    Event.call(this, e, t);
    this.movementX = 0;
    this.movementY = 0
}
function TouchEvent(e, t) {
    Event.call(this, e, t);
    this.stageX = 0;
    this.stageY = 0;
    this.touchPointID = -1
}
function KeyboardEvent(e, t) {
    Event.call(this, e, t);
    this.altKey = false;
    this.ctrlKey = false;
    this.shiftKey = false;
    this.keyCode = 0;
    this.charCode = 0
}
function DisplayObject() {
    EventDispatcher.call(this);
    this.visible = true;
    this.parent = null;
    this.stage = null;
    this.transform = new Transform;
    this.transform._obj = this;
    this.blendMode = BlendMode.NORMAL;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this._trect = new Rectangle;
    this._tempP = new Point;
    this._torg = Point._v4.create();
    this._tvec4_0 = Point._v4.create();
    this._tvec4_1 = Point._v4.create();
    this._tempm = Point._m4.create();
    this._atsEv = new Event(Event.ADDED_TO_STAGE);
    this._rfsEv = new Event(Event.REMOVED_FROM_STAGE);
    this._atsEv.target = this._rfsEv.target = this
}
function InteractiveObject() {
    DisplayObject.call(this);
    this.buttonMode = false;
    this.mouseEnabled = true;
    this.mouseChildren = true
}
function DisplayObjectContainer() {
    InteractiveObject.call(this);
    this._tempR = new Rectangle;
    this.numChildren = 0;
    this._children = []
}
function BitmapData(e) {
    this.width = 0;
    this.height = 0;
    this.rect = new Rectangle;
    this.loader = new EventDispatcher;
    this.loader.bitmapData = this;
    this._rwidth = 0;
    this._rheight = 0;
    this._rrect = null;
    this._texture = null;
    this._tcBuffer = null;
    this._vBuffer = null;
    this._loaded = false;
    this._dirty = true;
    this._gpuAllocated = false;
    this._buffer = null;
    this._ubuffer = null;
    if (e == null)
        return;
    var t = document.createElement("img");
    t.onload = function(e) {
        this._initFromImg(t, t.width, t.height);
        var n = new Event(Event.COMPLETE);
        this.loader.dispatchEvent(n)
    }.bind(this);
    t.src = e
}
function Bitmap(e) {
    DisplayObject.call(this);
    this.bitmapData = e
}
function Stage(e) {
    DisplayObjectContainer.call(this);
    document.body.setAttribute("style", "margin:0; overflow:hidden");
    var t = document.createElement("meta");
    t.setAttribute("name", "viewport");
    t.setAttribute("content", "width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0");
    document.getElementsByTagName("head")[0].appendChild(t);
    this.stage = this;
    this.stageWidth = 0;
    this.stageHeight = 0;
    this.focus = null;
    this._focii = [null, null, null];
    this._mousefocus = null;
    this._knM = false;
    this._mstack = new Stage._MStack;
    this._cmstack = new Stage._CMStack;
    this._sprg = null;
    this._svec4_0 = Point._v4.create();
    this._svec4_1 = Point._v4.create();
    this._pmat = Point._m4.create([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1]);
    this._umat = Point._m4.create([2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 2, 0, -1, 1, 0, 1]);
    this._smat = Point._m4.create([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, .001, 0, 0, 0, 0, 1]);
    this._mcEvs = [new MouseEvent(MouseEvent.CLICK, true), new MouseEvent(MouseEvent.MIDDLE_CLICK, true), new MouseEvent(MouseEvent.RIGHT_CLICK, true)];
    this._mdEvs = [new MouseEvent(MouseEvent.MOUSE_DOWN, true), new MouseEvent(MouseEvent.MIDDLE_MOUSE_DOWN, true), new MouseEvent(MouseEvent.RIGHT_MOUSE_DOWN, true)];
    this._muEvs = [new MouseEvent(MouseEvent.MOUSE_UP, true), new MouseEvent(MouseEvent.MIDDLE_MOUSE_UP, true), new MouseEvent(MouseEvent.RIGHT_MOUSE_UP, true)];
    this._smd = [false, false, false];
    this._smu = [false, false, false];
    this._smm = false;
    this._srs = false;
    this._touches = [];
    for (var n = 0; n < 30; n++)
        this._touches.push({touch: null,target: null,act: 0});
    this._canvas = this.canvas = document.getElementById(e);
    Stage._main = this;
    var r = {alpha: true,antialias: true,depth: true,premultipliedAlpha: true};
    var i = this.canvas;
    gl = i.getContext("webgl", r);
    if (!gl)
        gl = i.getContext("experimental-webgl", r);
    if (!gl)
        alert("Could not initialize WebGL. Try to update your browser or graphic drivers.");
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    var s = document;
    s.addEventListener("contextmenu", Stage._ctxt, false);
    s.addEventListener("dragstart", Stage._blck, false);
    {
        i.addEventListener("touchstart", Stage._onTD, false);
        i.addEventListener("touchmove", Stage._onTM, false);
        i.addEventListener("touchend", Stage._onTU, false);
        s.addEventListener("touchstart", Stage._blck, false);
        i.addEventListener("touchmove", Stage._blck, false);
        i.addEventListener("touchend", Stage._blck, false)
    }
    {
        i.addEventListener("mousedown", Stage._onMD, false);
        i.addEventListener("mousemove", Stage._onMM, false);
        i.addEventListener("mouseup", Stage._onMU, false);
        i.addEventListener("mousemove", Stage._blck, false);
        i.addEventListener("mouseup", Stage._blck, false)
    }
    s.addEventListener("keydown", Stage._onKD, false);
    s.addEventListener("keyup", Stage._onKU, false);
    s.addEventListener("keydown", Stage._blck, false);
    s.addEventListener("keyup", Stage._blck, false);
    window.addEventListener("resize", Stage._onRS, false);
    this._initShaders();
    this._initBuffers();
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    this._resize();
    this._srs = true;
    _requestAF(Stage._tick)
}
function Graphics() {
    this._conf = {ftype: 0,fbdata: null,fcolor: null,lwidth: 0,lcolor: null};
    this._points = [0, 0];
    this._fills = [];
    this._afills = [];
    this._lfill = null;
    this._rect = new Rectangle(0, 0, 0, 0);
    this._srect = new Rectangle(0, 0, 0, 0);
    this._startNewFill()
}
function Sprite() {
    DisplayObjectContainer.call(this);
    this._trect2 = new Rectangle;
    this.graphics = new Graphics
}
function TextFormat(e, t, n, r, i, s, o) {
    this.font = e ? e : "Times New Roman";
    this.size = t ? t : 12;
    this.color = n ? n : 0;
    this.bold = r ? r : false;
    this.italic = i ? i : false;
    this.align = s ? s : TextFormatAlign.LEFT;
    this.leading = o ? o : 0;
    this.maxW = 0;
    this.data = {image: null,tw: 0,th: 0,rw: 0,rh: 0}
}
function TextField() {
    InteractiveObject.call(this);
    this._tarea = document.createElement("textarea");
    this._tareaAdded = false;
    this._tarea.setAttribute("style", "font-family:Times New Roman; font-size:12px; z-index:-1;                                             position:absolute; top:0px; left:0px; opacity:0; pointer-events:none; user-select:none; width:100px; height:100px;");
    this._tarea.addEventListener("input", this._tfInput.bind(this), false);
    this._stage = null;
    this._type = "dynamic";
    this._selectable = true;
    this._mdown = false;
    this._curPos = -1;
    this._select = null;
    this._metrics = null;
    this._wordWrap = false;
    this._textW = 0;
    this._textH = 0;
    this._areaW = 100;
    this._areaH = 100;
    this._text = "";
    this._tForm = new TextFormat;
    this._rwidth = 0;
    this._rheight = 0;
    this._background = false;
    this._border = false;
    this._texture = gl.createTexture();
    this._tcArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0]);
    this._tcBuffer = gl.createBuffer();
    Stage._setBF(this._tcBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._tcArray, gl.STATIC_DRAW);
    this._fArray = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    this._vBuffer = gl.createBuffer();
    Stage._setBF(this._vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._fArray, gl.STATIC_DRAW);
    this.addEventListener2(Event.ADDED_TO_STAGE, this._tfATS, this);
    this.addEventListener2(Event.REMOVED_FROM_STAGE, this._tfRFS, this);
    this.addEventListener2(MouseEvent.MOUSE_DOWN, this._tfMD, this);
    this.addEventListener2(KeyboardEvent.KEY_UP, this._tfKU, this);
    this._brect = new Rectangle
}
window._requestAF = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e, t) {
        window.setTimeout(e, 1e3 / 60)
    }
}();
Point.prototype.add = function(e) {
    return new Point(this.x + e.x, this.y + e.y)
};
Point.prototype.clone = function() {
    return new Point(this.x, this.y)
};
Point.prototype.copyFrom = function(e) {
    this.x = e.x;
    this.y = e.y
};
Point.prototype.equals = function(e) {
    return this.x == e.x && this.y == e.y
};
Point.prototype.normalize = function(e) {
    var t = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x *= e / t;
    this.y *= e / t
};
Point.prototype.offset = function(e, t) {
    this.x += e;
    this.y += t
};
Point.prototype.setTo = function(e, t) {
    this.x = e;
    this.y = t
};
Point.prototype.subtract = function(e) {
    return new Point(this.x - e.x, this.y - e.y)
};
Point.distance = function(e, t) {
    return Point._distance(e.x, e.y, t.x, t.y)
};
Point.interpolate = function(e, t, n) {
    return new Point(e.x + n * (t.x - e.x), e.y + n * (t.y - e.y))
};
Point.polar = function(e, t) {
    return new Point(e * Math.cos(t), e * Math.sin(t))
};
Point._distance = function(e, t, n, r) {
    return Math.sqrt((n - e) * (n - e) + (r - t) * (r - t))
};
Point._v4 = {};
Point._m4 = {};
Point._v4.create = function() {
    var e = new Float32Array(4);
    return e
};
Point._m4.create = function(e) {
    var t = new Float32Array(16);
    t[0] = t[5] = t[10] = t[15] = 1;
    if (e)
        Point._m4.set(e, t);
    return t
};
Point._v4.add = function(e, t, n) {
    n[0] = e[0] + t[0];
    n[1] = e[1] + t[1];
    n[2] = e[2] + t[2];
    n[3] = e[3] + t[3]
};
Point._v4.set = function(e, t) {
    t[0] = e[0];
    t[1] = e[1];
    t[2] = e[2];
    t[3] = e[3]
};
Point._m4.set = function(e, t) {
    t[0] = e[0];
    t[1] = e[1];
    t[2] = e[2];
    t[3] = e[3];
    t[4] = e[4];
    t[5] = e[5];
    t[6] = e[6];
    t[7] = e[7];
    t[8] = e[8];
    t[9] = e[9];
    t[10] = e[10];
    t[11] = e[11];
    t[12] = e[12];
    t[13] = e[13];
    t[14] = e[14];
    t[15] = e[15]
};
Point._m4.multiply = function(e, t, n) {
    var r = e[0], i = e[1], s = e[2], o = e[3], u = e[4], a = e[5], f = e[6], l = e[7], c = e[8], h = e[9], p = e[10], d = e[11], v = e[12], m = e[13], g = e[14], y = e[15];
    var b = t[0], w = t[1], E = t[2], S = t[3];
    n[0] = b * r + w * u + E * c + S * v;
    n[1] = b * i + w * a + E * h + S * m;
    n[2] = b * s + w * f + E * p + S * g;
    n[3] = b * o + w * l + E * d + S * y;
    b = t[4];
    w = t[5];
    E = t[6];
    S = t[7];
    n[4] = b * r + w * u + E * c + S * v;
    n[5] = b * i + w * a + E * h + S * m;
    n[6] = b * s + w * f + E * p + S * g;
    n[7] = b * o + w * l + E * d + S * y;
    b = t[8];
    w = t[9];
    E = t[10];
    S = t[11];
    n[8] = b * r + w * u + E * c + S * v;
    n[9] = b * i + w * a + E * h + S * m;
    n[10] = b * s + w * f + E * p + S * g;
    n[11] = b * o + w * l + E * d + S * y;
    b = t[12];
    w = t[13];
    E = t[14];
    S = t[15];
    n[12] = b * r + w * u + E * c + S * v;
    n[13] = b * i + w * a + E * h + S * m;
    n[14] = b * s + w * f + E * p + S * g;
    n[15] = b * o + w * l + E * d + S * y;
    return n
};
Point._m4.inverse = function(e, t) {
    var n = e[0], r = e[1], i = e[2], s = e[3], o = e[4], u = e[5], a = e[6], f = e[7], l = e[8], c = e[9], h = e[10], p = e[11], d = e[12], v = e[13], m = e[14], g = e[15], y = n * u - r * o, b = n * a - i * o, w = n * f - s * o, E = r * a - i * u, S = r * f - s * u, x = i * f - s * a, T = l * v - c * d, N = l * m - h * d, C = l * g - p * d, k = c * m - h * v, L = c * g - p * v, A = h * g - p * m, O = y * A - b * L + w * k + E * C - S * N + x * T;
    if (!O) {
        return null
    }
    O = 1 / O;
    t[0] = (u * A - a * L + f * k) * O;
    t[1] = (i * L - r * A - s * k) * O;
    t[2] = (v * x - m * S + g * E) * O;
    t[3] = (h * S - c * x - p * E) * O;
    t[4] = (a * C - o * A - f * N) * O;
    t[5] = (n * A - i * C + s * N) * O;
    t[6] = (m * w - d * x - g * b) * O;
    t[7] = (l * x - h * w + p * b) * O;
    t[8] = (o * L - u * C + f * T) * O;
    t[9] = (r * C - n * L - s * T) * O;
    t[10] = (d * S - v * w + g * y) * O;
    t[11] = (c * w - l * S - p * y) * O;
    t[12] = (u * N - o * k - a * T) * O;
    t[13] = (n * k - r * N + i * T) * O;
    t[14] = (v * b - d * E - m * y) * O;
    t[15] = (l * E - c * b + h * y) * O;
    return t
};
Point._m4.multiplyVec2 = function(e, t, n) {
    var r = t[0], i = t[1];
    n[0] = r * e[0] + i * e[4] + e[12];
    n[1] = r * e[1] + i * e[5] + e[13]
};
Point._m4.multiplyVec4 = function(e, t, n) {
    var r = t[0], i = t[1], s = t[2], o = t[3];
    n[0] = e[0] * r + e[4] * i + e[8] * s + e[12] * o;
    n[1] = e[1] * r + e[5] * i + e[9] * s + e[13] * o;
    n[2] = e[2] * r + e[6] * i + e[10] * s + e[14] * o;
    n[3] = e[3] * r + e[7] * i + e[11] * s + e[15] * o
};
Rectangle.prototype.clone = function() {
    return new Rectangle(this.x, this.y, this.width, this.height)
};
Rectangle.prototype.contains = function(e, t) {
    return e >= this.x && e <= this.x + this.width && t >= this.y && t <= this.y + this.height
};
Rectangle.prototype.containsPoint = function(e) {
    return this.contains(e.x, e.y)
};
Rectangle.prototype.containsRect = function(e) {
    return this.x <= e.x && this.y <= e.y && e.x + e.width <= this.x + this.width && e.y + e.height <= this.y + this.height
};
Rectangle.prototype.copyFrom = function(e) {
    this.x = e.x;
    this.y = e.y;
    this.width = e.width;
    this.height = e.height
};
Rectangle.prototype.equals = function(e) {
    return this.x == e.x && this.y == e.y && this.width == e.width && this.height == e.height
};
Rectangle.prototype.inflate = function(e, t) {
    this.x -= e;
    this.y -= t;
    this.width += 2 * e;
    this.height += 2 * t
};
Rectangle.prototype.inflatePoint = function(e) {
    this.inflate(e.x, e.y)
};
Rectangle.prototype.intersection = function(e) {
    var t = Math.max(this.x, e.x);
    var n = Math.max(this.y, e.y);
    var r = Math.min(this.x + this.width, e.x + e.width);
    var i = Math.min(this.y + this.height, e.y + e.height);
    if (r < t || i < n)
        return new Rectangle;
    else
        return new Rectangle(t, n, r - t, i - n)
};
Rectangle.prototype.intersects = function(e) {
    if (e.y + e.height < this.y || e.x > this.x + this.width || e.y > this.y + this.height || e.x + e.width < this.x)
        return false;
    return true
};
Rectangle.prototype.isEmpty = function() {
    return this.width <= 0 || this.height <= 0
};
Rectangle.prototype.offset = function(e, t) {
    this.x += e;
    this.y += t
};
Rectangle.prototype.offsetPoint = function(e) {
    this.offset(e.x, e.y)
};
Rectangle.prototype.setEmpty = function() {
    this.x = this.y = this.width = this.height = 0
};
Rectangle.prototype.setTo = function(e) {
    this.x = e.x;
    this.y = e.y;
    this.width = e.width;
    this.height = e.height
};
Rectangle.prototype.union = function(e) {
    if (this.isEmpty())
        return e.clone();
    if (e.isEmpty())
        return this.clone();
    var t = this.clone();
    t._unionWith(e);
    return t
};
Rectangle._temp = new Float32Array(2);
Rectangle.prototype._unionWith = function(e) {
    if (e.isEmpty())
        return;
    if (this.isEmpty()) {
        this.copyFrom(e);
        return
    }
    this._unionWP(e.x, e.y);
    this._unionWP(e.x + e.width, e.y + e.height)
};
Rectangle.prototype._unionWP = function(e, t) {
    var n = Math.min(this.x, e);
    var r = Math.min(this.y, t);
    this.width = Math.max(this.x + this.width, e) - n;
    this.height = Math.max(this.y + this.height, t) - r;
    this.x = n;
    this.y = r
};
Rectangle.prototype._unionWL = function(e, t, n, r) {
    if (this.width == 0 && this.height == 0)
        this._setP(e, t);
    else
        this._unionWP(e, t);
    this._unionWP(n, r)
};
Rectangle.prototype._setP = function(e, t) {
    this.x = e;
    this.y = t;
    this.width = this.height = 0
};
Transform.prototype._getTMat = function() {
    var e = this._obj;
    var t = this._tmat;
    this._checkMat();
    t[12] = e.x;
    t[13] = e.y;
    t[14] = e.z;
    return t
};
Transform.prototype._getIMat = function() {
    Point._m4.inverse(this._getTMat(), this._imat);
    return this._imat
};
Transform.prototype._postScale = function(e, t) {
    this._checkMat();
    var n = this._pscal;
    n[10] = n[15] = 1;
    n[0] = e;
    n[5] = t;
    Point._m4.multiply(n, this._tmat, this._tmat);
    this._vdirty = true
};
Transform.prototype._valsToMat = function() {
    var e = this._tmat;
    var t = this._scaleX;
    var n = this._scaleY;
    var r = this._scaleZ;
    var i = -.01745329252;
    var s = this._rotationX * i;
    var o = this._rotationY * i;
    var u = this._rotationZ * i;
    var a = Math.cos(s), f = Math.cos(o), l = Math.cos(u);
    var c = Math.sin(s), h = Math.sin(o), p = Math.sin(u);
    e[0] = f * l * t;
    e[1] = -f * p * t;
    e[2] = h * t;
    e[4] = (a * p + c * h * l) * n;
    e[5] = (a * l - c * h * p) * n;
    e[6] = -c * f * n;
    e[8] = (c * p - a * h * l) * r;
    e[9] = (c * l + a * h * p) * r;
    e[10] = a * f * r
};
Transform.prototype._matToVals = function() {
    var e = this._tmat;
    var t = e[0], n = e[1], r = e[2], i = e[4], s = e[5], o = e[6], u = e[8], a = e[9], f = e[10];
    this._scaleX = Math.sqrt(t * t + n * n + r * r);
    this._scaleY = Math.sqrt(i * i + s * s + o * o);
    this._scaleZ = Math.sqrt(u * u + a * a + f * f);
    var l = 1 / this._scaleX, c = 1 / this._scaleY, h = 1 / this._scaleZ;
    t *= l;
    n *= l;
    r *= l;
    i *= c;
    s *= c;
    o *= c;
    u *= h;
    a *= h;
    f *= h;
    var p = -57.29577951308;
    this._rotationX = p * Math.atan2(-o, f);
    this._rotationY = p * Math.atan2(r, Math.sqrt(o * o + f * f));
    this._rotationZ = p * Math.atan2(-n, t)
};
Transform.prototype._checkVals = function() {
    if (this._vdirty) {
        this._matToVals();
        this._vdirty = false
    }
};
Transform.prototype._checkMat = function() {
    if (this._mdirty) {
        this._valsToMat();
        this._mdirty = false
    }
};
Transform.prototype._setOPos = function(e) {
    var e = this._tmat;
    this._obj.x = e[12];
    this._obj.y = e[13];
    this._obj.z = e[14]
};
Transform.prototype._checkColorID = function() {
    var e = this._cmat;
    var t = this._cvec;
    this._cID = e[15] == 1 && e[0] == 1 && e[1] == 0 && e[2] == 0 && e[3] == 0 && e[4] == 0 && e[5] == 1 && e[6] == 0 && e[7] == 0 && e[8] == 0 && e[9] == 0 && e[10] == 1 && e[11] == 0 && e[12] == 0 && e[13] == 0 && e[14] == 0 && e[15] == 1 && t[0] == 0 && t[1] == 0 && t[2] == 0 && t[3] == 0
};
Transform.prototype._setMat3 = function(e) {
    var t = this._tmat;
    t[0] = e[0];
    t[1] = e[1];
    t[4] = e[3];
    t[5] = e[4];
    t[12] = e[6];
    t[13] = e[7]
};
Transform.prototype._getMat3 = function(e) {
    var t = this._tmat;
    e[0] = t[0];
    e[1] = t[1];
    e[3] = t[4];
    e[4] = t[5];
    e[6] = t[12];
    e[7] = t[13]
};
Transform.prototype._setCMat5 = function(e) {
    var t = this._cmat, n = this._cvec;
    for (var r = 0; r < 4; r++) {
        n[r] = e[20 + r];
        for (var i = 0; i < 4; i++)
            t[4 * r + i] = e[5 * r + i]
    }
};
Transform.prototype._getCMat5 = function(e) {
    var t = this._cmat, n = this._cvec;
    e[24] = 1;
    for (var r = 0; r < 4; r++) {
        e[20 + r] = n[r];
        for (var i = 0; i < 4; i++)
            e[5 * r + i] = t[4 * r + i]
    }
};
Transform.prototype.__defineSetter__("matrix", function(e) {
    this._checkMat();
    this._setMat3(e);
    this._setOPos();
    this._vdirty = true
});
Transform.prototype.__defineGetter__("matrix", function() {
    this._checkMat();
    var e = new Float32Array(9);
    this._getMat3(e);
    return e
});
Transform.prototype.__defineSetter__("matrix3D", function(e) {
    this._checkMat();
    Point._m4.set(e, this._tmat);
    this._setOPos();
    this._vdirty = true
});
Transform.prototype.__defineGetter__("matrix3D", function() {
    this._checkMat();
    return Point._m4.create(this._getTMat())
});
Transform.prototype.__defineSetter__("colorTransform", function(e) {
    this._setCMat5(e);
    this._checkColorID()
});
Transform.prototype.__defineGetter__("colorTransform", function() {
    var e = new Float32Array(25);
    this._getCMat5(e);
    return e
});
EventDispatcher.efbc = [];
EventDispatcher.prototype.hasEventListener = function(e) {
    var t = this.lsrs[e];
    if (t == null)
        return false;
    return t.length > 0
};
EventDispatcher.prototype.addEventListener = function(e, t) {
    this.addEventListener2(e, t, null)
};
EventDispatcher.prototype.addEventListener2 = function(e, t, n) {
    if (this.lsrs[e] == null) {
        this.lsrs[e] = [];
        this.cals[e] = []
    }
    this.lsrs[e].push(t);
    this.cals[e].push(n);
    if (e == Event.ENTER_FRAME) {
        var r = EventDispatcher.efbc;
        if (r.indexOf(this) < 0)
            r.push(this)
    }
};
EventDispatcher.prototype.removeEventListener = function(e, t) {
    var n = this.lsrs[e];
    if (n == null)
        return;
    var r = n.indexOf(t);
    if (r < 0)
        return;
    var i = this.cals[e];
    n.splice(r, 1);
    i.splice(r, 1);
    if (e == Event.ENTER_FRAME && n.length == 0) {
        var s = EventDispatcher.efbc;
        s.splice(s.indexOf(this), 1)
    }
};
EventDispatcher.prototype.dispatchEvent = function(e) {
    e.currentTarget = this;
    if (e.target == null)
        e.target = this;
    var t = this.lsrs[e.type];
    if (t == null)
        return;
    var n = this.cals[e.type];
    for (var r = 0; r < t.length; r++) {
        if (n[r] == null)
            t[r](e);
        else
            t[r].call(n[r], e)
    }
};
Event.ENTER_FRAME = "enterFrame";
Event.RESIZE = "resize";
Event.ADDED_TO_STAGE = "addedToStage";
Event.REMOVED_FROM_STAGE = "removedFromStage";
Event.CHANGE = "change";
Event.OPEN = "open";
Event.PROGRESS = "progress";
Event.COMPLETE = "complete";
MouseEvent.prototype = new Event;
MouseEvent.CLICK = "click";
MouseEvent.MOUSE_DOWN = "mouseDown";
MouseEvent.MOUSE_UP = "mouseUp";
MouseEvent.MIDDLE_CLICK = "middleClick";
MouseEvent.MIDDLE_MOUSE_DOWN = "middleMouseDown";
MouseEvent.MIDDLE_MOUSE_UP = "middleMouseUp";
MouseEvent.RIGHT_CLICK = "rightClick";
MouseEvent.RIGHT_MOUSE_DOWN = "rightMouseDown";
MouseEvent.RIGHT_MOUSE_UP = "rightMouseUp";
MouseEvent.MOUSE_MOVE = "mouseMove";
MouseEvent.MOUSE_OVER = "mouseOver";
MouseEvent.MOUSE_OUT = "mouseOut";
TouchEvent.prototype = new Event;
TouchEvent.prototype._setFromDom = function(e) {
    var t = window.devicePixelRatio || 1;
    this.stageX = e.clientX * t;
    this.stageY = e.clientY * t;
    this.touchPointID = e.identifier
};
TouchEvent.TOUCH_BEGIN = "touchBegin";
TouchEvent.TOUCH_END = "touchEnd";
TouchEvent.TOUCH_MOVE = "touchMove";
TouchEvent.TOUCH_OUT = "touchOut";
TouchEvent.TOUCH_OVER = "touchOver";
TouchEvent.TOUCH_TAP = "touchTap";
KeyboardEvent.prototype = new Event;
KeyboardEvent.prototype._setFromDom = function(e) {
    this.altKey = e.altKey;
    this.ctrlKey = e.ctrlKey;
    this.shiftKey = e.shiftKey;
    this.keyCode = e.keyCode;
    this.charCode = e.charCode
};
KeyboardEvent.KEY_DOWN = "keyDown";
KeyboardEvent.KEY_UP = "keyUp";
var BlendMode = {NORMAL: "normal",ADD: "add",SUBTRACT: "subtract",MULTIPLY: "multiply",SCREEN: "screen",ERASE: "erase",ALPHA: "alpha"};
DisplayObject.prototype = new EventDispatcher;
DisplayObject.prototype.dispatchEvent = function(e) {
    EventDispatcher.prototype.dispatchEvent.call(this, e);
    if (e.bubbles && this.parent != null)
        this.parent.dispatchEvent(e)
};
DisplayObject.prototype._globalToLocal = function(e, t) {
    var n = this._torg;
    Stage._main._getOrigin(n);
    Point._m4.multiplyVec4(this._getAIMat(), n, n);
    var r = this._tvec4_1;
    r[0] = e.x;
    r[1] = e.y;
    r[2] = 0;
    r[3] = 1;
    Point._m4.multiplyVec4(this._getAIMat(), r, r);
    this._lineIsc(n, r, t)
};
DisplayObject.prototype.globalToLocal = function(e) {
    var t = new Point;
    this._globalToLocal(e, t);
    return t
};
DisplayObject.prototype.localToGlobal = function(e) {
    var t = this._torg;
    Stage._main._getOrigin(t);
    var n = this._tvec4_1;
    n[0] = e.x;
    n[1] = e.y;
    n[2] = 0;
    n[3] = 1;
    Point._m4.multiplyVec4(this._getATMat(), n, n);
    var r = new Point;
    this._lineIsc(t, n, r);
    return r
};
DisplayObject.prototype._lineIsc = function(e, t, n) {
    var r = t[0] - e[0], i = t[1] - e[1], s = t[2] - e[2];
    var o = Math.sqrt(r * r + i * i + s * s);
    r /= o;
    i /= o;
    s /= o;
    var u = -e[2] / s;
    n.x = e[0] + u * r;
    n.y = e[1] + u * i
};
DisplayObject.prototype._transfRect = function(e, t, n, r) {
    var i = this._tvec4_0;
    var s = this._tvec4_1;
    var o = new Point;
    var u = Infinity, a = Infinity, f = -Infinity, l = -Infinity;
    i[0] = n.x;
    i[1] = n.y;
    i[2] = 0;
    i[3] = 1;
    Point._m4.multiplyVec4(e, i, s);
    this._lineIsc(t, s, o);
    u = Math.min(u, o.x);
    a = Math.min(a, o.y);
    f = Math.max(f, o.x);
    l = Math.max(l, o.y);
    i[0] = n.x + n.width;
    i[1] = n.y;
    i[2] = 0;
    i[3] = 1;
    Point._m4.multiplyVec4(e, i, s);
    this._lineIsc(t, s, o);
    u = Math.min(u, o.x);
    a = Math.min(a, o.y);
    f = Math.max(f, o.x);
    l = Math.max(l, o.y);
    i[0] = n.x;
    i[1] = n.y + n.height;
    i[2] = 0;
    i[3] = 1;
    Point._m4.multiplyVec4(e, i, s);
    this._lineIsc(t, s, o);
    u = Math.min(u, o.x);
    a = Math.min(a, o.y);
    f = Math.max(f, o.x);
    l = Math.max(l, o.y);
    i[0] = n.x + n.width;
    i[1] = n.y + n.height;
    i[2] = 0;
    i[3] = 1;
    Point._m4.multiplyVec4(e, i, s);
    this._lineIsc(t, s, o);
    u = Math.min(u, o.x);
    a = Math.min(a, o.y);
    f = Math.max(f, o.x);
    l = Math.max(l, o.y);
    r.x = u;
    r.y = a;
    r.width = f - u;
    r.height = l - a
};
DisplayObject.prototype._getLocRect = function() {
};
DisplayObject.prototype._getRect = function(e, t, n) {
    Point._m4.multiply(e, this._getATMat(), this._tempm);
    this._transfRect(this._tempm, t, this._getLocRect(), this._trect);
    return this._trect
};
DisplayObject.prototype._getR = function(e, t) {
    Stage._main._getOrigin(this._torg);
    Point._m4.multiplyVec4(e._getAIMat(), this._torg, this._torg);
    return this._getRect(e._getAIMat(), this._torg, t)
};
DisplayObject.prototype._getParR = function(e, t) {
    if (DisplayObject._tdo == null)
        DisplayObject._tdo = new DisplayObject;
    var n = this.parent == null;
    if (n)
        this.parent = DisplayObject._tdo;
    var r = this._getR(this.parent, t);
    if (n)
        this.parent = null;
    return r
};
DisplayObject.prototype.getRect = function(e) {
    return this._getR(e, false).clone()
};
DisplayObject.prototype.getBounds = function(e) {
    return this._getR(e, true).clone()
};
DisplayObject.prototype._htpLocal = function(e, t) {
    var n = this._tempP;
    this._lineIsc(e, t, n);
    return this._getLocRect().contains(n.x, n.y)
};
DisplayObject.prototype.hitTestPoint = function(e, t, n) {
    if (n == null)
        n = false;
    var r = this._torg;
    Stage._main._getOrigin(r);
    Point._m4.multiplyVec4(this._getAIMat(), r, r);
    var i = this._tvec4_1;
    i[0] = e;
    i[1] = t;
    i[2] = 0;
    i[3] = 1;
    Point._m4.multiplyVec4(this._getAIMat(), i, i);
    if (n)
        return this._htpLocal(r, i);
    else
        return this._getR(Stage._main, false).contains(e, t)
};
DisplayObject.prototype.hitTestObject = function(e) {
    var t = this._getR(Stage._main, false);
    var n = e._getR(Stage._main, false);
    return t.intersects(n)
};
DisplayObject.prototype._loseFocus = function() {
};
DisplayObject.prototype._getTarget = function(e, t) {
    return null
};
DisplayObject.prototype._setStage = function(e) {
    var t = this.stage;
    this.stage = e;
    if (t == null && e != null)
        this.dispatchEvent(this._atsEv);
    if (t != null && e == null)
        this.dispatchEvent(this._rfsEv)
};
DisplayObject.prototype._preRender = function(e) {
    var t = this.transform._getTMat();
    e._mstack.push(t);
    e._cmstack.push(this.transform._cmat, this.transform._cvec, this.transform._cID, this.blendMode)
};
DisplayObject.prototype._render = function(e) {
};
DisplayObject.prototype._renderAll = function(e) {
    if (!this.visible)
        return;
    this._preRender(e);
    this._render(e);
    e._mstack.pop();
    e._cmstack.pop()
};
DisplayObject.prototype._getATMat = function() {
    if (this.parent == null)
        return this.transform._getTMat();
    Point._m4.multiply(this.parent._getATMat(), this.transform._getTMat(), this.transform._atmat);
    return this.transform._atmat
};
DisplayObject.prototype._getAIMat = function() {
    if (this.parent == null)
        return this.transform._getIMat();
    Point._m4.multiply(this.transform._getIMat(), this.parent._getAIMat(), this.transform._aimat);
    return this.transform._aimat
};
DisplayObject.prototype._getMouse = function() {
    var e = this._tempP;
    e.setTo(Stage._mouseX, Stage._mouseY);
    this._globalToLocal(e, e);
    return e
};
this.dp = DisplayObject.prototype;
dp.ds = dp.__defineSetter__;
dp.dg = dp.__defineGetter__;
dp.ds("scaleX", function(e) {
    this.transform._checkVals();
    this.transform._scaleX = e;
    this.transform._mdirty = true
});
dp.ds("scaleY", function(e) {
    this.transform._checkVals();
    this.transform._scaleY = e;
    this.transform._mdirty = true
});
dp.ds("scaleZ", function(e) {
    this.transform._checkVals();
    this.transform._scaleZ = e;
    this.transform._mdirty = true
});
dp.dg("scaleX", function() {
    this.transform._checkVals();
    return this.transform._scaleX
});
dp.dg("scaleY", function() {
    this.transform._checkVals();
    return this.transform._scaleY
});
dp.dg("scaleZ", function() {
    this.transform._checkVals();
    return this.transform._scaleZ
});
dp.ds("rotationX", function(e) {
    this.transform._checkVals();
    this.transform._rotationX = e;
    this.transform._mdirty = true
});
dp.ds("rotationY", function(e) {
    this.transform._checkVals();
    this.transform._rotationY = e;
    this.transform._mdirty = true
});
dp.ds("rotationZ", function(e) {
    this.transform._checkVals();
    this.transform._rotationZ = e;
    this.transform._mdirty = true
});
dp.ds("rotation", function(e) {
    this.transform._checkVals();
    this.transform._rotationZ = e;
    this.transform._mdirty = true
});
dp.dg("rotationX", function() {
    this.transform._checkVals();
    return this.transform._rotationX
});
dp.dg("rotationY", function() {
    this.transform._checkVals();
    return this.transform._rotationY
});
dp.dg("rotationZ", function() {
    this.transform._checkVals();
    return this.transform._rotationZ
});
dp.dg("rotation", function() {
    this.transform._checkVals();
    return this.transform._rotationZ
});
dp.ds("width", function(e) {
    var t = this.width;
    this.transform._postScale(e / t, 1)
});
dp.ds("height", function(e) {
    var t = this.height;
    this.transform._postScale(1, e / t)
});
dp.dg("width", function() {
    this.transform._checkVals();
    return this._getParR(this, true).width
});
dp.dg("height", function() {
    this.transform._checkVals();
    return this._getParR(this, true).height
});
dp.ds("alpha", function(e) {
    this.transform._cmat[15] = e;
    this.transform._checkColorID()
});
dp.dg("alpha", function() {
    return this.transform._cmat[15]
});
dp.dg("mouseX", function() {
    return this._getMouse().x
});
dp.dg("mouseY", function() {
    return this._getMouse().y
});
delete dp.ds;
delete dp.dg;
delete this.dp;
InteractiveObject.prototype = new DisplayObject;
InteractiveObject.prototype._getTarget = function(e, t) {
    if (!this.visible || !this.mouseEnabled)
        return null;
    var n = this._getLocRect();
    if (n == null)
        return null;
    var r = this._tvec4_0, i = this._tvec4_1;
    Point._m4.multiplyVec4(this.transform._getIMat(), e, r);
    Point._m4.multiplyVec4(this.transform._getIMat(), t, i);
    var s = this._tempP;
    this._lineIsc(r, i, s);
    if (n.contains(s.x, s.y))
        return this;
    return null
};
DisplayObjectContainer.prototype = new InteractiveObject;
DisplayObjectContainer.prototype._getRect = function(e, t, n) {
    var r = this._trect;
    r.setEmpty();
    for (var i = 0; i < this.numChildren; i++) {
        var s = this._children[i];
        if (!s.visible)
            continue;
        r._unionWith(s._getRect(e, t, n))
    }
    return r
};
DisplayObjectContainer.prototype._htpLocal = function(e, t) {
    var n = this._children.length;
    for (var r = 0; r < n; r++) {
        var i = this._children[r];
        if (!i.visible)
            continue;
        var s = i._tvec4_0, o = i._tvec4_1, u = i.transform._getIMat();
        Point._m4.multiplyVec4(u, e, s);
        Point._m4.multiplyVec4(u, t, o);
        return i._htpLocal(s, o)
    }
    return false
};
DisplayObjectContainer.prototype.addChild = function(e) {
    this._children.push(e);
    e.parent = this;
    e._setStage(this.stage);
    ++this.numChildren
};
DisplayObjectContainer.prototype.removeChild = function(e) {
    var t = this._children.indexOf(e);
    if (t < 0)
        return;
    this._children.splice(t, 1);
    e.parent = null;
    e._setStage(null);
    --this.numChildren
};
DisplayObjectContainer.prototype.removeChildAt = function(e) {
    this.removeChild(this._children[e])
};
DisplayObjectContainer.prototype.contains = function(e) {
    return this._children.indexOf(e) >= 0
};
DisplayObjectContainer.prototype.getChildIndex = function(e) {
    return this._children.indexOf(e)
};
DisplayObjectContainer.prototype.setChildIndex = function(e, t) {
    var n = this._children.indexOf(e);
    if (t > n) {
        for (var r = n + 1; r <= t; r++)
            this._children[r - 1] = this._children[r];
        this._children[t] = e
    } else if (t < n) {
        for (var r = n - 1; r >= t; r--)
            this._children[r + 1] = this._children[r];
        this._children[t] = e
    }
};
DisplayObjectContainer.prototype.getChildAt = function(e) {
    return this._children[e]
};
DisplayObjectContainer.prototype._render = function(e) {
    for (var t = 0; t < this.numChildren; t++)
        this._children[t]._renderAll(e)
};
DisplayObjectContainer.prototype._getTarget = function(e, t) {
    if (!this.visible || !this.mouseChildren && !this.mouseEnabled)
        return null;
    var n = this._tvec4_0, r = this._tvec4_1, i = this.transform._getIMat();
    Point._m4.multiplyVec4(i, e, n);
    Point._m4.multiplyVec4(i, t, r);
    var s = null;
    var o = this.numChildren - 1;
    for (var u = o; u > -1; u--) {
        var a = this._children[u]._getTarget(n, r);
        if (a != null) {
            s = a;
            break
        }
    }
    if (!this.mouseChildren && s != null)
        return this;
    return s
};
DisplayObjectContainer.prototype._setStage = function(e) {
    InteractiveObject.prototype._setStage.call(this, e);
    for (var t = 0; t < this.numChildren; t++)
        this._children[t]._setStage(e)
};
BitmapData.empty = function(e, t, n) {
    if (n == null)
        n = 4294967295;
    var r = new BitmapData(null);
    r._initFromImg(null, e, t, n);
    return r
};
BitmapData.prototype.setPixel = function(e, t, n) {
    var r = t * this.width + e, i = this._ubuffer;
    i[r] = (i[r] & 4278190080) + n;
    this._dirty = true
};
BitmapData.prototype.setPixel32 = function(e, t, n) {
    var r = t * this.width + e;
    this._ubuffer[r] = n;
    this._dirty = true
};
BitmapData.prototype.setPixels = function(e, t) {
    this._copyRectBuff(t, e, this._buffer, this.rect);
    this._dirty = true
};
BitmapData.prototype.getPixel = function(e, t) {
    var n = t * this.width + e;
    return this._ubuffer[n] & 16777215
};
BitmapData.prototype.getPixel32 = function(e, t) {
    var n = t * this.width + e;
    return this._ubuffer[n]
};
BitmapData.prototype.getPixels = function(e, t) {
    if (!t)
        t = new Uint8Array(e.width * e.height * 4);
    this._copyRectBuff(this._buffer, this.rect, t, e);
    return t
};
BitmapData.prototype.draw = function(e) {
    if (this._dirty)
        this._syncWithGPU();
    this._setTexAsFB();
    e._render(Stage._main);
    Stage._main._setFramebuffer(null, Stage._main.stageWidth, Stage._main.stageHeight, false);
    Stage._setTEX(this._texture);
    gl.generateMipmap(gl.TEXTURE_2D);
    var t = this._buffer, n = this.rect;
    this._setTexAsFB();
    gl.readPixels(n.x, n.y, n.width, n.height, gl.RGBA, gl.UNSIGNED_BYTE, t);
    Stage._main._setFramebuffer(null, Stage._main.stageWidth, Stage._main.stageHeight, false)
};
BitmapData.prototype._syncWithGPU = function() {
    var e = this.rect, t = this._buffer;
    if (!this._gpuAllocated) {
        var n = e.width, r = e.height;
        var i = n / this._rwidth;
        var s = r / this._rheight;
        this._texture = gl.createTexture();
        this._tcBuffer = gl.createBuffer();
        this._vBuffer = gl.createBuffer();
        Stage._setBF(this._tcBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, i, 0, 0, s, i, s]), gl.STATIC_DRAW);
        Stage._setBF(this._vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, n, 0, 0, 0, r, 0, n, r, 0]), gl.STATIC_DRAW);
        var o = new Uint8Array(this._rwidth * this._rheight * 4);
        var u = new Uint32Array(o.buffer);
        for (var a = 0; a < u.length; a++)
            u[a] = 16777215;
        Stage._setTEX(this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._rwidth, this._rheight, 0, gl.RGBA, gl.UNSIGNED_BYTE, o);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        this._gpuAllocated = true
    }
    Stage._setTEX(this._texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, e.x, e.y, e.width, e.height, gl.RGBA, gl.UNSIGNED_BYTE, t);
    gl.generateMipmap(gl.TEXTURE_2D);
    this._dirty = false
};
BitmapData.prototype._setTexAsFB = function() {
    if (BitmapData._fbo == null) {
        BitmapData._fbo = gl.createFramebuffer();
        var e = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, e);
        gl.bindFramebuffer(gl.FRAMEBUFFER, BitmapData._fbo);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, e)
    }
    Stage._main._setFramebuffer(BitmapData._fbo, this._rwidth, this._rheight, true);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._texture, 0)
};
BitmapData.prototype._initFromImg = function(e, t, n, r) {
    this._loaded = true;
    this.width = t;
    this.height = n;
    this.rect = new Rectangle(0, 0, t, n);
    this._rwidth = BitmapData._nhpot(t);
    this._rheight = BitmapData._nhpot(n);
    this._rrect = new Rectangle(0, 0, this._rwidth, this._rheight);
    var i = BitmapData._canv;
    i.width = t;
    i.height = n;
    var s = BitmapData._ctx;
    if (e != null)
        s.drawImage(e, 0, 0);
    var o = s.getImageData(0, 0, t, n);
    if (window.CanvasPixelArray && o.data instanceof CanvasPixelArray) {
        this._buffer = new Uint8Array(o.data)
    } else
        this._buffer = new Uint8Array(o.data.buffer);
    this._ubuffer = new Uint32Array(this._buffer.buffer);
    if (e == null)
        for (var u = 0, a = this._ubuffer; u < a.length; u++)
            a[u] = r
};
BitmapData.prototype._copyRectBuff = function(e, t, n, r) {
    e = new Uint32Array(e.buffer);
    n = new Uint32Array(n.buffer);
    var i = t.intersection(r);
    var s = Math.max(0, i.x - t.x);
    var o = Math.max(0, i.x - r.x);
    var u = Math.max(0, i.y - t.y);
    var a = Math.max(0, i.y - r.y);
    var f = i.width;
    var l = i.height;
    for (var c = 0; c < l; c++) {
        var h = (u + c) * t.width + s;
        var p = (a + c) * r.width + o;
        for (var d = 0; d < f; d++)
            n[p++] = e[h++]
    }
};
BitmapData._canv = document.createElement("canvas");
BitmapData._ctx = BitmapData._canv.getContext("2d");
BitmapData._ipot = function(e) {
    return (e & e - 1) == 0
};
BitmapData._nhpot = function(e) {
    --e;
    for (var t = 1; t < 32; t <<= 1)
        e = e | e >> t;
    return e + 1
};
Bitmap.prototype = new InteractiveObject;
Bitmap.prototype._getLocRect = function() {
    return this.bitmapData.rect
};
Bitmap.prototype._render = function(e) {
    var t = this.bitmapData;
    if (!t._loaded)
        return;
    if (t._dirty)
        t._syncWithGPU();
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    Stage._setVC(t._vBuffer);
    Stage._setTC(t._tcBuffer);
    Stage._setUT(1);
    Stage._setTEX(t._texture);
    Stage._setEBF(e._unitIBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
};
var gl;
Stage.prototype = new DisplayObjectContainer;
Stage.prototype._getOrigin = function(e) {
    e[0] = this.stageWidth / 2;
    e[1] = this.stageHeight / 2;
    e[2] = -500;
    e[3] = 1
};
Stage._mouseX = 0;
Stage._mouseY = 0;
Stage._curBF = -1;
Stage._curEBF = -1;
Stage._curVC = -1;
Stage._curTC = -1;
Stage._curUT = -1;
Stage._curTEX = -1;
Stage._curBMD = "normal";
Stage._setBF = function(e) {
    if (Stage._curBF != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        Stage._curBF = e
    }
};
Stage._setEBF = function(e) {
    if (Stage._curEBF != e) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, e);
        Stage._curEBF = e
    }
};
Stage._setVC = function(e) {
    if (Stage._curVC != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        gl.vertexAttribPointer(Stage._main._sprg.vpa, 3, gl.FLOAT, false, 0, 0);
        Stage._curVC = Stage._curBF = e
    }
};
Stage._setTC = function(e) {
    if (Stage._curTC != e) {
        gl.bindBuffer(gl.ARRAY_BUFFER, e);
        gl.vertexAttribPointer(Stage._main._sprg.tca, 2, gl.FLOAT, false, 0, 0);
        Stage._curTC = Stage._curBF = e
    }
};
Stage._setUT = function(e) {
    if (Stage._curUT != e) {
        gl.uniform1i(Stage._main._sprg.useTex, e);
        Stage._curUT = e
    }
};
Stage._setTEX = function(e) {
    if (Stage._curTEX != e) {
        gl.bindTexture(gl.TEXTURE_2D, e);
        Stage._curTEX = e
    }
};
Stage._setBMD = function(e) {
    if (Stage._curBMD != e) {
        if (e == BlendMode.NORMAL) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.MULTIPLY) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.ADD) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE)
        } else if (e == BlendMode.SUBTRACT) {
            gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE)
        } else if (e == BlendMode.SCREEN) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_COLOR)
        } else if (e == BlendMode.ERASE) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA)
        } else if (e == BlendMode.ALPHA) {
            gl.blendEquation(gl.FUNC_ADD);
            gl.blendFunc(gl.ZERO, gl.SRC_ALPHA)
        }
        Stage._curBMD = e
    }
};
Stage._okKeys = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 13, 16, 18, 27];
Stage._isTD = function() {
    return !!("ontouchstart" in window)
};
Stage._ctxt = function(e) {
    if (Stage._main.hasEventListener(MouseEvent.RIGHT_CLICK))
        e.preventDefault()
};
Stage._onTD = function(e) {
    Stage._setStageMouse(e.touches.item(0));
    Stage._main._smd[0] = true;
    Stage._main._knM = true;
    var t = Stage._main;
    for (var n = 0; n < e.changedTouches.length; n++) {
        var r = e.changedTouches.item(n);
        var i = t._touches[r.identifier];
        i.touch = r;
        i.act = 1
    }
};
Stage._onTM = function(e) {
    Stage._setStageMouse(e.touches.item(0));
    Stage._main._smm = true;
    Stage._main._knM = true;
    var t = Stage._main;
    for (var n = 0; n < e.changedTouches.length; n++) {
        var r = e.changedTouches.item(n);
        var i = t._touches[r.identifier];
        i.touch = r;
        i.act = 2
    }
};
Stage._onTU = function(e) {
    Stage._main._smu[0] = true;
    Stage._main._knM = true;
    var t = Stage._main;
    for (var n = 0; n < e.changedTouches.length; n++) {
        var r = e.changedTouches.item(n);
        var i = t._touches[r.identifier];
        i.touch = r;
        i.act = 3
    }
};
Stage._onMD = function(e) {
    Stage._setStageMouse(e);
    Stage._main._smd[e.button] = true;
    Stage._main._knM = true
};
Stage._onMM = function(e) {
    Stage._setStageMouse(e);
    Stage._main._smm = true;
    Stage._main._knM = true
};
Stage._onMU = function(e) {
    Stage._main._smu[e.button] = true;
    Stage._main._knM = true
};
Stage._onKD = function(e) {
    var t = Stage._main;
    var n = new KeyboardEvent(KeyboardEvent.KEY_DOWN, true);
    n._setFromDom(e);
    if (t.focus && t.focus.stage)
        t.focus.dispatchEvent(n);
    else
        t.dispatchEvent(n)
};
Stage._onKU = function(e) {
    var t = Stage._main;
    var n = new KeyboardEvent(KeyboardEvent.KEY_UP, true);
    n._setFromDom(e);
    if (t.focus && t.focus.stage)
        t.focus.dispatchEvent(n);
    else
        t.dispatchEvent(n)
};
Stage._blck = function(e) {
    if (e.keyCode != null) {
        if (e.target.tagName.toLowerCase() == "textarea") {
        } else if (Stage._okKeys.indexOf(e.keyCode) == -1)
            e.preventDefault()
    } else
        e.preventDefault()
};
Stage._onRS = function(e) {
    Stage._main._srs = true
};
Stage.prototype._resize = function() {
    var e = window.devicePixelRatio || 1;
    var t = window.innerWidth * e;
    var n = window.innerHeight * e;
    this._canvas.style.width = window.innerWidth + "px";
    this._canvas.style.height = window.innerHeight + "px";
    this.stageWidth = t;
    this.stageHeight = n;
    this._canvas.width = t;
    this._canvas.height = n;
    this._setFramebuffer(null, t, n, false)
};
Stage.prototype._getShader = function(e, t, n) {
    var r;
    if (n)
        r = e.createShader(e.FRAGMENT_SHADER);
    else
        r = e.createShader(e.VERTEX_SHADER);
    e.shaderSource(r, t);
    e.compileShader(r);
    if (!e.getShaderParameter(r, e.COMPILE_STATUS)) {
        alert(e.getShaderInfoLog(r));
        return null
    }
    return r
};
Stage.prototype._initShaders = function() {
    var e = "           precision mediump float;            varying vec2 texCoord;                      uniform sampler2D uSampler;         uniform vec4 color;         uniform bool useTex;                        uniform mat4 cMat;          uniform vec4 cVec;                      void main(void) {               vec4 c;             if(useTex) { c = texture2D(uSampler, texCoord);  c.xyz /= c.w; }                else c = color;             c = (cMat*c)+cVec;\n                c.xyz *= min(c.w, 1.0);\n               gl_FragColor = c;           }";
    var t = "           attribute vec3 verPos;          attribute vec2 texPos;                      uniform mat4 tMat;                      varying vec2 texCoord;                      void main(void) {               gl_Position = tMat * vec4(verPos, 1.0);             texCoord = texPos;          }";
    var n = this._getShader(gl, e, true);
    var r = this._getShader(gl, t, false);
    this._sprg = gl.createProgram();
    gl.attachShader(this._sprg, r);
    gl.attachShader(this._sprg, n);
    gl.linkProgram(this._sprg);
    if (!gl.getProgramParameter(this._sprg, gl.LINK_STATUS)) {
        alert("Could not initialise shaders")
    }
    gl.useProgram(this._sprg);
    this._sprg.vpa = gl.getAttribLocation(this._sprg, "verPos");
    this._sprg.tca = gl.getAttribLocation(this._sprg, "texPos");
    gl.enableVertexAttribArray(this._sprg.tca);
    gl.enableVertexAttribArray(this._sprg.vpa);
    this._sprg.tMatUniform = gl.getUniformLocation(this._sprg, "tMat");
    this._sprg.cMatUniform = gl.getUniformLocation(this._sprg, "cMat");
    this._sprg.cVecUniform = gl.getUniformLocation(this._sprg, "cVec");
    this._sprg.samplerUniform = gl.getUniformLocation(this._sprg, "uSampler");
    this._sprg.useTex = gl.getUniformLocation(this._sprg, "useTex");
    this._sprg.color = gl.getUniformLocation(this._sprg, "color")
};
Stage.prototype._initBuffers = function() {
    this._unitIBuffer = gl.createBuffer();
    Stage._setEBF(this._unitIBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 2, 3]), gl.STATIC_DRAW)
};
Stage.prototype._setFramebuffer = function(e, t, n, r) {
    this._mstack.clear();
    this._mstack.push(this._pmat, 0);
    if (r) {
        this._umat[5] = 2;
        this._umat[13] = -1
    } else {
        this._umat[5] = -2;
        this._umat[13] = 1
    }
    this._mstack.push(this._umat);
    this._smat[0] = 1 / t;
    this._smat[5] = 1 / n;
    this._mstack.push(this._smat);
    gl.bindFramebuffer(gl.FRAMEBUFFER, e);
    if (e)
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, t, n);
    gl.viewport(0, 0, t, n)
};
Stage._setStageMouse = function(e) {
    var t = window.devicePixelRatio || 1;
    Stage._mouseX = e.clientX * t;
    Stage._mouseY = e.clientY * t
};
Stage.prototype._drawScene = function() {
    if (this._srs) {
        this._resize();
        this.dispatchEvent(new Event(Event.RESIZE));
        this._srs = false
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (this._knM) {
        var e = this._svec4_0;
        this._getOrigin(e);
        var t = this._svec4_1;
        t[0] = Stage._mouseX;
        t[1] = Stage._mouseY;
        t[2] = 0;
        t[3] = 1;
        var n = this._getTarget(e, t);
        var r = this._mousefocus || this;
        var i = n || this;
        if (n != this._mousefocus) {
            if (r != this) {
                var s = new MouseEvent(MouseEvent.MOUSE_OUT, true);
                s.target = r;
                r.dispatchEvent(s)
            }
            if (i != this) {
                var s = new MouseEvent(MouseEvent.MOUSE_OVER, true);
                s.target = i;
                i.dispatchEvent(s)
            }
        }
        if (this._smd[0] && this.focus && n != this.focus)
            this.focus._loseFocus();
        for (var o = 0; o < 3; o++) {
            this._mcEvs[o].target = this._mdEvs[o].target = this._muEvs[o].target = i;
            if (this._smd[o]) {
                i.dispatchEvent(this._mdEvs[o]);
                this._focii[o] = this.focus = n
            }
            if (this._smu[o]) {
                i.dispatchEvent(this._muEvs[o]);
                if (n == this._focii[o])
                    i.dispatchEvent(this._mcEvs[o])
            }
            this._smd[o] = this._smu[o] = false
        }
        if (this._smm) {
            var s = new MouseEvent(MouseEvent.MOUSE_MOVE, true);
            s.target = i;
            i.dispatchEvent(s);
            this._smm = false
        }
        this._mousefocus = n;
        var u = false, a = i;
        while (a.parent != null) {
            u |= a.buttonMode;
            a = a.parent
        }
        var f = u ? "pointer" : "default";
        if (i instanceof TextField && i.selectable)
            f = "text";
        this._canvas.style.cursor = f
    }
    var l = window.devicePixelRatio || 1;
    for (var o = 0; o < this._touches.length; o++) {
        var c = this._touches[o];
        if (c.act == 0)
            continue;
        var e = this._svec4_0;
        this._getOrigin(e);
        var t = this._svec4_1;
        t[0] = c.touch.clientX * l;
        t[1] = c.touch.clientY * l;
        t[2] = 0;
        t[3] = 1;
        var n = this._getTarget(e, t);
        var r = c.target || this;
        var i = n || this;
        if (n != c.target) {
            if (r != this) {
                var s = new TouchEvent(TouchEvent.TOUCH_OUT, true);
                s._setFromDom(c.touch);
                s.target = r;
                r.dispatchEvent(s)
            }
            if (i != this) {
                var s = new TouchEvent(TouchEvent.TOUCH_OVER, true);
                s._setFromDom(c.touch);
                s.target = i;
                i.dispatchEvent(s)
            }
        }
        var s;
        if (c.act == 1)
            s = new TouchEvent(TouchEvent.TOUCH_BEGIN, true);
        if (c.act == 2)
            s = new TouchEvent(TouchEvent.TOUCH_MOVE, true);
        if (c.act == 3)
            s = new TouchEvent(TouchEvent.TOUCH_END, true);
        s._setFromDom(c.touch);
        s.target = i;
        i.dispatchEvent(s);
        if (c.act == 3 && n == c.target) {
            s = new TouchEvent(TouchEvent.TOUCH_TAP, true);
            s._setFromDom(c.touch);
            s.target = i;
            i.dispatchEvent(s)
        }
        c.act = 0;
        c.target = c.act == 3 ? null : n
    }
    var h = EventDispatcher.efbc;
    var s = new Event(Event.ENTER_FRAME, false);
    for (var o = 0; o < h.length; o++) {
        s.target = h[o];
        h[o].dispatchEvent(s)
    }
    this._renderAll(this)
};
Stage._tick = function() {
    _requestAF(Stage._tick);
    Stage.prototype._drawScene.call(Stage._main)
};
Stage._MStack = function() {
    this.mats = [];
    this.size = 1;
    for (var e = 0; e < 30; e++)
        this.mats.push(Point._m4.create())
};
Stage._MStack.prototype.clear = function() {
    this.size = 1
};
Stage._MStack.prototype.push = function(e) {
    var t = this.size++;
    Point._m4.multiply(this.mats[t - 1], e, this.mats[t])
};
Stage._MStack.prototype.pop = function() {
    this.size--
};
Stage._MStack.prototype.top = function() {
    return this.mats[this.size - 1]
};
Stage._CMStack = function() {
    this.mats = [];
    this.vecs = [];
    this.isID = [];
    this.bmds = [];
    this.lnnm = [];
    this.size = 1;
    this.dirty = true;
    for (var e = 0; e < 30; e++) {
        this.mats.push(Point._m4.create());
        this.vecs.push(new Float32Array(4));
        this.isID.push(true);
        this.bmds.push(BlendMode.NORMAL);
        this.lnnm.push(0)
    }
};
Stage._CMStack.prototype.push = function(e, t, n, r) {
    var i = this.size++;
    this.isID[i] = n;
    if (n) {
        Point._m4.set(this.mats[i - 1], this.mats[i]);
        Point._v4.set(this.vecs[i - 1], this.vecs[i])
    } else {
        Point._m4.multiply(this.mats[i - 1], e, this.mats[i]);
        Point._m4.multiplyVec4(this.mats[i - 1], t, this.vecs[i]);
        Point._v4.add(this.vecs[i - 1], this.vecs[i], this.vecs[i])
    }
    if (!n)
        this.dirty = true;
    this.bmds[i] = r;
    this.lnnm[i] = r == BlendMode.NORMAL ? this.lnnm[i - 1] : i
};
Stage._CMStack.prototype.update = function() {
    if (this.dirty) {
        var e = Stage._main, t = this.size - 1;
        gl.uniformMatrix4fv(e._sprg.cMatUniform, false, this.mats[t]);
        gl.uniform4fv(e._sprg.cVecUniform, this.vecs[t]);
        this.dirty = false
    }
    var n = this.lnnm[this.size - 1];
    Stage._setBMD(this.bmds[n])
};
Stage._CMStack.prototype.pop = function() {
    if (!this.isID[this.size - 1])
        this.dirty = true;
    this.size--
};
Graphics._delTgs = {};
Graphics._delNum = 0;
Graphics.prototype._startNewFill = function() {
    this._endLine();
    var e = this._points.length / 2;
    var t = new Graphics.Fill(e - 1, this._conf);
    this._fills.push(t);
    this._afills.push(t);
    this._lfill = t
};
Graphics.prototype._startLine = function() {
    var e = this._points.length / 2;
    var t = this._fills[this._fills.length - 1];
    var n = t.lines.length;
    if (n > 0 && t.lines[n - 1].isEmpty())
        t.lines[n - 1].Set(e - 1, this._conf);
    else
        t.lines.push(new Graphics.Line(e - 1, this._conf))
};
Graphics.prototype._endLine = function() {
    if (this._fills.length == 0)
        return;
    var e = this._points.length / 2;
    var t = this._fills[this._fills.length - 1];
    if (t.lines.length != 0)
        t.lines[t.lines.length - 1].end = e - 1
};
Graphics.prototype._render = function(e) {
    this._endLine();
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    for (var t = 0; t < this._afills.length; t++)
        this._afills[t].render(e, this._points, this._rect)
};
Graphics.prototype.lineStyle = function(e, t, n) {
    if (!t)
        t = 0;
    if (!n)
        n = 1;
    this._conf.lwidth = e;
    this._conf.lcolor = Graphics.makeColor(t, n);
    this._endLine();
    this._startLine()
};
Graphics.prototype.beginFill = function(e, t) {
    if (t == null)
        t = 1;
    this._conf.ftype = 1;
    this._conf.fcolor = Graphics.makeColor(e, t);
    this._startNewFill()
};
Graphics.prototype.beginBitmapFill = function(e) {
    this._conf.ftype = 2;
    this._conf.fbdata = e;
    this._startNewFill()
};
Graphics.prototype.endFill = function() {
    this._conf.ftype = 0;
    this._startNewFill()
};
Graphics.prototype.moveTo = function(e, t) {
    this._endLine();
    this._points.push(e, t);
    this._startLine()
};
Graphics.prototype.lineTo = function(e, t) {
    var n = this._points;
    if (e == n[n.length - 2] && t == n[n.length - 1])
        return;
    if (n.length > 0)
        if (this._conf.ftype > 0)
            this._rect._unionWL(n[n.length - 2], n[n.length - 1], e, t);
    if (this._conf.lwidth > 0)
        this._srect._unionWL(n[n.length - 2], n[n.length - 1], e, t);
    n.push(e, t)
};
Graphics.prototype.curveTo = function(e, t, n, r) {
    var i = this._points;
    var s = i[i.length - 2];
    var o = i[i.length - 1];
    var u = 2 / 3;
    this.cubicCurveTo(s + u * (e - s), o + u * (t - o), n + u * (e - n), r + u * (t - r), n, r)
};
Graphics.prototype.cubicCurveTo = function(e, t, n, r, i, s, o) {
    if (!o)
        o = 40;
    var u = this._points;
    var a = u[u.length - 2], f = u[u.length - 1];
    var l = e - a, c = t - f;
    var h = n - e, p = r - t;
    var d = i - n, v = s - r;
    var m = 1 / o;
    for (var g = 1; g < o; g++) {
        var y = g * m;
        var b = a + y * l, w = f + y * c;
        var E = e + y * h, S = t + y * p;
        var x = n + y * d, T = r + y * v;
        var N = E - b, C = S - w;
        var k = x - E, L = T - S;
        var A = b + y * N, O = w + y * C;
        var M = E + y * k, _ = S + y * L;
        var D = M - A, P = _ - O;
        this.lineTo(A + y * D, O + y * P)
    }
    this.lineTo(i, s)
};
Graphics.prototype.drawCircle = function(e, t, n) {
    this.drawEllipse(e, t, n * 2, n * 2)
};
Graphics.prototype.drawEllipse = function(e, t, n, r) {
    var i = n / 2, s = r / 2;
    var o = .553;
    this.moveTo(e, t - s);
    this.cubicCurveTo(e + o * i, t - s, e + i, t - o * s, e + i, t, 16);
    this.cubicCurveTo(e + i, t + o * s, e + o * i, t + s, e, t + s, 16);
    this.cubicCurveTo(e - o * i, t + s, e - i, t + o * s, e - i, t, 16);
    this.cubicCurveTo(e - i, t - o * s, e - o * i, t - s, e, t - s, 16)
};
Graphics.prototype.drawRect = function(e, t, n, r) {
    this.moveTo(e, t);
    this.lineTo(e + n, t);
    this.lineTo(e + n, t + r);
    this.lineTo(e, t + r);
    this.lineTo(e, t)
};
Graphics.prototype.drawRoundRect = function(e, t, n, r, i, s) {
    var o = i / 2, u = s / 2;
    var a = .553;
    var f = e + o, l = e + n - o;
    var c = t + u, h = t + r - u;
    this.moveTo(f, t);
    this.lineTo(l, t);
    this.cubicCurveTo(l + a * o, t, e + n, c - a * u, e + n, c, 16);
    this.lineTo(e + n, h);
    this.cubicCurveTo(e + n, h + a * u, l + a * o, t + r, l, t + r, 16);
    this.lineTo(f, t + r);
    this.cubicCurveTo(f - a * o, t + r, e, h + a * u, e, h, 16);
    this.lineTo(e, c);
    this.cubicCurveTo(e, c - a * u, f - a * o, t, f, t, 16)
};
Graphics.prototype.drawTriangles = function(e, t, n) {
    Graphics.Fill.updateRect(e, this._rect);
    var r = [];
    for (var i = 0; i < e.length; i += 2)
        r.push(e[i], e[i + 1], 0);
    var s = Graphics._makeTgs(r, t, n, this._conf.fcolor, this._conf.fbdata);
    this._afills.push(s);
    this._lfill = s
};
Graphics.prototype.drawTriangles3D = function(e, t, n) {
    var r = Graphics._makeTgs(e, t, n, this._conf.fcolor, this._conf.fbdata);
    this._afills.push(r);
    this._lfill = r
};
Graphics.prototype.clear = function() {
    this._conf.ftype = 0;
    this._conf.bdata = null;
    this._conf.fcolor = null;
    this._conf.lwidth = 0;
    this._points = [0, 0];
    this._fills = [];
    for (var e = 0; e < this._afills.length; e++) {
        var t = this._afills[e];
        if (t instanceof Graphics.Fill) {
            if (t.tgs)
                Graphics._freeTgs(t.tgs);
            for (var n = 0; n < t.lineTGS.length; n++)
                Graphics._freeTgs(t.lineTGS[n])
        } else
            Graphics._freeTgs(t)
    }
    this._afills = [];
    this._lfill = null;
    this._rect.setEmpty();
    this._startNewFill()
};
Graphics.prototype._getLocRect = function(e) {
    if (e == false)
        return this._rect;
    else
        return this._rect.union(this._srect)
};
Graphics.prototype._hits = function(e, t) {
    return this._rect.contains(e, t)
};
Graphics.makeColor = function(e, t) {
    var n = new Float32Array(4);
    n[0] = (e >> 16 & 255) * .0039215686;
    n[1] = (e >> 8 & 255) * .0039215686;
    n[2] = (e & 255) * .0039215686;
    n[3] = t;
    return n
};
Graphics.equalColor = function(e, t) {
    return e[0] == t[0] && e[1] == t[1] && e[2] == t[2] && e[3] == t[3]
};
Graphics.len = function(e, t) {
    return Math.sqrt(e * e + t * t)
};
Graphics.Fill = function(e, t) {
    this.type = t.ftype;
    this.color = t.fcolor;
    this.bdata = t.fbdata;
    this.lines = [new Graphics.Line(e, t)];
    this.lineTGS = [];
    this.dirty = true;
    this.tgs = null
};
Graphics.Fill.prototype.Build = function(e, t) {
    var n = [];
    var r = [];
    var i = [];
    var s = null;
    var o = -1;
    var u = null;
    for (var a = 0; a < this.lines.length; a++) {
        var f = this.lines[a];
        if (f.begin == f.end)
            continue;
        var l = f.begin * 2;
        var c = f.end * 2;
        var h = e[l] == e[c] && e[l + 1] == e[c + 1];
        if (h)
            c -= 2;
        if (f.width > 0) {
            if (s == null || f.width != o || !Graphics.equalColor(u, f.color)) {
                s = {vrt: [],ind: [],color: f.color};
                i.push(s);
                o = f.width;
                u = f.color
            }
            Graphics.Line.GetTriangles(e, l, c, f, this.type != 0 || h, s.ind, s.vrt)
        }
        if (this.type != 0 && c - l > 2) {
            var p = e.slice(f.begin * 2, f.end * 2 + 2);
            if (h) {
                p.pop();
                p.pop()
            }
            if (Graphics.PolyK.GetArea(p) < 0)
                p = Graphics.PolyK.Reverse(p);
            var d = n.length / 3;
            var v = Graphics.PolyK.Triangulate(p);
            for (var m = 0; m < v.length; m++)
                r.push(v[m] + d);
            for (var m = 0; m < p.length / 2; m++)
                n.push(p[2 * m], p[2 * m + 1], 0)
        }
    }
    for (var m = 0; m < i.length; m++) {
        this.lineTGS.push(Graphics._makeTgs(i[m].vrt, i[m].ind, null, i[m].color))
    }
    if (n.length > 0)
        this.tgs = Graphics._makeTgs(n, r, null, this.color, this.bdata)
};
Graphics.Fill.prototype.isEmpty = function() {
    if (this.lines.length == 0)
        return true;
    return this.lines[0].isEmpty()
};
Graphics.Fill.prototype.render = function(e, t, n) {
    if (this.dirty) {
        this.Build(t, n);
        this.dirty = false
    }
    if (this.tgs)
        this.tgs.render(e);
    for (var r = 0; r < this.lineTGS.length; r++)
        this.lineTGS[r].render(e)
};
Graphics.Fill.updateRect = function(e, t) {
    var n = Infinity, r = Infinity;
    var i = -Infinity, s = -Infinity;
    if (!t.isEmpty()) {
        n = t.x;
        r = t.y;
        i = t.x + t.width;
        s = t.y + t.height
    }
    for (var o = 0; o < e.length; o += 2) {
        n = Math.min(n, e[o]);
        r = Math.min(r, e[o + 1]);
        i = Math.max(i, e[o]);
        s = Math.max(s, e[o + 1])
    }
    t.x = n;
    t.y = r;
    t.width = i - n;
    t.height = s - r
};
Graphics.Line = function(e, t) {
    this.begin = e;
    this.end = -1;
    this.width = t.lwidth;
    this.color = t.lcolor
};
Graphics.Line.prototype.Set = function(e, t) {
    this.begin = e;
    this.end = -1;
    this.width = t.lwidth;
    this.color = t.lcolor
};
Graphics.Line.prototype.isEmpty = function() {
    return this.begin == this.end
};
Graphics.Line.GetTriangles = function(e, t, n, r, i, s, o) {
    var u = o.length / 3;
    var a = n - t - 2;
    if (i)
        Graphics.Line.AddJoint(e, n, t, t + 2, r.width, o);
    else
        Graphics.Line.AddEnd(e, t, t + 2, true, r.width, o);
    for (var f = 0; f < a; f += 2) {
        Graphics.Line.AddJoint(e, t + f, t + f + 2, t + f + 4, r.width, o);
        s.push(u + f + 0, u + f + 1, u + f + 2, u + f + 1, u + f + 2, u + f + 3)
    }
    if (i) {
        Graphics.Line.AddJoint(e, t + a, t + a + 2, t, r.width, o);
        s.push(u + a + 0, u + a + 1, u + a + 2, u + a + 1, u + a + 2, u + a + 3);
        s.push(u + a + 2, u + a + 3, u + 0, u + a + 3, u + 0, u + 1)
    } else {
        Graphics.Line.AddEnd(e, t + a, t + a + 2, false, r.width, o);
        s.push(u + 0 + a, u + 1 + a, u + 2 + a, u + 1 + a, u + 2 + a, u + 3 + a)
    }
};
Graphics.Line.AddEnd = function(e, t, n, r, i, s) {
    var o = e[t], u = e[t + 1];
    var a = e[n], f = e[n + 1];
    var l = .5 * i / Graphics.len(o - a, u - f);
    var c = l * (u - f);
    dy = -l * (o - a);
    if (r)
        s.push(o + c, u + dy, 0, o - c, u - dy, 0);
    else
        s.push(a + c, f + dy, 0, a - c, f - dy, 0)
};
Graphics.Line.AddJoint = function(e, t, n, r, i, s) {
    var o = new Point, u = new Point, a = new Point, f = new Point, l = new Point;
    var c = e[t], h = e[t + 1];
    var p = e[n], d = e[n + 1];
    var v = e[r], m = e[r + 1];
    var g = .5 * i / Graphics.len(c - p, h - d);
    var y = .5 * i / Graphics.len(p - v, d - m);
    var b = g * (h - d), w = -g * (c - p);
    var E = y * (d - m), S = -y * (p - v);
    if (Math.abs(b - E) + Math.abs(w - S) < 1e-7) {
        s.push(p + b, d + w, 0);
        s.push(p - b, d - w, 0);
        return
    }
    o.setTo(c + b, h + w);
    u.setTo(p + b, d + w);
    a.setTo(p + E, d + S);
    f.setTo(v + E, m + S);
    Graphics.PolyK._GetLineIntersection(o, u, a, f, l);
    s.push(l.x, l.y, 0);
    o.setTo(c - b, h - w);
    u.setTo(p - b, d - w);
    a.setTo(p - E, d - S);
    f.setTo(v - E, m - S);
    Graphics.PolyK._GetLineIntersection(o, u, a, f, l);
    s.push(l.x, l.y, 0)
};
Graphics._makeTgs = function(e, t, n, r, i) {
    var s = "t_" + e.length + "_" + t.length;
    var o = Graphics._delTgs[s];
    if (o == null || o.length == 0)
        return new Graphics.Tgs(e, t, n, r, i);
    var u = o.pop();
    Graphics._delNum--;
    u.Set(e, t, n, r, i);
    return u
};
Graphics._freeTgs = function(e) {
    var t = Graphics._delTgs[e.name];
    if (t == null)
        t = [];
    t.push(e);
    Graphics._delNum++;
    Graphics._delTgs[e.name] = t
};
Graphics.Tgs = function(e, t, n, r, i) {
    this.color = r;
    this.bdata = i;
    this.name = "t_" + e.length + "_" + t.length;
    this.useTex = i != null;
    this.dirtyUVT = true;
    this.emptyUVT = n == null;
    this.useIndex = e.length / 3 <= 65536;
    if (this.useIndex) {
        this.ind = new Uint16Array(t);
        this.vrt = new Float32Array(e);
        if (n)
            this.uvt = new Float32Array(n);
        else
            this.uvt = new Float32Array(e.length * 2 / 3);
        this.ibuf = gl.createBuffer();
        Stage._setEBF(this.ibuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.ind, gl.STATIC_DRAW)
    } else {
        this.vrt = new Float32Array(t.length * 3);
        Graphics.Tgs.unwrapF32(t, e, 3, this.vrt);
        this.uvt = new Float32Array(t.length * 2);
        if (n)
            Graphics.Tgs.unwrapF32(t, n, 2, this.uvt)
    }
    this.vbuf = gl.createBuffer();
    Stage._setBF(this.vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.vrt, gl.STATIC_DRAW);
    this.tbuf = gl.createBuffer();
    Stage._setBF(this.tbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvt, gl.STATIC_DRAW)
};
Graphics.Tgs.prototype.Set = function(e, t, n, r, i) {
    this.color = r;
    this.bdata = i;
    this.useTex = i != null;
    this.dirtyUVT = true;
    this.emptyUVT = n == null;
    if (this.useIndex) {
        var s = t.length, o = e.length;
        for (var u = 0; u < s; u++)
            this.ind[u] = t[u];
        for (var u = 0; u < o; u++)
            this.vrt[u] = e[u];
        if (n)
            for (var u = 0; u < n.length; u++)
                this.uvt[u] = n[u];
        Stage._setEBF(this.ibuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.ind, gl.STATIC_DRAW)
    } else {
        Graphics.Tgs.unwrapF32(t, e, 3, this.vrt);
        if (n)
            Graphics.Tgs.unwrapF32(t, n, 2, this.uvt)
    }
    Stage._setBF(this.vbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.vrt, gl.STATIC_DRAW);
    Stage._setBF(this.tbuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvt, gl.STATIC_DRAW)
};
Graphics.Tgs.prototype.render = function(e) {
    if (this.useTex) {
        var t = this.bdata;
        if (t._loaded == false)
            return;
        if (t._dirty)
            t._syncWithGPU();
        if (this.dirtyUVT) {
            this.dirtyUVT = false;
            if (this.emptyUVT) {
                this.emptyUVT = false;
                var n = 1 / t._rwidth, r = 1 / t._rheight;
                for (var i = 0; i < this.uvt.length; i++) {
                    this.uvt[2 * i] = n * this.vrt[3 * i];
                    this.uvt[2 * i + 1] = r * this.vrt[3 * i + 1]
                }
            } else if (t.width != t._rwidth || t.height != t._rheight) {
                var n = t.width / t._rwidth, r = t.height / t._rheight;
                for (var i = 0; i < this.uvt.length; i++) {
                    this.uvt[2 * i] *= n;
                    this.uvt[2 * i + 1] *= r
                }
            }
            Stage._setBF(this.tbuf);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvt)
        }
        Stage._setUT(1);
        Stage._setTEX(t._texture)
    } else {
        Stage._setUT(0);
        gl.uniform4fv(e._sprg.color, this.color)
    }
    Stage._setTC(this.tbuf);
    Stage._setVC(this.vbuf);
    if (this.useIndex) {
        Stage._setEBF(this.ibuf);
        gl.drawElements(gl.TRIANGLES, this.ind.length, gl.UNSIGNED_SHORT, 0)
    } else
        gl.drawArrays(gl.TRIANGLES, 0, this.vrt.length / 3)
};
Graphics.Tgs.unwrapF32 = function(e, t, n, r) {
    var i = e.length;
    for (var s = 0; s < i; s++)
        for (var o = 0; o < n; o++)
            r[s * n + o] = t[e[s] * n + o]
};
Graphics.PolyK = {};
Graphics.PolyK.Triangulate = function(e) {
    var t = e.length >> 1;
    if (t < 3)
        return [];
    var n = [];
    if (Graphics.PolyK.IsConvex(e)) {
        for (var r = 1; r < t - 1; r++)
            n.push(0, r, r + 1);
        return n
    }
    var i = [];
    for (var r = 0; r < t; r++)
        i.push(r);
    var r = 0;
    var s = t;
    while (s > 3) {
        var o = i[(r + 0) % s];
        var u = i[(r + 1) % s];
        var a = i[(r + 2) % s];
        var f = e[2 * o], l = e[2 * o + 1];
        var c = e[2 * u], h = e[2 * u + 1];
        var p = e[2 * a], d = e[2 * a + 1];
        var v = false;
        if (Graphics.PolyK._convex(f, l, c, h, p, d)) {
            v = true;
            for (var m = 0; m < s; m++) {
                var g = i[m];
                if (g == o || g == u || g == a)
                    continue;
                if (Graphics.PolyK._PointInTriangle(e[2 * g], e[2 * g + 1], f, l, c, h, p, d)) {
                    v = false;
                    break
                }
            }
        }
        if (v) {
            n.push(o, u, a);
            i.splice((r + 1) % s, 1);
            s--;
            r = 0
        } else if (r++ > 3 * s)
            break
    }
    n.push(i[0], i[1], i[2]);
    return n
};
Graphics.PolyK.IsConvex = function(e) {
    if (e.length < 6)
        return true;
    var t = e.length - 4;
    for (var n = 0; n < t; n += 2)
        if (!Graphics.PolyK._convex(e[n], e[n + 1], e[n + 2], e[n + 3], e[n + 4], e[n + 5]))
            return false;
    if (!Graphics.PolyK._convex(e[t], e[t + 1], e[t + 2], e[t + 3], e[0], e[1]))
        return false;
    if (!Graphics.PolyK._convex(e[t + 2], e[t + 3], e[0], e[1], e[2], e[3]))
        return false;
    return true
};
Graphics.PolyK._convex = function(e, t, n, r, i, s) {
    return (t - r) * (i - n) + (n - e) * (s - r) >= 0
};
Graphics.PolyK._PointInTriangle = function(e, t, n, r, i, s, o, u) {
    var a = o - n, f = u - r;
    var l = i - n, c = s - r;
    var h = e - n, p = t - r;
    var d = a * a + f * f;
    var v = a * l + f * c;
    var m = a * h + f * p;
    var g = l * l + c * c;
    var y = l * h + c * p;
    var b = 1 / (d * g - v * v);
    var w = (g * m - v * y) * b;
    var E = (d * y - v * m) * b;
    return w >= 0 && E >= 0 && w + E < 1
};
Graphics.PolyK._GetLineIntersection = function(e, t, n, r, i) {
    var s = e.x - t.x, o = n.x - r.x;
    var u = e.y - t.y, a = n.y - r.y;
    var f = s * a - u * o;
    if (f == 0)
        return null;
    var l = e.x * t.y - e.y * t.x;
    var c = n.x * r.y - n.y * r.x;
    i.x = (l * o - s * c) / f;
    i.y = (l * a - u * c) / f
};
Graphics.PolyK.GetArea = function(e) {
    if (e.length < 6)
        return 0;
    var t = e.length - 2;
    var n = 0;
    for (var r = 0; r < t; r += 2)
        n += (e[r + 2] - e[r]) * (e[r + 1] + e[r + 3]);
    n += (e[0] - e[t]) * (e[t + 1] + e[1]);
    return -n * .5
};
Graphics.PolyK.Reverse = function(e) {
    var t = [];
    for (var n = e.length - 2; n >= 0; n -= 2)
        t.push(e[n], e[n + 1]);
    return t
};
Sprite.prototype = new DisplayObjectContainer;
Sprite.prototype._getRect = function(e, t, n) {
    var r = DisplayObjectContainer.prototype._getRect.call(this, e, t, n);
    var i = this.graphics._getLocRect(n);
    Point._m4.multiply(e, this._getATMat(), this._tempm);
    this._transfRect(this._tempm, t, i, this._trect2);
    return r.union(this._trect2)
};
Sprite.prototype._render = function(e) {
    this.graphics._render(e);
    DisplayObjectContainer.prototype._render.call(this, e)
};
Sprite.prototype._getTarget = function(e, t) {
    if (!this.visible || !this.mouseChildren && !this.mouseEnabled)
        return null;
    var n = DisplayObjectContainer.prototype._getTarget.call(this, e, t);
    if (n != null)
        return n;
    if (!this.mouseEnabled)
        return null;
    var r = this._tvec4_0, i = this._tvec4_1, s = this.transform._getIMat();
    Point._m4.multiplyVec4(s, e, r);
    Point._m4.multiplyVec4(s, t, i);
    var o = this._tempP;
    this._lineIsc(r, i, o);
    if (this.graphics._hits(o.x, o.y))
        return this;
    return null
};
Sprite.prototype._htpLocal = function(e, t) {
    var n = this._tempP;
    this._lineIsc(e, t, n);
    if (this.graphics._hits(n.x, n.y))
        return true;
    return DisplayObjectContainer.prototype._htpLocal.call(this, e, t)
};
var TextFormatAlign = {LEFT: "left",CENTER: "center",RIGHT: "right",JUSTIFY: "justify"};
TextFormat.prototype.clone = function() {
    return new TextFormat(this.font, this.size, this.color, this.bold, this.italic, this.align, this.leading)
};
TextFormat.prototype.set = function(e) {
    this.font = e.font;
    this.size = e.size;
    this.color = e.color;
    this.bold = e.bold;
    this.italic = e.italic;
    this.align = e.align;
    this.leading = e.leading
};
TextFormat.prototype.setContext = function(e) {
    var t = this.color;
    var n = t >> 16 & 255;
    var r = t >> 8 & 255;
    var i = t & 255;
    e.textBaseline = "top";
    e.fillStyle = e.strokeStyle = "rgb(" + n + "," + r + "," + i + ")";
    e.font = (this.italic ? "italic " : "") + (this.bold ? "bold " : "") + this.size + "px " + this.font
};
TextFormat.prototype.getImageData = function(e, t) {
    var n = TextFormat._canvas;
    var r = TextFormat._ctxext;
    var i = this.data;
    n.width = i.rw = this._nhpt(t._areaW);
    n.height = i.rh = this._nhpt(t._areaH);
    if (t._background) {
        r.fillStyle = "rgba(255,255,255,1)";
        r.fillRect(0, 0, t._areaW, t._areaH)
    }
    if (t._border) {
        r.strokeStyle = "rgb(0,0,0)";
        r.beginPath();
        r.rect(.5, .5, t._areaW - 1, t._areaH - 1);
        r.stroke()
    }
    this.setContext(r);
    var s = [];
    this.maxW = 0;
    var o = e.split("\n");
    var u = 0;
    var a = 0;
    var f = this.size * 1.25;
    var l = 0;
    for (var c = 0; c < o.length; c++) {
        var h = this.renderPar(o[c], a, f, r, t, l, s);
        u += h;
        a += h * (f + this.leading);
        l += o[c].length + 1
    }
    if (this.align == TextFormatAlign.JUSTIFY)
        this.maxW = Math.max(this.maxW, t._areaW);
    i.tw = this.maxW;
    i.th = (f + this.leading) * u - this.leading;
    t._metrics = s;
    if (t._selectable && t._select && t._select.from < t._select.to) {
        var p = t._select;
        var d = s;
        var v = t.getLineIndexOfChar(p.from);
        var m = t.getLineIndexOfChar(p.to - 1);
        var g = t.getCharBoundaries(p.from);
        var y = t.getCharBoundaries(p.to - 1);
        r.fillStyle = "rgba(0,0,0,0.25)";
        if (v == m) {
            r.fillRect(g.x, g.y, y.x + y.width - g.x, y.y + y.height - g.y)
        } else {
            r.fillRect(g.x, g.y, d[v].x + d[v].width - g.x, d[v].y + d[v].height - g.y);
            for (var b = v + 1; b < m; b++)
                r.fillRect(d[b].x, d[b].y, d[b].width, d[b].height);
            r.fillRect(d[m].x, d[m].y, y.x + y.width - d[m].x, y.y + y.height - d[m].y)
        }
    } else if (t._type == "input" && t._curPos > -1) {
        var g = t.getCharBoundaries(t._curPos);
        r.beginPath();
        r.moveTo(Math.round(g.x) + .5, g.y);
        r.lineTo(Math.round(g.x) + .5, g.y + g.height);
        r.stroke()
    }
    i.canvas = n;
    var w = r.getImageData(0, 0, i.rw, i.rh);
    if (window.CanvasPixelArray && w.data instanceof CanvasPixelArray) {
        i.ui8buff = new Uint8Array(w.data)
    } else
        i.ui8buff = new Uint8Array(w.data.buffer);
    return i
};
TextFormat.prototype.renderPar = function(e, t, n, r, i, s, o) {
    var u;
    if (i._wordWrap)
        u = e.split(" ");
    else
        u = [e];
    var a = r.measureText(" ").width;
    var f = 0;
    var l = i._areaW;
    var c = 0;
    var h = [[]];
    var p = [];
    for (var d = 0; d < u.length; d++) {
        var v = u[d];
        var m = r.measureText(v).width;
        if (f + m <= l || f == 0) {
            h[c].push(v);
            f += m + a
        } else {
            p.push(l - f + a);
            h.push([]);
            c++;
            f = 0;
            d--
        }
    }
    p.push(l - f + a);
    for (var d = 0; d < h.length; d++) {
        var g = {x: 0,y: 0,width: 0,height: 0,charOffset: s,words: []};
        g.height = this.size * 1.25 + this.leading;
        var y = h[d];
        this.maxW = Math.max(this.maxW, l - p[d]);
        var b, w = t + (n + this.leading) * d;
        f = 0, b = a;
        if (this.align == TextFormatAlign.CENTER)
            f = p[d] * .5;
        if (this.align == TextFormatAlign.RIGHT)
            f = p[d];
        if (this.align == TextFormatAlign.JUSTIFY)
            b = a + p[d] / (y.length - 1);
        g.x = f;
        g.y = w;
        for (var E = 0; E < y.length; E++) {
            var v = y[E];
            r.fillText(v, f, w);
            var m = r.measureText(v).width;
            g.words.push({x: f,y: w,width: m,height: g.height,charOffset: s,word: v});
            if (d < h.length - 1)
                f += m + b;
            else {
                f += m + a
            }
            s += v.length + 1
        }
        g.width = f - g.x;
        if (d == h.length - 1)
            g.width -= a;
        o.push(g)
    }
    return c + 1
};
TextFormat.prototype._nhpt = function(e) {
    --e;
    for (var t = 1; t < 32; t <<= 1)
        e = e | e >> t;
    return e + 1
};
TextFormat._canvas = document.createElement("canvas");
TextFormat._ctxext = TextFormat._canvas.getContext("2d");
TextField.prototype = new InteractiveObject;
TextField.prototype._getLocRect = function() {
    return this._brect
};
TextField.prototype._loseFocus = function() {
    if (this._tareaAdded)
        document.body.removeChild(this._tarea);
    this._tareaAdded = false;
    this._curPos = -1;
    this._update()
};
TextField.prototype._tfKU = function(e) {
    this._tfInput(null)
};
TextField.prototype._tfInput = function(e) {
    if (this._type != "input")
        return;
    this._text = this._tarea.value;
    this._select = null;
    this._curPos = this._tarea.selectionStart;
    this.setSelection(this._tarea.selectionStart, this._tarea.selectionEnd)
};
TextField.prototype._tfATS = function(e) {
    this._stage = this.stage;
    this.stage.addEventListener2(MouseEvent.MOUSE_MOVE, this._tfMM, this);
    this.stage.addEventListener2(MouseEvent.MOUSE_UP, this._tfMU, this)
};
TextField.prototype._tfRFS = function(e) {
    this._stage.removeEventListener(MouseEvent.MOUSE_MOVE, this._tfMM);
    this._stage.removeEventListener(MouseEvent.MOUSE_UP, this._tfMU);
    this._loseFocus()
};
TextField.prototype._tfMD = function(e) {
    if (!this._selectable)
        return;
    if (this._type == "input") {
        this._tareaAdded = true;
        document.body.appendChild(this._tarea);
        this._tarea.value = this._text;
        this._tarea.focus()
    }
    var t = this.getCharIndexAtPoint(this.mouseX, this.mouseY);
    this._mdown = true;
    this._curPos = t;
    this.setSelection(t, t);
    this._update()
};
TextField.prototype._tfMM = function(e) {
    if (!this._selectable || !this._mdown)
        return;
    var t = this.getCharIndexAtPoint(this.mouseX, this.mouseY);
    this.setSelection(this._curPos, t)
};
TextField.prototype._tfMU = function(e) {
    if (!this._selectable)
        return;
    this._mdown = false
};
TextField.prototype.appendText = function(e) {
    this._text += e;
    this._update()
};
TextField.prototype.getCharBoundaries = function(e) {
    var t = TextFormat._ctxext;
    this._tForm.setContext(t);
    var n = this._metrics;
    var r = this.getLineIndexOfChar(e);
    if (n[r].words.length == 0)
        return new Rectangle(n[r].x, n[r].y, n[r].width, n[r].height);
    var i = 0;
    while (i + 1 < n[r].words.length && n[r].words[i + 1].charOffset <= e)
        i++;
    var s = n[r].words[i];
    var o = s.word.substring(0, e - s.charOffset);
    var u = new Rectangle(s.x + t.measureText(o).width, s.y, 0, s.height);
    u.width = t.measureText(this._text.charAt(e)).width;
    var a = n[r].words[i + 1];
    if (a && a.charOffset == e + 1)
        u.width = a.x - u.x;
    return u
};
TextField.prototype.getCharIndexAtPoint = function(e, t) {
    if (this._text.length == 0)
        return 0;
    var n = TextFormat._ctxext;
    this._tForm.setContext(n);
    var r = this._metrics;
    var i = this.getLineIndexAtPoint(e, t);
    e = Math.max(r[i].x, Math.min(r[i].x + r[i].width, e));
    var s = 0;
    while (s + 1 < r[i].words.length && r[i].words[s + 1].x <= e)
        s++;
    var o = r[i].words[s];
    var u = o.charOffset;
    var a = o.x;
    while (true) {
        var f = n.measureText(this._text.charAt(u)).width;
        if (a + f * .5 < e && f != 0) {
            a += f;
            u++
        } else
            break
    }
    return u
};
TextField.prototype.getLineIndexAtPoint = function(e, t) {
    var n = this._metrics;
    var r = 0;
    while (r + 1 < n.length && n[r + 1].y <= t)
        r++;
    return r
};
TextField.prototype.getLineIndexOfChar = function(e) {
    var t = this._metrics;
    var n = 0;
    while (n + 1 < t.length && t[n + 1].charOffset <= e)
        n++;
    return n
};
TextField.prototype.getTextFormat = function(e) {
    return this._tForm.clone()
};
TextField.prototype.setTextFormat = function(e) {
    this._tForm.set(e);
    this._tarea.style.fontFamily = e.font;
    this._tarea.style.fontSize = e.size + "px";
    this._tarea.style.textAlign = e.align;
    this._update()
};
TextField.prototype.setSelection = function(e, t) {
    var n = Math.min(e, t), r = Math.max(e, t), i = this._select;
    if (i == null || i.from != n || i.to != r) {
        this._select = {from: n,to: r};
        this._tarea.selectionStart = n;
        this._tarea.selectionEnd = r;
        this._update()
    }
};
TextField.prototype._update = function() {
    var e = this._brect.width = this._areaW;
    var t = this._brect.height = this._areaH;
    if (e == 0 || t == 0)
        return;
    var n = this._tForm.getImageData(this._text, this);
    this._textW = n.tw;
    this._textH = n.th;
    if (n.rw != this._rwidth || n.rh != this._rheight) {
        gl.deleteTexture(this._texture);
        this._texture = gl.createTexture()
    }
    Stage._setTEX(this._texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, n.rw, n.rh, 0, gl.RGBA, gl.UNSIGNED_BYTE, n.ui8buff);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    this._rwidth = n.rw;
    this._rheight = n.rh;
    var r = e / n.rw;
    var i = t / n.rh;
    var s = this._tcArray;
    s[2] = s[6] = r;
    s[5] = s[7] = i;
    Stage._setBF(this._tcBuffer);
    gl.vertexAttribPointer(Stage._main._sprg.tca, 2, gl.FLOAT, false, 0, 0);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, s);
    var o = this._fArray;
    o[3] = o[9] = e;
    o[7] = o[10] = t;
    Stage._setBF(this._vBuffer);
    gl.vertexAttribPointer(Stage._main._sprg.vpa, 3, gl.FLOAT, false, 0, 0);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, o)
};
TextField.prototype._render = function(e) {
    if (this._areaW == 0 || this._areaH == 0)
        return;
    gl.uniformMatrix4fv(e._sprg.tMatUniform, false, e._mstack.top());
    e._cmstack.update();
    Stage._setVC(this._vBuffer);
    Stage._setTC(this._tcBuffer);
    Stage._setUT(1);
    Stage._setTEX(this._texture);
    Stage._setEBF(e._unitIBuffer);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
};
this.tp = TextField.prototype;
tp.ds = tp.__defineSetter__;
tp.dg = tp.__defineGetter__;
tp.dg("textWidth", function() {
    return this._textW
});
tp.dg("textHeight", function() {
    return this._textH
});
tp.ds("wordWrap", function(e) {
    this._wordWrap = e;
    this._update()
});
tp.dg("wordWrap", function() {
    return this._wordWrap
});
tp.ds("width", function(e) {
    this._areaW = Math.max(0, e);
    this._tarea.style.width = this._areaW + "px";
    this._update()
});
tp.dg("width", function() {
    return this._areaW
});
tp.ds("height", function(e) {
    this._areaH = Math.max(0, e);
    this._tarea.style.height = this._areaH + "px";
    this._update()
});
tp.dg("height", function() {
    return this._areaH
});
tp.ds("text", function(e) {
    this._text = e + "";
    this._update()
});
tp.dg("text", function() {
    return this._text
});
tp.ds("selectable", function(e) {
    this._selectable = e;
    this._update()
});
tp.dg("selectable", function() {
    return this._selectable
});
tp.ds("type", function(e) {
    this._type = e;
    this._update()
});
tp.dg("type", function() {
    return this._type
});
tp.ds("background", function(e) {
    this._background = e;
    this._update()
});
tp.dg("background", function() {
    return this._background
});
tp.ds("border", function(e) {
    this._border = e;
    this._update()
});
tp.dg("border", function() {
    return this._border
});
delete tp.ds;
delete tp.dg;
delete this.tp
