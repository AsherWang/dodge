//Block
module dodge {
    export class Block extends dodge.GameObject {
        public constructor(textures: egret.Texture[]) {
            super(textures);
            this.name = "block";
            this.basicHarm = 1;
        }

        public afterHarm(){
            this.readyToReclaim = true;
        }
    }
}