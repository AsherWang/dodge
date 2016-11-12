//游戏的欢迎界面

//包括游戏名字,开始游戏的按钮,以及游戏计分板的入口
module dodge{
    export class WelcomeScene extends egret.Sprite {
        private gameName: egret.TextField; //绘制游戏名称的控件
        private btnStart: egret.TextField; //绘制游戏开始按钮的控件
        

        public constructor() {
            super();
            this.createView();
        }



        private createView(): void {
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
            this.btnStart.text = "PRESS START";
            this.btnStart.textAlign = "center";
            this.btnStart.verticalAlign = "center";
            this.btnStart.width = 480;

            //闪烁
            this.blink(this.btnStart, 200);

            //为开始游戏按钮绑定事件
            this.btnStart.touchEnabled = true;
            this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnGameStart,this);

        }

        //使某个控件闪烁
        private blink(obj: any, time: number):void {
            var self: any = this;
            var tw = egret.Tween.get(obj, { loop: true });
            tw.to({ "alpha": 1 }, time);
            tw.wait(1000);
            tw.to({ "alpha": 0.01 }, time/2);
            tw.wait(500);
        }

        //分发消息,下通知说游戏已经开始
        private OnGameStart(evt: egret.TouchEvent) {
            var OnStartEvent: GameEvent = new GameEvent(GameEvent.Event.OnGameStart);
            this.dispatchEvent(OnStartEvent);
        }

    }
}