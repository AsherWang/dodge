//游戏的主要操作界面
class MainScene extends egret.Sprite {
    private hero: dodge.Hero;  //只是为了好玩儿加的
    private player: dodge.Player;

    private enemyFactory: dodge.EntityFactory;
    private enemies: dodge.GameObject[]=[];


    private bkg: egret.Bitmap[];  //背景
    private bkgSpeed: number = 2;  //背景速度
    private textureWidth: number;  //背景图的宽度

    //private timer: egret.Timer;
    private keyboardController: dodge.KeyboardController;
    private _lastTime: any = 0;


    private btnPause: egret.Bitmap;
    public constructor() {
        super();
        this.createView();
    }

    private textField: egret.TextField;

    private createView(): void {
        
        this.height = egret.MainContext.instance.stage.stageHeight;
        this.width = egret.MainContext.instance.stage.stageWidth;

        //创建背景
        this.createBkg();

        //hero
        var heroRes: egret.Texture[] = [
            RES.getRes("hero_run1"),
            RES.getRes("hero_run2"),
            RES.getRes("hero_run3"),
            RES.getRes("hero_run4")
        ];

        this.hero = new dodge.Hero(heroRes);
        this.hero.setSkill1Textures([
            RES.getRes("hero_skill1_1"),
            RES.getRes("hero_skill1_2"),
            RES.getRes("hero_skill1_3"),
            RES.getRes("hero_skill1_4"),
            RES.getRes("hero_skill1_5"),
            RES.getRes("hero_skill1_6")
        ]);
        this.hero.y = this.height - 250;
        this.hero.x = 150;
        this.addChild(this.hero);

        //玩家
        var playerRes: egret.Texture[] = [
            RES.getRes("player_flappybird_1"),
            RES.getRes("player_flappybird_2"),
            RES.getRes("player_flappybird_3")
        ];
        this.player = new dodge.Player(playerRes);
        this.player.y = this.height / 2;
        this.player.x = this.width / 2 - this.player.width / 2;
        this.addChild(this.player);


        this.createUI();

        //工厂初始化
        dodge.EntityFactory.textureCacheDict = {
            "deer": [
                RES.getRes("enemy_deer_1"),
                RES.getRes("enemy_deer_2"),
                RES.getRes("enemy_deer_3"),
                RES.getRes("enemy_deer_4"),
                RES.getRes("enemy_deer_5")
            ]
        };
        this.putAnEnemy();

        //键盘控制
        this.keyboardController = new dodge.KeyboardController();
        this.keyboardController.listen();
    }

    private createBkg() {
        var texture: egret.Texture = RES.getRes("bkg1");
        this.textureWidth = texture.textureWidth;
        var count = Math.ceil(this.width / texture.textureWidth) + 2;//计算在当前屏幕中，需要的图片数量
        this.bkg = [];
        //创建这些图片，并设置y坐标，让它们连接起来
        for (var i: number = 0; i < count; i++) {
            var bgBmp: egret.Bitmap = new egret.Bitmap(texture);
            bgBmp.y = 0;
            bgBmp.x = texture.textureWidth * i;
            this.bkg.push(bgBmp);
            this.addChild(bgBmp);
        }
    }

    private createUI() {
        //添加ui元素
        this.btnPause = new egret.Bitmap(RES.getRes("btn_pause"));
        this.btnPause.x = 10;
        this.btnPause.y = 10;
        this.btnPause.pixelHitTest = true;
        this.addChild(this.btnPause);


        //监听事件
        this.btnPause.touchEnabled = true;
        this.btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPause, this);
    }

    private onPause(evt: egret.TouchEvent) {
        //
        console.log("快暂停啊");
    }


    //在右边产生一个怪物
    private putAnEnemy() {
        var deer = dodge.EntityFactory.produce<dodge.Deer>(dodge.Deer, "deer");
        deer.y = this.height / 2;
        deer.x = this.width + 300;
        deer.anchorOffsetX = deer.width / 2;
        deer.anchorOffsetY = deer.height / 2;
        deer.speedX = -4;
        this.addChildAt(deer, this.bkg.length);
        this.enemies.push(deer);
        deer.startAnimate();
    }


    //分发消息,下通知说游戏已经结束
    private OnGameOver(evt: egret.TouchEvent) {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
        this.player.stopAnimate();
        this.hero.stopAnimate();
        this.enemies.forEach((item) => { item.stopAnimate();});

        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnGameOver, this);
        var OnOverEvent:GameEvent = new GameEvent(GameEvent.Event.OnGameOver);
        this.dispatchEvent(OnOverEvent);
    }


    //开始运行游戏
    public run() {
        this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
        this.player.startAnimate();
        this.hero.startAnimate();
    }



    //每帧更新画面,并且计算碰撞和回收跑出屏幕外的东西
    private enterFrame(evt: egret.Event) {

        //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
        var nowTime: number = egret.getTimer();
        var fps: number = 1000 / (nowTime - this._lastTime);
        this._lastTime = nowTime;
        var speedOffset: number = 30 / fps;

        if (this.keyboardController.isUp()) {
            this.player.y -= speedOffset * this.player.speedY;
            if(this.player.y<0)this.player.y = 0;
        }

        if (this.keyboardController.isDown()) {
            this.player.y += speedOffset * this.player.speedY;
            if (this.player.y + this.player.height > this.height) this.player.y = this.height - this.player.height;
        }

        if (this.keyboardController.isLeft()) {
            this.player.x -= speedOffset * this.player.speedX;
            if (this.player.x < 0) this.player.x = 0;
        }

        if (this.keyboardController.isRight()) {
            this.player.x += speedOffset * this.player.speedX;
            if (this.player.x + this.player.width > this.width) this.player.x = this.width - this.player.width;
        }

        //更新背景
        for (var i: number = 0; i < this.bkg.length; i++) {
            var bgBmp: egret.Bitmap = this.bkg[i];
            bgBmp.x -= this.bkgSpeed * speedOffset;
            if (bgBmp.x + this.textureWidth < -this.width) {
                bgBmp.x += this.textureWidth * this.bkg.length;
            }
        }


        //遍历所有怪物
        for (var i: number = 0; i < this.enemies.length; i++) {
            var enemy: dodge.GameObject = this.enemies[i];
            enemy.updatePostion(speedOffset);  //更新位置
            enemy.checkHitPoint(this.player);  //检测碰撞
            if (enemy.checkReclaim(this.width, this.height)) { //检测是否需要回收
                enemy.reclaim();
                this.removeChild(enemy);
                this.enemies.splice(i, 1);
                i--;
            }
        }
    }
}