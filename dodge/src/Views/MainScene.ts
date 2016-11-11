//游戏的主要操作界面
module dodge{
    export class MainScene extends egret.Sprite {
        private time: number=0; //当局游戏时间
        private distance:number=0; //前进的米数,主要指画面滚动的距离
        

        private player: dodge.Player; //玩家
        private enemies: dodge.GameObject[]=[];  //障碍
        private bkg:dodge.MainBackground; //背景

        private keyboardController: dodge.KeyboardController;  //键盘控制器
        private _lastTime: any = 0;

        private mainUI:dodge.MainUI; //UI
        private map:dodge.MapReader; //地图


        //这俩值是为了使用游戏高度不同而做的调整
        //游戏的宽度没什么问题,但是高度上应该有限制,目前定为50*10 也就是500px,这样出障碍物的时候可以根据格子的形式来计算合不合适
        // top 和 bottom相差500,然后上下对称,两边则用贴图覆盖
        public static battleHeighgt:number=500;
        public static rectSize=50;
        private static bkgSpeed: number = 2;  //背景速度,也就是前进速度
        private static speedLevel:number=1;

        //获取当前卷屏速度
        public static getSpeed():number{ 
            return MainScene.bkgSpeed * (1+MainScene.speedLevel*4);
        }
        private top:number; 
        private bottom:number;
        
        

        public constructor() {
            super();
            this.createView();
        }

        private upgradeSpeed():void{
            if(this.distance>200*MainScene.speedLevel){
                MainScene.speedLevel++;
                console.log("speed up:"+MainScene.speedLevel);
            }
        }

        private createView(): void {
            
            //将宽高设置成与屏幕相同
            this.height = egret.MainContext.instance.stage.stageHeight;
            this.width = egret.MainContext.instance.stage.stageWidth;
            this.top=(this.height-MainScene.battleHeighgt)/2;
            this.bottom=this.top+MainScene.battleHeighgt;

            //创建背景
            this.bkg=new dodge.MainBackground();
            this.addChild(this.bkg);

            //创建玩家
            var playerRes: egret.Texture[] = [
                RES.getRes("player_flappybird_1"),
                RES.getRes("player_flappybird_2"),
                RES.getRes("player_flappybird_3")
            ];
            this.player = new dodge.Player(playerRes);
            
            this.addChild(this.player);

            //创建地图
            this.map=new dodge.MapReader();

            //怪物工厂初始化
            dodge.EntityFactory.init();
            
            //UI界面
            this.mainUI=new dodge.MainUI();
            this.addChild(this.mainUI);

            //键盘控制
            this.keyboardController = new dodge.KeyboardController();
            this.keyboardController.listen();
        }

        private Reiniti() {
            //遍历回收所有怪物
            for (var i: number = 0; i < this.enemies.length; i++) {
                var enemy: dodge.GameObject = this.enemies[i];
                enemy.reclaim();
                this.removeChild(enemy);
            }
            this.enemies = [];

            this.player.y = this.height / 2;
            this.player.x = this.width / 2 - this.player.width / 2;
            this.player.HP = this.player.MAXHP;
            this.time = 0;
            MainScene.speedLevel=1;

            this.map.init();
            this.map.setMap("level1");

        }

        private onPause(evt: egret.TouchEvent) {
            this.stopAllAnimation();
        }


        private stopAllAnimation() {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
            this.enemies.forEach((item) => { item.stopAnimate(); });
            this.player.stopAnimate();
        }

        private startAllAnimation() {
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
            this.enemies.forEach((item) => { item.startAnimate(); });
            this.player.startAnimate();
        }

        //随机产生一个怪物
        private putAnEnemy() {
            dodge.Utils.getRandomElement([this.putADeer, this.putAHubble, this.putAMedicine]).apply(this);
        }


        //放一只小鹿
        private putADeer() {
            var deer = dodge.EntityFactory.produce<dodge.Deer>(dodge.Deer, "deer");
            deer.y = dodge.Utils.getRandomValue(this.height, 6) - deer.realHeight/2;
            deer.x = this.width + 300;
            deer.anchorOffsetX = deer.width / 2;
            deer.anchorOffsetY = deer.height / 2;
            deer.speedX = -4;
            this.addChildAt(deer,1); //在背景之上
            this.enemies.push(deer);
            deer.startAnimate();
        }

        private putAHubble() {
            var hubble = dodge.EntityFactory.produce<dodge.Bubble>(dodge.Bubble, "bubble");
            hubble.y = dodge.Utils.getRandomValue(this.height, 6) -hubble.realHeight/2;
            hubble.x = this.width + 300;
            hubble.anchorOffsetX = hubble.width / 2;
            hubble.anchorOffsetY = hubble.height / 2;
            hubble.speedX = -3;
            this.addChildAt(hubble, 1);
            this.enemies.push(hubble);
        }

