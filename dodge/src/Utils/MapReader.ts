module dodge{
    export class MapReader{
        private startDistance:number;
        private endDistance:number;
        private currentOrbitIndex:number;
        private orbits:any;
        private map:any;
        private end:boolean=false;
        public constructor(){
            this.init();
            this.setMap("level1");
        }


        public isEnd():boolean{
            return this.end;
        }

        public setMap(name:string):void{
            this.map=RES.getRes(name);
            this.orbits=this.map.orbits;
            this.end=this.orbits.length==0;

        }
        public init(){
            //设置屏幕外出障碍物
            this.endDistance=egret.MainContext.instance.stage.stageWidth;
             this.endDistance=0;
            this.currentOrbitIndex=0;
            this.startDistance=0;
        }

        //如果传入的距离表示可以放置新的orbit了,那么就返回{},否则返回false
        public query(distance:number):any{
            if(distance<this.endDistance)return -1; //当前的还没画好
            if(this.currentOrbitIndex>=this.orbits.length)return -2; //已经全部画完了
            // if(distance<this.startDistance+this.orbits[this.currentOrbitIndex][0])return false;
            this.startDistance=distance;
            var orbitName=this.orbits[this.currentOrbitIndex];
            var orbit=RES.getRes(orbitName);
            this.currentOrbitIndex++;
            this.end=this.currentOrbitIndex>=this.orbits.length;
            return orbit;
        }

        //确定最远的那个位置
        public setEndDistance(endDistance:number):void{
            this.endDistance=endDistance;
        }

        public getRandomOrbit(distance:number):any{
            if(distance<this.endDistance)return -1;//当前的还没画好
            var orbitName=dodge.Utils.getRandomElement([
                // "orbit_test",
                "line"
            ]);
            return RES.getRes(orbitName);
        }

    }
}