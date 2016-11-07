//泡泡
module dodge {
    export class Bubble extends dodge.GameObject {
        public constructor(textures: egret.Texture[]) {
            super(textures);
            this.name = "bubble";
            this.basicHarm = 1;
        }

        public afterHarm(){
            this.readyToReclaim = true;
        }
    }
}