var dodge;
(function (dodge) {
    var GameObject = (function (_super) {
        __extends(GameObject, _super);
        function GameObject(textures) {
            _super.call(this);
            this.isDdbug = false;
            this.blood = 10;
            this.speedX = 0;
            this.speedY = 0;
            this.currentImgIndex = 0; //当前显示的图片
            this.textureList = []; //所有动作的图片
            this.textureList = textures;
            this.img = new egret.Bitmap(textures[0]);
            this.addChild(this.img);
            this.realHeight = this.img.height;
            this.realWidth = this.img.width;
        }
        var d = __define,c=GameObject,p=c.prototype;
        //开始动作
        p.startAnimate = function () {
            if (!this.animateTimer)
                this.animateTimer = new egret.Timer(100, 0);
            this.animateTimer.addEventListener(egret.TimerEvent.TIMER, this.onAnimateTimer, this);
            this.animateTimer.start();
        };
        //停下动作
        p.stopAnimate = function () {
            this.animateTimer.stop();
        };
        //切换图片
        p.onAnimateTimer = function (evt) {
            this.currentImgIndex = (this.currentImgIndex + 1) % this.textureList.length;
            this.img.texture = this.textureList[this.currentImgIndex];
        };
        //更新位置
        p.updatePostion = function (speedRate) {
            this.x += this.speedX * speedRate;
            this.y += this.speedY * speedRate;
        };
        p.checkHitPoint = function (player) {
            var player_x1 = player.x - player.width / 2;
            var player_y1 = player.y - player.height / 2;
            var player_x2 = player.x + player.width / 2;
            var player_y2 = player.y + player.height / 2;
            var self_x1 = this.x - this.realWidth / 2;
            var self_y1 = this.y - this.realHeight / 2;
            if (this.hitPoint(player_x2, player_y1)
                || this.hitPoint(player_x2, player_y2)
                || this.hitPoint(player_x1, player_y1)
                || this.hitPoint(player_x1, player_y2)) {
                this.effectOnPlayer(player);
            }
        };
        //检测一个点是不是在一个矩形内
        p.hitPoint = function (x1, y1) {
            var x2 = this.x - this.realWidth / 2;
            var y2 = this.y - this.realHeight / 2;
            return (x2 - x1 < 0) && (x2 + this.realWidth - x1 > 0) && (y2 - y1 < 0) && (y2 + this.realHeight - y1 > 0);
        };
        p.effectOnPlayer = function (player) {
            console.log("撞上了");
        };
        //把自己销毁掉(假装)
        p.reclaim = function () {
            dodge.EntityFactory.reclaim(this, this.name);
        };
        //如果需要回收就回收了
        p.checkReclaim = function (width, height) {
            return (this.x + this.realWidth < -1000) || (this.x > width + 1000) || (this.y + this.realHeight < -1000) || (this.y + this.realHeight > height + 1000);
        };
        return GameObject;
    }(egret.DisplayObjectContainer));
    dodge.GameObject = GameObject;
    egret.registerClass(GameObject,'dodge.GameObject');
})(dodge || (dodge = {}));
//# sourceMappingURL=GameObject.js.map