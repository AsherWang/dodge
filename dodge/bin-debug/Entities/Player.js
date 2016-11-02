//Player
var dodge;
(function (dodge) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(textures) {
            _super.call(this, textures);
            //this.realWidth = 70;
            //this.realHeight = 100;
            this.speedX = 8;
            this.speedY = 8;
            this.name = "player";
        }
        var d = __define,c=Player,p=c.prototype;
        return Player;
    }(dodge.GameObject));
    dodge.Player = Player;
    egret.registerClass(Player,'dodge.Player');
})(dodge || (dodge = {}));
//# sourceMappingURL=Player.js.map