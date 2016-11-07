//小鹿
module dodge {
    export class Deer extends dodge.GameObject {
        
        public constructor(textures: egret.Texture[]) {
            super(textures);
            this.realWidth = 70;
            this.realHeight = 100;
            this.name = "deer";
            this.triggerInvincible = true;
            this.basicHarm=1; 
        }
    }
}