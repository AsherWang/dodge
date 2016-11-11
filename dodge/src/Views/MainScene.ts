//游戏的主要操作界面
module dodge{
    export class MainScene extends egret.Sprite {
        private player: dodge.Player; //玩家
        private enemies: dodge.GameObject[]=[];  //障碍
        private bkg:dodge.MainBackground; //背景

        private keyboardController: dodge.KeyboardController;  //键盘控制器
        private _lastTime: any = 0;

        private mainUI:dodge.MainUI; //UI
        private map:dodge.MapReader; //地图
        private recorder:dodge.Recorder; //记录

        //这俩值是为了使用游戏高度不同而做的调整
        //游戏的宽度没什么问题,但是高度上应该有限制,目前定为50*10 也就是500px,这样出障碍物的时候可以根据格子的形式来计算合不合适
        // top 和 bottom相差500,然后上下对称,两边则用贴图覆盖
        public static battleHeighgt:number=500;
        public static rectSize=50;
        private static bkgSpeed: number = 4;  //背景速度,也就是前进速度
        private static speedLevel:number=1;

        //获取当前卷屏速度
        public static getSpeed():number{ 
            return MainScene.bkgSpeed * (1+MainScene.speedLevel*0.8);
        }

        public static getSpeedRate():number{
            return [0,
                2,5,8,12,23,34,40
            ][MainScene.speedLevel];
        }
        private top:number; 
        private bottom:number;
        
        

        public constructor() {
            super();
            this.createView();
        }

        private upgradeSpeed():void{
            if(MainScene.speedLevel>=7)return;
            if(this.recorder.distance>200*MainScene.speedLevel){
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
            
             //记录
            this.recorder = new dodge.Recorder(); 

            //UI界面
            this.mainUI=new dodge.MainUI(this.recorder);
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
            MainScene.speedLevel=1;

            this.map.init();
            this.map.setMap("level1");
            
            this.recorder.init();
            this.mainUI.init();
            this.startAllAnimation();

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


        //分发消息,下通知说游戏已经结束
        private gameOver() {
            this.stopAllAnimation();
            
            var OnOverEvent:GameEvent = new GameEvent(GameEvent.Event.OnGameOver);
            OnOverEvent.msg=this.recorder; //把游戏记录传过去
            this.dispatchEvent(OnOverEvent);
        }


        //开始运行游戏
        public run() {
            this.Reiniti();
        }


        //每帧更新画面,并且计算碰撞和回收跑出屏幕外的东西
        //30帧,每帧大概走2,那就是60
        private enterFrame(evt: egret.Event) {

            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime: number = egret.getTimer();
            var fps: number = 1000 / (nowTime - this._lastTime);
            this._lastTime = nowTime;
            var speedOffset: number = 30 / fps;

            speedOffset = 1;

            this.recorder.distance+=MainScene.getSpeed()*speedOffset;
            this.mainUI.setDistance(this.recorder.distance);

            //控制部分需要重构不过暂时不动
            var tmpRate:number=MainScene.getSpeedRate()*speedOffset;
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

            this.bkg.update(tmpRate);


            //遍历所有怪物,更新位置并检测碰撞
            for (var i: number = 0; i < this.enemies.length; i++) {
                var enemy: dodge.GameObject = this.enemies[i];
                enemy.updatePostion(tmpRate);  //更新位置

                if(enemy.checkHitPoint(this.player)){  //检测碰撞
                    // enemy.effectOnPlayer(this.player); //如果碰到了,进行伤害结算
                    dodge.HarmCalculator.calculate(enemy,this.player,enemy.getHarm(),this.recorder);
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
                newEndDistance=this.recorder.distance+offsetX+newMonster.getWidth();
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
                var orbit=this.map.query(this.recorder.distance); //询问地图该不该刷怪
                if(orbit.positions){  //开始刷怪
                    this.parseOrbit(orbit);
                }else if(orbit==-1){ //再等等才会有
                    //pass
                }
            }else{
                console.log("尝试获取随机地图");
                var orbit=this.map.getRandomOrbit(this.recorder.distance);
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
