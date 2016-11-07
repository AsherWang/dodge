//泡泡
module dodge {
    export class Bubble extends dodge.GameObject {
        public constructor(textures: egret.Texture[]) {
            super(textures);
            this.name = "bubble";
        }

        public effectOnPlayer(player: dodge.Player): void {
            var realHarm = player.getHurt(30,this);
            if (realHarm > 0)
                console.log("medicine harms our player by " + realHarm + "HP");
            this.readyToReclaim = true;
        }
    }
}