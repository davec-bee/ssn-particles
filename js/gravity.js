var Particle = function(x, y, v) {
    this.x = x || 0;
    this.y = y || 0;
    this.v = v || new Vector(0, 0);
    this.forces = []; // forces
    this.gSources = []; // gravity sources;

    var _this = this;

    function applyGravity() {
        var i = _this.gSources.length - 1;
        for (i;i>=0;i--) {
            _this.forces.push(_this.gSources[i].vector(_this));
        }
    }

    function roundV() {
        _this.v.x = Math.round(_this.v.x * 10) / 10;
        _this.v.y = Math.round(_this.v.y * 10) / 10;
    }

    function applyForces() {
        applyGravity();
        var i = _this.forces.length - 1;
        for (i;i>=0;i--) {
            _this.v = _this.v.add(_this.forces[i]);
        }
        //roundV();
        _this.forces = [];
    }

    this.addGravitySource = function (g) {
        _this.gSources.push(g);
    }

    this.addCorrectionalForce = function (f) {

    }

    this.addForce = function (f) {
        if (f.x > 0.1 || f.y > 0.1 || f.x < -0.1 || f.y < -0.1) {
            _this.forces.push(f);
        }
    }

    this.move = function () {
        applyForces();
        _this.x += _this.v.x;
        _this.y += _this.v.y;
    }
}

var CorrectionalForce = function (fPos, fV) {
    this.fPos = fPos;
    this.fV = fV;
}

var GravitySource = function (x, y, s, r) {
    this.x = x || 0;
    this.y = y || 0;
    this.strength = s || 0.2; //strengh of pull
    this.r = r || 300; //effect radius ()

    this.vector = function (p) {
        var angle = Math.atan2(this.y - p.y, this.x - p.x); // angle between particle and gravity
        var hypotenuse = Math.pow(Math.pow(this.y - p.y,2) + Math.pow(this.x - p.x,2),1/2); // distance between particle and gravity
        var relativeV = (hypotenuse < this.r) ? this.strength : this.strength * ((this.r - hypotenuse) / this.r); 
        if (relativeV <= 0) {
            return new Vector(0,0);
        } else {
            return new Vector(
                Math.cos(angle) * relativeV,
                Math.sin(angle) * relativeV);
        }
    }
}