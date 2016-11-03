//药物
var dodge;
(function (dodge) {
    var Medicine = (function (_super) {
        __extends(Medicine, _super);
        function Medicine(textures) {
            _super.call(this, textures);
            this.name = "medicine";
        }
        var d = __define,c=Medicine,p=c.prototype;
        p.effectOnPlayer = function (player) {
            var realRecovery = player.getHealed(20);
            if (realRecovery > 0)
                console.log("medicine heals our player by " + realRecovery + "HP");
        };
        return Medicine;
    }(dodge.GameObject));
    dodge.Medicine = Medicine;
    egret.registerClass(Medicine,'dodge.Medicine');
})(dodge || (dodge = {}));
//# sourceMappingURL=Medicine.js.map