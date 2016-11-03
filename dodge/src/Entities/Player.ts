﻿//Player
module dodge {
    export class Player extends dodge.GameObject {
        private timeHurt: number=2; //受伤之后短暂无敌秒数
        private isInvincible: boolean = false;
        private timer: egret.Timer;
        public constructor(textures: egret.Texture[]) {
            super(textures);
            //this.realWidth = 70;
            //this.realHeight = 100;
            this.speedX = 8;
            this.speedY = 8;
            this.name = "player";
            this.timer = new egret.Timer(this.timeHurt*1000);
        }

        //治疗
        public getHealed(recover: number): number {
            this.HP += recover;
            if (this.HP > this.MAXHP) this.HP = this.MAXHP;
            this.isInvincible = true;
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            this.timer.start();
           
            return recover;
        }

        //如果受伤了则返回掉血量
        public getHurt(harm: number): number {
            var ret: number = 0;
            if (!this.isInvincible){
                this.HP -= harm;
                ret = harm;
                this.isInvincible = true;
                this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                this.timer.start();
            }
            return ret;
        }

        private onTimer(evt: egret.Event) {
            this.isInvincible = false;
        }
    }
}