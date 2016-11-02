var dodge;
(function (dodge) {
    var KeyboardController = (function (_super) {
        __extends(KeyboardController, _super);
        function KeyboardController() {
            _super.apply(this, arguments);
            this.isPressed = {};
        }
        var d = __define,c=KeyboardController,p=c.prototype;
        p.isLeft = function () {
            return this.isPressed[65] || this.isPressed[37] || false;
        };
        p.isRight = function () {
            return this.isPressed[68] || this.isPressed[39] || false;
        };
        p.isUp = function () {
            return this.isPressed[87] || this.isPressed[38] || false;
        };
        p.isDown = function () {
            return this.isPressed[83] || this.isPressed[40] || false;
        };
        p.onstructor = function () {
        };
        p.listen = function () {
            var self = this;
            var acceptCode = [
                87, 38 //W,↑
                ,
                83, 40 //S,↓
                ,
                65, 37 //A,←
                ,
                68, 39 //D,→
            ]; //这里配置接受的按键
            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e) {
                    if (acceptCode.indexOf(e.keyCode) >= 0) {
                        if (typeof self.isPressed[e.keyCode] == "undefined" || self.isPressed[e.keyCode] == false) {
                            self.isPressed[e.keyCode] = true;
                        }
                    }
                }
            };
            document.onkeyup = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e) {
                    if (acceptCode.indexOf(e.keyCode) >= 0) {
                        self.isPressed[e.keyCode] = false;
                    }
                }
            };
        };
        return KeyboardController;
    }(egret.EventDispatcher));
    dodge.KeyboardController = KeyboardController;
    egret.registerClass(KeyboardController,'dodge.KeyboardController');
})(dodge || (dodge = {}));
//# sourceMappingURL=KeyboardController.js.map