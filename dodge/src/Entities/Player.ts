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
            
            this.HP=6;
            this.MAXHP=6;
        }

        //治疗
        public getHealed(recover: number, sender: dodge.GameObject): number {
            var ret: number = 0;
            if (this.HP + recover > this.MAXHP) {
                ret = this.MAXHP - this.HP;
                this.HP = this.MAXHP;
            } else {
                this.HP += recover;
                ret = recover;
            }
            //if (!this.isInvincible && sender.triggerInvincible) {
            //    this.isInvincible = true;
            //    this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            //    this.timer.start();
            //}
            return recover;
        }


    }
}