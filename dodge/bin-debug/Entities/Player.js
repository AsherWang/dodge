//Player
var dodge;
(function (dodge) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(textures) {
            _super.call(this, textures);
            this.timeHurt = 2; //受伤之后短暂无敌秒数
            this.isInvincible = false;
            //this.realWidth = 70;
            //this.realHeight = 100;
            this.speedX = 8;
            this.speedY = 8;
            this.name = "player";
            this.timer = new egret.Timer(this.timeHurt * 1000);
        }
        var d = __define,c=Player,p=c.prototype;
        //治疗
        p.getHealed = function (recover) {
            this.HP += recover;
            if (this.HP > this.MAXHP)
                this.HP = this.MAXHP;
            this.isInvincible = true;
            this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            this.timer.start();
            return recover;
        };
        //如果受伤了则返回掉血量
        p.getHurt = function (harm) {
            var ret = 0;
            if (!this.isInvincible) {
                this.HP -= harm;
                ret = harm;
                this.isInvincible = true;
                this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                this.timer.start();
            }
            return ret;
        };
        p.onTimer = function (evt) {
            this.isInvincible = false;
        };
        return Player;
    }(dodge.GameObject));
    dodge.Player = Player;
    egret.registerClass(Player,'dodge.Player');
})(dodge || (dodge = {}));
//# sourceMappingURL=Player.js.map