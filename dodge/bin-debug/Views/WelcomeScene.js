//游戏的欢迎界面
//包括游戏名字,开始游戏的按钮,以及游戏计分板的入口
var WelcomeScene = (function (_super) {
    __extends(WelcomeScene, _super);
    function WelcomeScene() {
        _super.call(this);
        this.createView();
    }
    var d = __define,c=WelcomeScene,p=c.prototype;
    p.createView = function () {
        this.gameName = new egret.TextField();
        this.addChild(this.gameName);
        this.gameName.y = 50;
        this.gameName.width = 480;
        this.gameName.size = 80;
        this.gameName.height = 100;
        this.gameName.textAlign = "center";
        this.gameName.verticalAlign = "center";
        this.gameName.text = "dodge";
        this.gameName.textColor = 0xffffff;
        this.btnStart = new egret.TextField();
        this.addChild(this.btnStart);
        this.btnStart.y = 200;
        this.btnStart.text = "PUSH START";
        this.btnStart.textAlign = "center";
        this.btnStart.verticalAlign = "center";
        this.btnStart.width = 480;
        //闪烁
        this.blink(this.btnStart, 200);
        //为开始游戏按钮绑定事件
        this.btnStart.touchEnabled = true;
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnGameStart, this);
    };
    //使某个控件闪烁
    p.blink = function (obj, time) {
        var self = this;
        var tw = egret.Tween.get(obj, { loop: true });
        tw.to({ "alpha": 1 }, time);
        tw.wait(1000);
        tw.to({ "alpha": 0.01 }, time / 2);
        tw.wait(500);
    };
    //分发消息,下通知说游戏已经开始
    p.OnGameStart = function (evt) {
        var OnStartEvent = new GameEvent(GameEvent.Event.OnGameStart);
        this.dispatchEvent(OnStartEvent);
    };
    return WelcomeScene;
}(egret.Sprite));
egret.registerClass(WelcomeScene,'WelcomeScene');
//# sourceMappingURL=WelcomeScene.js.map