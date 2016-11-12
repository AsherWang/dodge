//主要游戏界面的UI显示
module dodge{
    export class MainUI extends egret.Sprite{
        private MAX_HP=10;
        private hearts:egret.Bitmap[];
        private heartTexture:egret.Texture;

        private timer: egret.Timer;  //计时器,读秒
        private timeSeconds:number;  //游戏时间/s
        private timeSign: egret.TextField;  //显示时间的控件


        private btnPause: egret.Bitmap;  //暂停按钮
        private distance: egret.TextField;  //里程数


        private masktest:egret.Sprite;
        private top:number; 
        private bottom:number;

        private recorder:dodge.Recorder;

        public constructor(recorder:dodge.Recorder){
            super();
            this.height = egret.MainContext.instance.stage.stageHeight;
            this.width = egret.MainContext.instance.stage.stageWidth;
            this.top=(this.height-MainScene.battleHeighgt)/2;
            this.bottom=this.top+MainScene.battleHeighgt;

            //里程数
            this.distance=new egret.TextField();
            this.distance.text="0.00";
            this.distance.x=5;
            this.distance.y=5;
            this.addChild(this.distance);

            //显示时间
            this.timeSign = new egret.TextField();
            this.timeSign.text = "00:00";
            this.timeSign.x = this.width - 5;
            // this.timeSign.y = this.top/2;
            this.timeSign.y=5;
            this.timeSign.anchorOffsetX = this.timeSign.width;
            // this.timeSign.anchorOffsetY  = this.timeSign.height/2;
            this.addChild(this.timeSign);


            //血量
            this.heartTexture=RES.getRes("heart");
            this.hearts=[];
            for(var index=0;index<this.MAX_HP;index++){
                var heart=new egret.Bitmap(this.heartTexture);
                this.addChild(heart);
                heart.width=30;
                heart.height=30;
                heart.anchorOffsetY=heart.height;
                heart.x=index*heart.width*1.1 + 5;
                // heart.y=this.height-this.top/2;
                heart.y=this.height-5;
                this.hearts.push(heart);
            }

            //暂停按钮
            this.btnPause = new egret.Bitmap(RES.getRes("btn_pause"));
            this.btnPause.x = 10;
            this.btnPause.y = 10;
            this.btnPause.pixelHitTest = true;
            this.timer = new egret.Timer(1000, 0);
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            this.recorder=recorder;
        }

        //初始化
        public init():void{
            this.timeSeconds=0;
            this.distance.text="0.00";
            this.timeSign.text = "00:00";
            this.resume();
        }

        //恢复计时
        public resume():void{
            this.timer.start();
        }
        

        //停止计时
        public stop():void{
            this.timer.stop();
        }

        public setHP(hp:number):void{
            for(var index=0;index<this.MAX_HP;index++){
                this.hearts[index].visible=index<hp;
            }
        }


        //所以大概每10像素是1米
        public setDistance(distance:number):void{
            this.distance.text=dodge.Utils.pxToMeter(distance)+"m";
            // this.distance.text=distance/10+"m";
            
        }

        private onTimer(evt: egret.TimerEvent) {
            this.timeSeconds++;
            this.timeSign.text = dodge.Utils.timeFormat(this.timeSeconds);
            this.recorder.time=this.timeSeconds;
        }
    }
}