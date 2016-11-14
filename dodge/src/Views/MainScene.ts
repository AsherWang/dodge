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
        // private static bkgSpeed: number = 2;  //背景速度,也就是前进速度
        // private static speedLevel:number=1;

        private top:number; 
        private bottom:number;
        
        

        public constructor() {
            super();
            this.createView();
        }


        private createView(): void {
            
            //将宽高设置成与屏幕相同
            this.height = egret.MainContext.instance.stage.stageHeight;
            this.width = egret.MainContext.instance.stage.stageWidth;
            this.top=(this.height-MainScene.battleHeighgt)/2;
            this.bottom=this.top+MainScene.battleHeighgt;

            //记录
            this.recorder = new dodge.Recorder(); 

            //创建背景
            this.bkg=new dodge.MainBackground(this.recorder);
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

            this.map.init();
            this.map.setMap("level1");
            
            this.recorder.init();
            this.mainUI.init();
            this.bkg.init();
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
            var tmpRate:number=this.recorder.getSpeedRate()*speedOffset;
            // speedOffset = 1;

            this.recorder.distance+=this.recorder.getSpeed()*tmpRate;
            this.mainUI.setDistance(this.recorder.distance);
        

            //控制部分需要重构不过暂时不动
            
            if (this.keyboardController.isUp()) {
                this.player.y -= speedOffset * this.player.speedY;
                if(this.player.y<this.top+this.player.height/2)this.player.y = this.top+this.player.height/2;
            }
            if (this.keyboardController.isDown()) {
                this.player.y += speedOffset * this.player.speedY;
                if (this.player.y + this.player.height/2 > this.bottom) this.player.y = this.bottom - this.player.height/2;
            }
            if (this.keyboardController.isLeft()) {
                this.player.x -= speedOffset * this.player.speedX;
                if (this.player.x < this.player.width/2) this.player.x = this.player.width/2;
            }
            if (this.keyboardController.isRight()) {
                this.player.x += speedOffset * this.player.speedX;
                if (this.player.x > this.width - this.player.width/2) this.player.x = this.width - this.player.width/2;
            }

            


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
            this.bkg.update(tmpRate);
            this.mainUI.setHP(this.player.HP);
            this.putMonsters();
            this.recorder.upgradeSpeed();
        }


        private parseOrbit(orbit:any):void{
            var endDistance:number=0;
            var tempDistance:number;
            var backDoor:any=[0,0,0,0,0,0,0,0,0,0];
            var lastX=-1;
            for(var index=0;index<orbit.enemies.length;++index){
                //天哪,这里不就是反射么,好吧其实不是
                // x:orbit.enemies[1]
                // y:orbit.enemies[2]
                var x=orbit.enemies[index][1];
                var y=orbit.enemies[index][2];
                var blockDesc=this.map.getBlockDescByindex(orbit.enemies[index][0]);
                var newMonster:dodge.GameObject = dodge.EntityFactory.produce<dodge.GameObject>(dodge.EntityFactory.Enemies[blockDesc.name], blockDesc.resName);
                var offsetX=x*MainScene.rectSize;

                newMonster.x=offsetX+this.width+newMonster.width/2; //屏幕外出障碍
                newMonster.y=y*MainScene.rectSize+this.top+newMonster.height/2;
                
                newMonster.speedX= - this.recorder.getSpeed();
                // if(Math.random()<0.2)newMonster.spin(); //20%概率旋转,不过不能这么玩儿,
                this.addChildAt(newMonster,1);
                this.enemies.push(newMonster);

                //找到这个orbit最远结束的地方
                tempDistance=this.recorder.distance+offsetX+MainScene.rectSize;
                if(endDistance<tempDistance)endDistance=tempDistance;
                // console.log("add a monster at point ("+newMonster.x+","+newMonster.y+")");
                // newMonster.startAnimate();

                //找到最靠后的x
                if(lastX == x){
                    backDoor[y]=1;
                }else if(lastX < x){
                    backDoor=[0,0,0,0,0,0,0,0,0,0];
                    backDoor[y]=1;
                }
            }
            this.map.setEndDistance(endDistance);
            this.map.setBackDoor(backDoor);
            // console.log("orbit:"+this.recorder.distance+"~"+endDistance);

        }

        //根据当前前进的距离决定是否刷怪
        private putMonsters():void{
            if(!this.map.isEnd()){
                // console.log("地图还没完");
                var orbit=this.map.query(this.recorder.distance); //询问地图该不该刷怪
                if(orbit && orbit.enemies){  //开始刷怪
                    this.parseOrbit(orbit);
                }else if(orbit==-1){ //再等等才会有
                    //pass
                }
            }else{
                // console.log("尝试获取随机地图");
                // var orbit=this.map.getRandomOrbit(this.recorder.distance);
                var orbit=this.map.getRandomOrbitFromGenerator(this.recorder.distance);
                
                 if(orbit.enemies){  //开始刷怪
                    // console.log("done");
                    // console.log(orbit.name);
                    // console.log(this.recorder.distance);
                    this.parseOrbit(orbit);
                }else if(orbit==-1){
                    // console.log("wait");
                }
            }
            
        }

    }
}
