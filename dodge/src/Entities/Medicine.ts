//药物
module dodge {
    export class Medicine extends dodge.GameObject {
        public constructor(textures: egret.Texture[]) {
            super(textures);
            this.name = "medicine";
        }

        public effectOnPlayer(player: dodge.Player): void {
            var realRecovery  = player.getHealed(20,this);
            if (realRecovery > 0)
                console.log("medicine heals our player by " + realRecovery + "HP");
            this.readyToReclaim = true;
        }
    }
}