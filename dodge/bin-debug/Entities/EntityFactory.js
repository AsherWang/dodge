var dodge;
(function (dodge) {
    //对象池,避免过大
    var EntityFactory = (function () {
        function EntityFactory() {
        }
        var d = __define,c=EntityFactory,p=c.prototype;
        //生产,生产名为name的某种对象
        EntityFactory.produce = function (c, name) {
            if (EntityFactory.cacheDict[name] == null)
                EntityFactory.cacheDict[name] = [];
            if (EntityFactory.textureCacheDict[name] == null)
                EntityFactory.textureCacheDict[name] = [];
            var dict = EntityFactory.cacheDict[name];
            var enemy;
            if (dict.length > 0) {
                enemy = dict.pop();
            }
            else {
                enemy = new c(EntityFactory.textureCacheDict[name]);
            }
            return enemy;
        };
        //回收,即并不销毁而标记为待用
        EntityFactory.reclaim = function (obj, name) {
            if (EntityFactory.cacheDict[name] == null)
                EntityFactory.cacheDict[name] = [];
            var dict = EntityFactory.cacheDict[name];
            if (dict.indexOf(obj) == -1)
                dict.push(obj);
        };
        EntityFactory.cacheDict = {}; //缓存一堆对象数组的池子,索引是name
        EntityFactory.textureCacheDict = {}; //缓存一堆资源数组的池子,索引是name
        return EntityFactory;
    }());
    dodge.EntityFactory = EntityFactory;
    egret.registerClass(EntityFactory,'dodge.EntityFactory');
})(dodge || (dodge = {}));
//# sourceMappingURL=EntityFactory.js.map