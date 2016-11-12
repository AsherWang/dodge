//主要游戏界面的UI显示
module dodge{
    export class MainBackground extends egret.Sprite{
        private top:number;
        private bottom:number;

        private milestones:egret.TextField[];
        private milestoneInterval:number=1000;
        private milestonesCount:number;
        private milesOffset:number;

        private bkgTop: egret.Bitmap[];  //背景上
        private bkgBottom: egret.Bitmap[];  //背景下
        private texture:  egret.Texture;  //背景图
        private bkgWidth:number;
        private bkgCount:number;

        private recorder:dodge.Recorder;
        public constructor(recorder:dodge.Recorder){
            super();

            this.recorder=recorder;
            this.height = egret.MainContext.instance.stage.stageHeight;
            this.width = egret.MainContext.instance.stage.stageWidth;
            this.top=(this.height-MainScene.battleHeighgt)/2;
            this.bottom=this.top+MainScene.battleHeighgt;

            this.texture= RES.getRes("border");
            this.bkgWidth=this.texture.textureWidth * 3;
            this.bkgCount = Math.ceil(this.width / this.bkgWidth) + 2;//计算在当前屏幕中，需要的图片数量
            this.bkgTop = [];
            this.bkgBottom = [];
            this.initBkg(this.bkgTop,true);
            this.initBkg(this.bkgBottom,false);

            this.milestones=[];
            this.milestonesCount= Math.ceil(this.width / this.milestoneInterval) + 2;
            for(var index:number=0;index<this.milestonesCount;++index){
                var milestone:egret.TextField=new egret.TextField();
                milestone.text="↓"+dodge.Utils.pxToMeter(this.milestoneInterval*index,0)+"m";
                milestone.textAlign=egret.HorizontalAlign.LEFT;
                milestone.x=this.milestoneInterval*index;
                milestone.anchorOffsetY=milestone.height;
                milestone.y=this.top;
                this.addChild(milestone);
                this.milestones.push(milestone);
                milestone.size=20;
            }
            this.milesOffset=this.milestoneInterval * this.milestonesCount/10;
        }

        private initBkg(bkgs: egret.Bitmap[],isTop:boolean){
         for (var i: number = 0; i < this.bkgCount; i++) {
                var bgBmp: egret.Bitmap = new egret.Bitmap(this.texture);
                bgBmp.width=this.bkgWidth;
                bgBmp.y = isTop ? 0 :this.bottom;
                bgBmp.x = this.bkgWidth * i;
                bgBmp.height=this.top; //会自动拉伸么
                bgBmp.fillMode=egret.BitmapFillMode.REPEAT;
                bkgs.push(bgBmp);
                this.addChild(bgBmp);
            }
        }
        private updateBkg(bkgs: egret.Bitmap[],speedOffset:number):void{
            for (var i: number = 0; i < bkgs.length; i++) {
                var bgBmp: egret.Bitmap = bkgs[i];
                bgBmp.x -= this.recorder.getSpeed() * speedOffset;
                if (bgBmp.x + this.bkgWidth < -10) {
                    bgBmp.x += this.bkgWidth * this.bkgTop.length;
                }
            }
        }


        public init():void{
            for(var index:number=0;index<this.milestonesCount;++index){
                var milestone:egret.TextField=this.milestones[index];
                milestone.text="↓"+dodge.Utils.pxToMeter(this.milestoneInterval*index,0)+"m";
                milestone.x=this.milestoneInterval*index;
            }
        }

        //更新背景
        public update(speedOffset:number):void{
             this.updateBkg(this.bkgTop,speedOffset);
            this.updateBkg(this.bkgBottom,speedOffset);

            for(var index:number=0;index<this.milestonesCount;++index){
                var milestone=this.milestones[index];
                milestone.x -= this.recorder.getSpeed() * speedOffset;
                if (milestone.x + milestone.width < -10) { //如果出屏幕了,就去最右边当路牌

                    var newDistance=Number(milestone.text.slice(1,-1)) + this.milesOffset;
                   
                    milestone.x =  milestone.x + this.milestoneInterval * this.milestonesCount;
                    milestone.text="|"+newDistance+"m";
                }
            }

        }

    }
}