//Hero
var dodge;
(function (dodge) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(textures) {
            _super.call(this, textures);
            this.fire = 0;
            this.skill1cd = 30;
            this.timer = 0;
            //this.realWidth = 70;
            //this.realHeight = 100;
            //this.speedX = 8;
            //this.speedY = 8;
            this.name = "hero";
            this.isDdbug = true;
        }
        var d = __define,c=Hero,p=c.prototype;
        p.setSkill1Textures = function (textures) {
            this.skill1TextureList = textures;
        };
        p.onAnimateTimer = function (evt) {
            _super.prototype.onAnimateTimer.call(this, evt);
            if (this.fire == 0) {
                this.timer++;
            }
            if (this.timer == this.skill1cd) {
                this.fire = 1;
                this.timer = 0;
            }
            if (this.currentImgIndex == this.textureList.length - 1) {
                if (this.fire == 1) {
                    var tmp = this.textureList;
                    this.textureList = this.skill1TextureList;
                    this.skill1TextureList = tmp;
                    this.fire = 2;
                    this.currentImgIndex = -1;
                }
                else if (this.fire == 2) {
                    var tmp = this.textureList;
                    this.textureList = this.skill1TextureList;
                    this.skill1TextureList = tmp;
                    this.currentImgIndex = this.textureList.length - 1;
                    this.fire = 0;
                }
            }
        };
        return Hero;
    }(dodge.GameObject));
    dodge.Hero = Hero;
    egret.registerClass(Hero,'dodge.Hero');
})(dodge || (dodge = {}));
//# sourceMappingURL=Hero.js.map