//小鹿
var dodge;
(function (dodge) {
    var Deer = (function (_super) {
        __extends(Deer, _super);
        function Deer(textures) {
            _super.call(this, textures);
            this.realWidth = 70;
            this.realHeight = 100;
            this.name = "deer";
        }
        var d = __define,c=Deer,p=c.prototype;
        p.effectOnPlayer = function (player) {
            var realHarm = player.getHurt(5);
            if (realHarm > 0)
                console.log("deer hurt our player by " + realHarm + "HP");
        };
        return Deer;
    }(dodge.GameObject));
    dodge.Deer = Deer;
    egret.registerClass(Deer,'dodge.Deer');
})(dodge || (dodge = {}));
//# sourceMappingURL=Deer.js.map