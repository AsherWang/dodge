module dodge{
    export class ScoreBoard extends egret.Sprite {

        private boardName: egret.TextField;
        private btnContinue: egret.TextField;
        private board: egret.TextField;
        private recorder:dodge.Recorder;

        public constructor() {
            super();
            this.height = egret.MainContext.instance.stage.stageHeight;
            this.width = egret.MainContext.instance.stage.stageWidth;
            this.createView();
        }

        public setData(recorder:dodge.Recorder):void{
            this.recorder=recorder;
            this.board.textFlow = <Array<egret.ITextElement>>this.getResult();

            var height=this.board.height+this.btnContinue.height;
            this.board.y=(this.height-height)/2-25;
            this.btnContinue.y=this.board.y+this.board.height+50;

        }


        private createView(): void {
            this.btnContinue = new egret.TextField();
            this.addChild(this.btnContinue);
            this.btnContinue.y = this.height-50;
            this.btnContinue.textAlign = "center";
            this.btnContinue.verticalAlign = "center";
            this.btnContinue.text = "PRESS TO CONTINUE";
            this.btnContinue.width = this.width;
            this.btnContinue.anchorOffsetX = this.width / 2;
            this.btnContinue.x = this.width / 2;
            this.btnContinue.textColor = 0xffffff;
            this.blink(this.btnContinue,200);

            this.board = new egret.TextField();
            this.board.y = 50;
            this.board.textAlign = "center";
            this.board.width = this.width;
            this.addChild(this.board);


            this.btnContinue.touchEnabled = true;
            this.btnContinue.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onContinue,this);
        }


        private onContinue(evt: egret.TouchEvent) {
            var OnStartEvent: GameEvent = new GameEvent(GameEvent.Event.OnGameRestart);
            this.dispatchEvent(OnStartEvent);
        }




        private getTextField(text: string) {
            var ret: egret.TextField = new egret.TextField();
            ret.text = text;
            return ret;
        }


        //使某个控件闪烁
        private blink(obj: any, time: number): void {
            var self: any = this;
            var tw = egret.Tween.get(obj, { loop: true });
            tw.to({ "alpha": 1 }, time);
            tw.wait(1000);
            tw.to({ "alpha": 0.01 }, time / 2);
            tw.wait(500);
        }

        private getResult():any{
            this.recorder.addToTotal();
            return [
                { text: "计分板\n\n" }
                ,{ text: "时间:"+dodge.Utils.timeFormat(this.recorder.time)+"\n"}
                ,{ text: "里程:"+dodge.Utils.pxToMeter(this.recorder.distance)+"m\n" }
                ,{ text: "受伤次数:"+this.recorder.hurtTimes+"\n\n" }
                ,{ text: "总时间:"+dodge.Utils.timeFormat(this.recorder.totalTime)+"\n"}
                ,{ text: "总里程:"+dodge.Utils.pxToMeter(this.recorder.totalDistance)+"m\n" }
                ,{ text: "总受伤次数:"+this.recorder.totalHurtTimes+"\n\n" }

            ];
        }
    }
}