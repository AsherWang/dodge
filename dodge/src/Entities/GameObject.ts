module dodge {
    export class GameObject extends egret.DisplayObjectContainer{
        protected isDdbug: boolean = false;
        private img: egret.Bitmap;
        private animateTimer: egret.Timer;


        public MAXHP: number = 100; //血量上限
        public HP: number = 100;  //血量
        public basicHarm:number = 0; //基础伤害


        public speedX: number = 0;
        public speedY: number = 0;
        public realWidth: number;
        public realHeight: number;



        public triggerInvincible: boolean = false;
        public isInvincible: boolean = false;
        protected timeHurt: number=1; //受伤之后短暂无敌秒数
        protected timer: egret.Timer;

        protected readyToReclaim: boolean = false;
        protected currentImgIndex: number = 0;  //当前显示的图片
        protected textureList: any = [];  //所有动作的图片

        protected twSpin:egret.Tween;//缓动动画

        public constructor(textures: egret.Texture[]) {
            super();
            this.textureList = textures;
            this.img = new egret.Bitmap(textures[0]);
            this.addChild(this.img);
            this.realHeight = this.img.height;
            this.realWidth = this.img.width;
            this.anchorOffsetX=this.width/2;
            this.anchorOffsetY=this.height/2;
            this.timer = new egret.Timer(this.timeHurt*1000);
        }

        public getWidth():number{
            return this.img.width;
        }

        public getHeight():number{
            return this.img.height;
        }

        //转起来,每duration毫秒转一圈
        public spin(duration:number=1000,loop:boolean=true):void{
            if(!this.twSpin){
                this.twSpin = egret.Tween.get(this,{loop:loop});
                this.twSpin.to( {rotation:360}, duration);
            }    
        }

        public stopSpin():void{
            if(this.twSpin){
                egret.Tween.removeTweens(this);
            }
        }

        //开始动作
        public startAnimate() {
            if(this.textureList.length<=1)return;
            if (!this.animateTimer)this.animateTimer = new egret.Timer(100, 0);
            this.animateTimer.addEventListener(egret.TimerEvent.TIMER, this.onAnimateTimer, this);
            this.animateTimer.start();
        }

        //停下动作
        public stopAnimate() {
            if (this.animateTimer)this.animateTimer.stop();
        }


        //切换图片
        protected onAnimateTimer(evt: egret.Event) {
            this.currentImgIndex = (this.currentImgIndex + 1) % this.textureList.length;
            this.img.texture = this.textureList[this.currentImgIndex];
        }


        //更新位置
        public updatePostion(speedRate:number) {
            this.x += this.speedX * speedRate;
            this.y += this.speedY * speedRate;
        }

        public checkHitPoint(player: dodge.Player): boolean {
            var player_x1: number = player.x - player.realWidth/2;
            var player_y1: number  = player.y - player.realHeight/2;
            var player_x2: number  = player.x + player.realWidth/2;
            var player_y2: number = player.y + player.realHeight/2;
            return this.hitPoint(player_x2, player_y1)
                || this.hitPoint(player_x2, player_y2)
                || this.hitPoint(player_x1, player_y1)
                || this.hitPoint(player_x1, player_y2);
                
        }


        //检测一个点是不是在一个矩形内
        private hitPoint(x1, y1): boolean {
            var x2: number = this.x + this.realWidth/2;
            var y2: number = this.y + this.realHeight/2;
            return (x1 > this.x - this.realWidth/2) && (x1 < x2) && (y1 > this.y - this.realHeight/2) && (y1 < y2);
        }

        public effectOnPlayer(player: dodge.Player): void {
            console.log("撞上了");
        }

        //将要对某系东西造成伤害,所以获取伤害这个对象
        public getHarm():dodge.Harm{
            return new dodge.CommonHarm(this.basicHarm);
        }

        public afterHarm(harm:dodge.Harm):void{
            //伤害别人之后的事情
        }

        public afterHuet(harm:dodge.Harm):void{
            //受到伤害之后的事情
        }

        //受伤了,返回掉血量
        public getHurt(harm: number, sender: dodge.GameObject): number {
            var ret: number = 0;

            if (!this.isInvincible || harm < 0) {  //如果是治疗就不免疫了
                this.HP -= harm;
                this.correctHP();
                ret = harm;
                if (sender.triggerInvincible && harm > 0) {  //治疗触发什么免疫
                    this.isInvincible = true;
                    if(!this.timer)this.timer=new egret.Timer(this.timeHurt*1000);
                    this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                    this.timer.start();
                }
            }
            return ret;
        }

        //无敌时间到
        private onTimer(evt: egret.Event) {
            this.isInvincible = false;
            this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        }


        //修正HP的值,低于0就0,高于Max就Max
        private correctHP(){
            if(this.HP>this.MAXHP){
                this.HP=this.MAXHP;
            }
            if(this.HP<0){
                this.HP=0;
            }
        }

        //把自己销毁掉(假装)
        public reclaim() {
            dodge.EntityFactory.reclaim<GameObject>(this, this.name);
            this.readyToReclaim = false;  //下次从对象池里边取出来的时候这个得是false才行,不然刚出来就被ReClaim掉了
        }

        //如果需要回收就回收了
        //障碍物基本都是从右边过来的,所以对x的上限放宽一些,不然刚出来就会被回收掉吧
        public checkReclaim(width, height) {
            return this.readyToReclaim || (this.x + this.realWidth < -1000) || (this.x > width + 4000) || (this.y + this.realHeight < -1000) || (this.y + this.realHeight > height + 1000);
        }

    }
}