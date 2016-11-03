//游戏的主要操作界面
var MainScene = (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        _super.call(this);
        this.time = 0; //当局游戏时间
        this.enemies = [];
        this.bkgSpeed = 2; //背景速度
        this._lastTime = 0;
        this.createView();
    }
    var d = __define,c=MainScene,p=c.prototype;
    p.createView = function () {
        this.height = egret.MainContext.instance.stage.stageHeight;
        this.width = egret.MainContext.instance.stage.stageWidth;
        //创建背景
        this.createBkg();
        //hero
        var heroRes = [
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
        var playerRes = [
            RES.getRes("player_flappybird_1"),
            RES.getRes("player_flappybird_2"),
            RES.getRes("player_flappybird_3")
        ];
        this.player = new dodge.Player(playerRes);
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
            ],
            "medicine": [
                RES.getRes("item_medicine_hp")
            ],
            "bubble": [
                RES.getRes("item_poison_bubble")
            ]
        };
        this.timer = new egret.Timer(1000, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timeToGenerateMonster, this);
        //键盘控制
        this.keyboardController = new dodge.KeyboardController();
        this.keyboardController.listen();
    };
    p.timeToGenerateMonster = function (evt) {
        this.time++;
        if (this.time % 3 == 0) {
            this.putAnEnemy();
        }
        this.updateUI();
    };
    p.createBkg = function () {
        var texture = RES.getRes("bkg1");
        this.textureWidth = texture.textureWidth;
        var count = Math.ceil(this.width / texture.textureWidth) + 2; //计算在当前屏幕中，需要的图片数量
        this.bkg = [];
        //创建这些图片，并设置y坐标，让它们连接起来
        for (var i = 0; i < count; i++) {
            var bgBmp = new egret.Bitmap(texture);
            bgBmp.y = 0;
            bgBmp.x = texture.textureWidth * i;
            this.bkg.push(bgBmp);
            this.addChild(bgBmp);
        }
    };
    p.createUI = function () {
        //添加ui元素
        this.btnPause = new egret.Bitmap(RES.getRes("btn_pause"));
        this.btnPause.x = 10;
        this.btnPause.y = 10;
        this.btnPause.pixelHitTest = true;
        //this.addChild(this.btnPause);  //先不加暂停
        this.timeSign = new egret.TextField();
        this.timeSign.x = this.width - 30;
        this.timeSign.y = 20;
        this.timeSign.text = "00:00";
        this.timeSign.anchorOffsetX = this.timeSign.width;
        this.addChild(this.timeSign);
        this.HPSign = new egret.Shape();
        this.HPSign.x = 20;
        this.HPSign.y = this.height - 50;
        this.HPSign.alpha = 0.8;
        this.addChild(this.HPSign);
        //this.HPSign.anchorOffsetX = 50;//3、锚点居于左上角x轴 50 像素的位置
        //监听事件
        // this.btnPause.touchEnabled = true;
        //this.btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPause, this);
        this.updateUI();
    };
    p.Reiniti = function () {
        //遍历回收所有怪物
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            enemy.reclaim();
            this.removeChild(enemy);
        }
        this.enemies = [];
        this.player.y = this.height / 2;
        this.player.x = this.width / 2 - this.player.width / 2;
        this.player.HP = this.player.MAXHP;
        //创建这些图片，并设置y坐标，让它们连接起来
        for (var i = 0; i < this.bkg.length; i++) {
            var bgBmp = this.bkg[i];
            bgBmp.y = 0;
            bgBmp.x = bgBmp.texture.textureWidth * i;
        }
        this.updateUI();
    };
    p.updateUI = function () {
        this.timeSign.text = dodge.Utils.timeFormat(this.time);
        this.HPSign.graphics.clear();
        this.HPSign.graphics.lineStyle(1, 0x333333);
        this.HPSign.graphics.drawRect(0, 0, this.width / 2, 32);
        this.HPSign.graphics.beginFill(0xff7777);
        this.HPSign.graphics.drawRect(1, 1, this.width / 2 * this.player.HP / this.player.MAXHP, 30);
        this.HPSign.graphics.endFill();
    };
    p.onPause = function (evt) {
        this.stopAllAnimation();
        this.timer.stop();
    };
    p.stopAllAnimation = function () {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
        this.enemies.forEach(function (item) { item.stopAnimate(); });
        this.player.stopAnimate();
        this.hero.stopAnimate();
    };
    p.startAllAnimation = function () {
        this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
        this.enemies.forEach(function (item) { item.startAnimate(); });
        this.player.startAnimate();
        this.hero.startAnimate();
    };
    //在右边产生一个怪物
    p.putAnEnemy = function () {
        var deer = dodge.EntityFactory.produce(dodge.Deer, "deer");
        deer.y = dodge.Utils.getRandomValue(this.height, 6) + deer.realHeight;
        deer.x = this.width + 300;
        deer.anchorOffsetX = deer.width / 2;
        deer.anchorOffsetY = deer.height / 2;
        deer.speedX = -4;
        this.addChildAt(deer, this.bkg.length);
        this.enemies.push(deer);
        deer.startAnimate();
    };
    //分发消息,下通知说游戏已经结束
    p.gameOver = function () {
        this.stopAllAnimation();
        this.timer.stop();
        var OnOverEvent = new GameEvent(GameEvent.Event.OnGameOver);
        this.dispatchEvent(OnOverEvent);
    };
    //开始运行游戏
    p.run = function () {
        this.Reiniti();
        this.startAllAnimation();
        this.timer.start();
        this.time = 0;
    };
    //每帧更新画面,并且计算碰撞和回收跑出屏幕外的东西
    p.enterFrame = function (evt) {
        //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
        var nowTime = egret.getTimer();
        var fps = 1000 / (nowTime - this._lastTime);
        this._lastTime = nowTime;
        var speedOffset = 30 / fps;
        if (this.keyboardController.isUp()) {
            this.player.y -= speedOffset * this.player.speedY;
            if (this.player.y < 0)
                this.player.y = 0;
        }
        if (this.keyboardController.isDown()) {
            this.player.y += speedOffset * this.player.speedY;
            if (this.player.y + this.player.height > this.height)
                this.player.y = this.height - this.player.height;
        }
        if (this.keyboardController.isLeft()) {
            this.player.x -= speedOffset * this.player.speedX;
            if (this.player.x < 0)
                this.player.x = 0;
        }
        if (this.keyboardController.isRight()) {
            this.player.x += speedOffset * this.player.speedX;
            if (this.player.x + this.player.width > this.width)
                this.player.x = this.width - this.player.width;
        }
        //更新背景
        for (var i = 0; i < this.bkg.length; i++) {
            var bgBmp = this.bkg[i];
            bgBmp.x -= this.bkgSpeed * speedOffset;
            if (bgBmp.x + this.textureWidth < -this.width) {
                bgBmp.x += this.textureWidth * this.bkg.length;
            }
        }
        //遍历所有怪物
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            enemy.updatePostion(speedOffset); //更新位置
            enemy.checkHitPoint(this.player); //检测碰撞
            if (enemy.checkReclaim(this.width, this.height)) {
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
        this.updateUI();
    };
    return MainScene;
}(egret.Sprite));
egret.registerClass(MainScene,'MainScene');
//# sourceMappingURL=MainScene.js.map