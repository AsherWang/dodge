﻿module dodge {

    //对象池,避免过大
    export class EntityFactory {

        private static cacheDict: Object = {};  //缓存一堆对象数组的池子,索引是name
        public static textureCacheDict: Object = {}; //缓存一堆资源数组的池子,索引是name

        public constructor(){
        }


        //生产,生产名为name的某种对象
        public static produce<T>(c: { new (textures: egret.Texture[]): T;},name: string):T{
            if (EntityFactory.cacheDict[name] == null)
                EntityFactory.cacheDict[name] = [];
            if (EntityFactory.textureCacheDict[name] == null)
                EntityFactory.textureCacheDict[name] = [];
            var dict: any = EntityFactory.cacheDict[name];
            var enemy: T;
            if (dict.length > 0) {
                enemy = dict.pop();
            } else {
                enemy = new c(EntityFactory.textureCacheDict[name]);
            }
            return enemy;
        }


        //回收,即并不销毁而标记为待用
        public static reclaim<T>(obj:T,name: string): void {
            if (EntityFactory.cacheDict[name] == null)
                EntityFactory.cacheDict[name] = [];
            var dict: T[] = EntityFactory.cacheDict[name];
            if (dict.indexOf(obj) == -1)
                dict.push(obj);
        }

    }
}