module dodge {
    export class GameObject extends egret.DisplayObjectContainer{
        protected isDdbug: boolean = false;
        private img: egret.Bitmap;
        private animateTimer: egret.Timer;

        public MAXHP: number = 100; //血量上限
        public HP: number = 100;  //血量
        public speedX: number = 0;
        public speedY: number = 0;
        public realWidth: number;
        public realHeight: number;


        protected currentImgIndex: number = 0;  //当前显示的图片
        protected textureList: any = [];  //所有动作的图片

        public constructor(textures: egret.Texture[]) {
            super();
            this.textureList = textures;
            this.img = new egret.Bitmap(textures[0]);
            this.addChild(this.img);
            this.realHeight = this.img.height;
            this.realWidth = this.img.width;
        }

        //开始动作
        public startAnimate() {
            if (!this.animateTimer)this.animateTimer = new egret.Timer(100, 0);
            this.animateTimer.addEventListener(egret.TimerEvent.TIMER, this.onAnimateTimer, this);
            this.animateTimer.start();
        }

        //停下动作
        public stopAnimate() {
            this.animateTimer.stop();
        }


        //切换图片
        protected onAnimateTimer(evt: egret.Event) {
            this.currentImgIndex = (this.currentImgIndex + 1) % this.textureList.length;
            this.img.texture = this.textureList[this.currentImgIndex];
        }


        //更新位置
        public updatePostion(speedRate) {
            this.x += this.speedX * speedRate;
            this.y += this.speedY * speedRate;
        }

        public checkHitPoint(player: dodge.Player): void {
            var player_x1: number = player.x - player.width / 2;
            var player_y1: number  = player.y - player.height / 2;
            var player_x2: number  = player.x + player.width / 2;
            var player_y2: number = player.y + player.height / 2;
            var self_x1: number = this.x - this.realWidth / 2;
            var self_y1: number = this.y - this.realHeight / 2;

            if (this.hitPoint(player_x2, player_y1)
                || this.hitPoint(player_x2, player_y2)
                || this.hitPoint(player_x1, player_y1)
                || this.hitPoint(player_x1, player_y2)){
                this.effectOnPlayer(player);
            }
        }


        //检测一个点是不是在一个矩形内
        private hitPoint(x1, y1): boolean {
            var x2: number = this.x - this.realWidth / 2;
            var y2: number = this.y - this.realHeight / 2;
            return (x2 - x1 < 0) && (x2 + this.realWidth - x1 > 0) && (y2 - y1 < 0) && (y2 + this.realHeight - y1 > 0);
        }

        public effectOnPlayer(player: dodge.Player): void {
            console.log("撞上了");
        }

        //把自己销毁掉(假装)
        public reclaim() {
            dodge.EntityFactory.reclaim<GameObject>(this,this.name);
        }

        //如果需要回收就回收了
        public checkReclaim(width, height) {
            return (this.x + this.realWidth < -1000) || (this.x > width + 1000) || (this.y + this.realHeight < -1000) || (this.y + this.realHeight > height + 1000);
        }

    }
}