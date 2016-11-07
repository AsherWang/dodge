//药物
module dodge {
    export class Medicine extends dodge.GameObject {
        public constructor(textures: egret.Texture[]) {
            super(textures);
            this.name = "medicine";
            this.basicHarm =-1; //加1血
        }


        public afterHarm(){
            this.readyToReclaim = true;
        }
    }
}