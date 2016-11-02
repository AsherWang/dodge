//Player
module dodge {
    export class Player extends dodge.GameObject {
        public constructor(textures: egret.Texture[]) {
            super(textures);
            //this.realWidth = 70;
            //this.realHeight = 100;
            this.speedX = 8;
            this.speedY = 8;
            this.name = "player";
        }
    }
}