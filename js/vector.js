var Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
}

Vector.prototype.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
}

Vector.prototype.scale = function(v) {
    return new Vector(this.x * v, this.y * v);
}

Vector.prototype.length = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

Vector.prototype.normalize = function() {
    var iLen = 1 / this.length();
    return new Vector(this.x * iLen, this.y * iLen);
}

Vector.prototype.rotate = function (a) {
    return new Vector(
        this.x * Math.cos(a) - this.y * Math.sin(a),
        this.x * Math.sin(a) + this.y * Math.cos(a));
}