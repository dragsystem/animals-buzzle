Crafty.c('Face', {
    init: function() {
        this.requires("2D");
        this.requires("Canvas");
        this.requires("FaceSprite");
        this.requires("Tween")

        var self = this;
        self.isBusy = false;

        this.bind("MovedHorizontal", function(e) {
            //console.log("MovedHorizontal x=" + e.x + ", y=" + e.y);
            self.shift(Math.floor(e.x), 0);
            self.busy();
        });

        this.bind("MovedVertical", function(e) {
            //console.log("MovedVertical x=" + e.x + ", y=" + e.y + ', ' + self.isBusy);
            self.shift(0, Math.floor(e.y));
            self.busy();
        });

        this.bind("StoppedHorizontal", function(e) {
            //console.log("Stopped x=" + e.x + ", y=" + e.y);
            self.busy();
            self.checkStop({
                x: e.x,
                y: 0
            })
        });

        this.bind("StoppedVertical", function(e) {
            //console.log("Stopped x=" + e.x + ", y=" + e.y);
            self.busy();
            self.checkStop({
                x: 0,
                y: e.y
            })
        });
    },

    getOffsetXForPrecisePosition: function () {
        var dx = Math.floor(this.x - Settings.left) % Settings.poligon;
        if (dx > Settings.poligon / 2)
            dx = dx - Settings.poligon;
        return dx;
    },

    getOffsetYForPrecisePosition: function () {
        var dy = Math.floor(this.y - Settings.top) % Settings.poligon;
        if (dy > Settings.poligon / 2)
            dy = dy - Settings.poligon;
        return dy;
    },

    checkStop: function(e) {
        var self = this;
        self.bind('TweenEnd', function() {
            self.checkBounds();
            var dx = self.getOffsetXForPrecisePosition();
            var dy = self.getOffsetYForPrecisePosition();
            if (dx != 0 || dy != 0) {
                self.tween({
                    x: Math.floor(self.x - dx),
                    y: Math.floor(self.y - dy)
                }, 2)
            } else {
                self.isBusy = false;
                Game.gameManager.update();
            }
        });
        self.tween({
            x: Math.floor(self.x + e.x),
            y: Math.floor(self.y + e.y)
        }, 10)
    },

    isNearest: function(object) {
        var self = this;
        var dx = Math.abs(self.x - object.x);
        var dy = Math.abs(self.y - object.y);
        if (dx <= Settings.poligon) {
            if (dy <= Settings.poligon) {
                if (dy < Settings.poligon/2 || dx < Settings.poligon/2) {
                    return self.animalType == object.animalType;
                }
            }
        }
        return false;
    },

    getNearest: function() {
        var result = [];
        var self = this;
        Game.objects.forEach(function(object) {
            if (self.isNearest(object)) {
                result.push(object);
            }
        });
        return result;
    },

    remove: function() {
        var obj = this;
        obj.busy();
        obj.bind('TweenEnd', function() {
            var index = Game.objects.indexOf(obj);
            if (index >= 0) {
                Game.objects.splice(index, 1);
            }
            Game.gameManager.update();
        });
        obj.tween({
            alpha: 0.0
        }, 20);
    },

    checkBounds: function () {
        if (this.x < Settings.left - Settings.poligon/2) {
            this.x += Settings.width;
        }
        if (this.x > Settings.right - Settings.poligon/2) {
            this.x -= Settings.width;
        }
        if (this.y > Settings.bottom - Settings.poligon/2) {
            this.y -= Settings.height;
        }
        if (this.y < Settings.top - Settings.poligon/2) {
            this.y += Settings.height;
        }
    },

    busy: function () {
        Game.gameManager.isBusy = true;
        this.isBusy = true;
    }
});