        private putAMedicine() {
            var med = dodge.EntityFactory.produce<dodge.Medicine>(dodge.Medicine, "medicine");
            med.y =dodge.Utils.getRandomValue(this.height, 6) -med.realHeight/2;
            med.x = this.width + 300;
            med.anchorOffsetX = med.width / 2;
            med.anchorOffsetY = med.height / 2;
            med.speedX = -2;
            this.addChildAt(med, 1);
            this.enemies.push(med);
            //med.startAnimate(); //因为药品的资源只有一个所以没必要开计时器了
        }

        //分发消息,下通知说游戏已经结束
        private gameOver() {
            this.stopAllAnimation();
            
            var OnOverEvent:GameEvent = new GameEvent(GameEvent.Event.OnGameOver);
            this.dispatchEvent(OnOverEvent);
        }


        //开始运行游戏
        public run() {
            this.Reiniti();
            this.startAllAnimation();
            this.distance=0;
            this.mainUI.init();
        }


        //每帧更新画面,并且计算碰撞和回收跑出屏幕外的东西
        //30帧,每帧大概走2,那就是60
        private enterFrame(evt: egret.Event) {

            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime: number = egret.getTimer();
            var fps: number = 1000 / (nowTime - this._lastTime);
            this._lastTime = nowTime;
            var speedOffset: number = 30 / fps;

            this.distance+=MainScene.getSpeed()*speedOffset;
            this.mainUI.setDistance(this.distance);

            //控制部分需要重构不过暂时不动
            if (this.keyboardController.isUp()) {
                this.player.y -= speedOffset * this.player.speedY;
                if(this.player.y<this.top)this.player.y = this.top;
            }
            if (this.keyboardController.isDown()) {
                this.player.y += speedOffset * this.player.speedY;
                if (this.player.y + this.player.height > this.bottom) this.player.y = this.bottom - this.player.height;
            }
            if (this.keyboardController.isLeft()) {
                this.player.x -= speedOffset * this.player.speedX;
                if (this.player.x < 0) this.player.x = 0;
            }
            if (this.keyboardController.isRight()) {
                this.player.x += speedOffset * this.player.speedX;
                if (this.player.x + this.player.width > this.width) this.player.x = this.width - this.player.width;
            }

            this.bkg.update(speedOffset);


            //遍历所有怪物,更新位置并检测碰撞
            for (var i: number = 0; i < this.enemies.length; i++) {
                var enemy: dodge.GameObject = this.enemies[i];
                enemy.updatePostion(speedOffset);  //更新位置

                if(enemy.checkHitPoint(this.player)){  //检测碰撞
                    // enemy.effectOnPlayer(this.player); //如果碰到了,进行伤害结算
                    dodge.HarmCalculator.calculate(enemy,this.player,enemy.getHarm());
                }


                if (enemy.checkReclaim(this.width, this.height)) { //检测是否需要回收
                    enemy.reclaim();
                    this.removeChild(enemy);
                    this.enemies.splice(i, 1);
                    i--;
                }
            }

            //检查是否死亡了
            if (this.player.HP <= 0) {
                this.gameOver();
            }
            
            this.mainUI.setHP(this.player.HP);
            this.putMonsters();

        }


        private parseOrbit(orbit:any):void{
            var endDistance:number=0;
            var newEndDistance:number;
            for(var index=0;index<orbit.positions.length;++index){
                //天哪,这里不就是反射么,好吧其实不是
                var className=dodge.EntityFactory.Enemies[orbit.name];
                var newMonster:dodge.GameObject = dodge.EntityFactory.produce<dodge.GameObject>(className, orbit.name);

                var offsetX=orbit.positions[index][0]*MainScene.rectSize;
                newMonster.x=offsetX+this.width+20;
                newMonster.y=orbit.positions[index][1]*MainScene.rectSize+this.top;
                
                newMonster.speedX= - MainScene.getSpeed();
                this.addChildAt(newMonster,1);
                this.enemies.push(newMonster);

                //找到这个orbit最远结束的地方
                newEndDistance=this.distance+offsetX+newMonster.getWidth();
                if(endDistance<newEndDistance)endDistance=newEndDistance;
                // console.log("add a monster at point ("+newMonster.x+","+newMonster.y+")");
                // newMonster.startAnimate();
            }
            this.map.setEndDistance(endDistance);
        }

        //根据当前前进的距离决定是否刷怪
        private putMonsters():void{
            if(!this.map.isEnd()){
                console.log("地图还没完");
                var orbit=this.map.query(this.distance); //询问地图该不该刷怪
                if(orbit.positions){  //开始刷怪
                    this.parseOrbit(orbit);
                }else if(orbit==-1){ //再等等才会有
                    //pass
                }
            }else{
                console.log("尝试获取随机地图");
                var orbit=this.map.getRandomOrbit(this.distance);
                 if(orbit.positions){  //开始刷怪
                     console.log("done");
                    this.parseOrbit(orbit);
                }else if(orbit==-1){
                    console.log("wait");
                }
            }
            
        }

    }
}
