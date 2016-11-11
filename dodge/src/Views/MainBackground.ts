//主要游戏界面的UI显示
module dodge{
    export class MainBackground extends egret.Sprite{
        private top:number;
        private bottom:number;
        private bkgTop: egret.Bitmap[];  //背景上
        private bkgBottom: egret.Bitmap[];  //背景下
        private bkgSpeed: number = 2;  //背景速度,也就是前进速度
        private texture:  egret.Texture;  //背景图
        private bkgWidth:number;
        private bkgCount:number;
        public constructor(){
            super();

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
                bgBmp.x -= this.bkgSpeed * speedOffset;
                if (bgBmp.x + this.bkgWidth < -10) {
                    bgBmp.x += this.bkgWidth * this.bkgTop.length;
                }
            }
        }


        //更新背景
        public update(speedOffset:number):void{
            this.updateBkg(this.bkgTop,speedOffset);
            this.updateBkg(this.bkgBottom,speedOffset);
        }

    }
}