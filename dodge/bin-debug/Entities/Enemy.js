var dodge;
(function (dodge) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(texture) {
            _super.call(this);
            this.harm = 10; //碰到伤血
            this.bmp = new egret.Bitmap(texture);
            this.addChild(this.bmp);
        }
        var d = __define,c=Enemy,p=c.prototype;
        //生产
        Enemy.produce = function (textureName) {
            if (dodge.Enemy.cacheDict[textureName] == null)
                dodge.Enemy.cacheDict[textureName] = [];
            var dict = dodge.Enemy.cacheDict[textureName];
            var enemy;
            if (dict.length > 0) {
                enemy = dict.pop();
            }
            else {
                enemy = new dodge.Enemy(RES.getRes(textureName));
            }
            enemy.harm = 10;
            return enemy;
        };
        //回收
        Enemy.reclaim = function (enemy, textureName) {
            if (dodge.Enemy.cacheDict[textureName] == null)
                dodge.Enemy.cacheDict[textureName] = [];
            var dict = dodge.Enemy.cacheDict[textureName];
            if (dict.indexOf(enemy) == -1)
                dict.push(enemy);
        };
        Enemy.cacheDict = {};
        return Enemy;
    }(egret.DisplayObjectContainer));
    dodge.Enemy = Enemy;
    egret.registerClass(Enemy,'dodge.Enemy');
})(dodge || (dodge = {}));
//# sourceMappingURL=Enemy.js.map