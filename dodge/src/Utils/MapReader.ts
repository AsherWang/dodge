module dodge{
    export class MapReader{
        private startDistance:number;
        private endDistance:number;
        private currentOrbitIndex:number;
        private orbits:any;
        private map:any;
        private end:boolean=false;
        private blockDictionary:any;
        private backDoor:any;

        private mazeGenerator:dodge.MazeGenerator;
        public constructor(){
            this.blockDictionary=RES.getRes("blockDictionary");
            this.mazeGenerator=new dodge.MazeGenerator();
            this.init();
            this.setMap("level1");
        }

        //根据索引返回block的描述,包括类名和资源名称
        public getBlockDescByindex(index:number):any{
            if(index>=this.blockDictionary.blocks.length)return{
                "name":"gameObject",
                "resName":"rhombus_red"
            };
            return this.blockDictionary.blocks[index];
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
            this.backDoor=[0,0,0,0,0,0,0,0,0,0];
        }

        //如果传入的距离表示可以放置新的orbit了,那么就返回{},否则返回false
        public query(distance:number):any{
            if(distance<this.endDistance)return -1; //当前的还没画好
            if(this.currentOrbitIndex>=this.orbits.length)return this.getRandomOrbit(distance); //已经全部画完了,交给随机吧
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
                "trap1_head",
                "trap1_tail1",
                "trap1_tail2"
            ]);
            return RES.getRes(orbitName);
        }

        public getRandomOrbitFromGenerator(distance:number):any{
            if(distance<this.endDistance)return -1;//当前的还没画好
            var maze=this.mazeGenerator.generate(this.backDoor);
            var orbit={
                enemies:[]
            };
            //将迷宫转换为orbit
            for(var x:number=0;x<maze.length;++x){
                for(var y:number=0;y<10;++y){
                    if(maze[x][y]==1){
                        orbit.enemies.push([Math.floor(Math.random()*this.blockDictionary.blocks.length),x,y]);
                    }
                }   
            }
            return orbit;

        }

        public setBackDoor(backDoor:any):void{
            this.backDoor=backDoor;
        }

    }
}