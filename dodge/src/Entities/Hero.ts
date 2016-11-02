//Hero
module dodge {
    export class Hero extends dodge.GameObject {
        private skill1TextureList: egret.Texture[];
        private fire: number = 0;
        private skill1cd :number = 30;
        private timer: number = 0;
        public constructor(textures: egret.Texture[]) {
            super(textures);
            //this.realWidth = 70;
            //this.realHeight = 100;
            //this.speedX = 8;
            //this.speedY = 8;
            this.name = "hero";
            this.isDdbug = true;
        }

        public setSkill1Textures(textures: egret.Texture[]) {
            this.skill1TextureList = textures;
        }


        protected onAnimateTimer(evt: egret.Event) {
            super.onAnimateTimer(evt);
            if (this.fire == 0) { this.timer++; }
            if (this.timer == this.skill1cd) {
                this.fire = 1;
                this.timer = 0;
            }
            if (this.currentImgIndex == this.textureList.length - 1) {
                if (this.fire == 1) {
                    var tmp: egret.Texture[] = this.textureList;
                    this.textureList = this.skill1TextureList;
                    this.skill1TextureList = tmp;
                    this.fire = 2;
                    this.currentImgIndex=-1;
                }
                else if (this.fire==2) {
                    var tmp: egret.Texture[] = this.textureList;
                    this.textureList = this.skill1TextureList;
                    this.skill1TextureList = tmp;
                    this.currentImgIndex = this.textureList.length - 1;
                    this.fire = 0;
                } 
            }
        }

    }
}