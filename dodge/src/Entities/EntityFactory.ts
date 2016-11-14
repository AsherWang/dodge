///<reference path="./GameObject.ts" />
///<reference path="./Medicine.ts" />
///<reference path="./Bubble.ts" />
///<reference path="./Block.ts" />

module dodge {

    //对象池,避免过大
    export class EntityFactory {
        public static Enemies={
            "gameObject":dodge.GameObject,
            "medicine":dodge.Medicine,
            "bubble":dodge.Bubble,
            "block":dodge.Block
        }
        private static cacheDict: Object = {};  //缓存一堆对象数组的池子,索引是name
        public static textureCacheDict: Object = {}; //缓存一堆资源数组的池子,索引是name

        public constructor(){
        }

        //把需要的资源放入字典
        public static init():void{
            dodge.EntityFactory.textureCacheDict = {
                "medicine": [
                    RES.getRes("item_medicine_hp")
                ],
                "bubble": [
                    RES.getRes("item_poison_bubble")
                ],
                "triangle_red":[
                    RES.getRes("triangle_red")
                ],                
                "triangle_blue":[
                    RES.getRes("triangle_blue")
                ],                
                "triangle_blond":[
                    RES.getRes("triangle_blond")
                ],                
                "triangle_purple":[
                    RES.getRes("triangle_purple")
                ],                
                "triangle_greend":[
                    RES.getRes("triangle_green")
                ],
                "rhombus_red":[
                    RES.getRes("rhombus_red")
                ],
                "rhombus_blue":[
                    RES.getRes("rhombus_blue")
                ],
                "rhombus_blond":[
                    RES.getRes("rhombus_blond")
                ],
                "rhombus_green":[
                    RES.getRes("rhombus_green")
                ],
                "rhombus_purple":[
                    RES.getRes("rhombus_purple")
                ]
            };
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