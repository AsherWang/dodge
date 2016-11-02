//小鹿
module dodge {
    export class Deer extends dodge.GameObject {
        public constructor(textures: egret.Texture[]) {
            super(textures);
            this.realWidth = 70;
            this.realHeight = 100;
            this.name = "deer";
        }

        public effectOnPlayer(player: dodge.Player): void {
            console.log("撞上了小鹿");
        }
    }
}