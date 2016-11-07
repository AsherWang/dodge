//小鹿
module dodge {
    export class Deer extends dodge.GameObject {
        public constructor(textures: egret.Texture[]) {
            super(textures);
            this.realWidth = 70;
            this.realHeight = 100;
            this.name = "deer";
            this.triggerInvincible = true;
        }

        public effectOnPlayer(player: dodge.Player): void {
            var realHarm = player.getHurt(5,this);
            if (realHarm>0)
                console.log("deer hurt our player by " + realHarm + "HP");
        }
    }
}