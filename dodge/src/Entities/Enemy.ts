module dodge {

    export class Enemy extends egret.DisplayObjectContainer {
        private bmp: egret.Bitmap;

        public harm: number = 10; //碰到伤血

        public constructor(texture: egret.Texture) {
            super();
            this.bmp = new egret.Bitmap(texture);
            this.addChild(this.bmp);
        }

        private static cacheDict: Object = {};
        //生产
        public static produce(textureName: string): dodge.Enemy {
            if (dodge.Enemy.cacheDict[textureName] == null)
                dodge.Enemy.cacheDict[textureName] = [];
            var dict: dodge.Enemy[] = dodge.Enemy.cacheDict[textureName];
            var enemy: dodge.Enemy;
            if (dict.length > 0) {
                enemy = dict.pop();
            } else {
                enemy = new dodge.Enemy(RES.getRes(textureName));
            }
            enemy.harm = 10;
            return enemy;
        }
        //回收
        public static reclaim(enemy: dodge.Enemy, textureName: string): void {
            if (dodge.Enemy.cacheDict[textureName] == null)
                dodge.Enemy.cacheDict[textureName] = [];
            var dict: dodge.Enemy[] = dodge.Enemy.cacheDict[textureName];
            if (dict.indexOf(enemy) == -1)
                dict.push(enemy);
        }

    }
}