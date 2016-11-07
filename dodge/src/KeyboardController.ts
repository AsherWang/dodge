module dodge {
    export class KeyboardController extends egret.EventDispatcher {
        public isLeft() {
            return this.isPressed[65] || this.isPressed[37] || false;
        }
        public isRight() {
            return this.isPressed[68] || this.isPressed[39] || false;
        }
        public isUp() {
            return this.isPressed[87] || this.isPressed[38] || false;
        }
        public isDown() {
            return this.isPressed[83] || this.isPressed[40] || false;
        }

        private isPressed: Object = {};
        public onstructor() {
        }
        public listen() {
            var self = this;
            var acceptCode: Array<number> = [
                 87,// 38 //W,↑
                ,83//, 40 //S,↓
                ,65//, 37 //A,←
                ,68//, 39 //D,→
            ]; //这里配置接受的按键
            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e) {
                    if (acceptCode.indexOf(e.keyCode) >= 0) {
                        if (typeof self.isPressed[e.keyCode] == "undefined" || self.isPressed[e.keyCode]  == false) {
                            self.isPressed[e.keyCode] = true;
                            //var onKeyDownEvent: GameEvent = new GameEvent(GameEvent.Event.OnKeyDown);
                            //onKeyDownEvent.msg = e.keyCode;
                            //self.dispatchEvent(onKeyDownEvent);
                        }
                    }
                }
               
            };

            document.onkeyup = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e) {
                    if (acceptCode.indexOf(e.keyCode) >= 0) {
                            self.isPressed[e.keyCode] = false;
                            //var onKeyUpEvent: GameEvent = new GameEvent(GameEvent.Event.OnKeyUp);
                            //onKeyUpEvent.msg = e.keyCode;
                            //self.dispatchEvent(onKeyUpEvent);
                    }
                }
            }; 
        }


    }
}
