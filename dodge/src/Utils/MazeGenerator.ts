module dodge{
    export class MazeGenerator {
        private maze:any;
        private tunnels:any;
        private tunnelLength:number;
        public constructor(){
            this.maze=[];

        }

        public generate(gate:any):any{
            this.maze=[];
            this.tunnels=this.getTunnels(gate);
            // console.log(this.tunnels);
            this.tunnelLength=this.tunnels.length;
            var floorNum=1;
            var maxNum=40;
            while(true){
                var floor=[1,1,1,1,1,1,1,1,1,1];
                //this.fillFloor(floor);
                //扩充
                this.randomForEach(this.tunnels,floor,this.extendMaze);
                this.maze.push(floor);
                // console.log(floor);
                this.tunnels=this.getTunnels(floor);
                ++floorNum;
                if(this.tunnels.length!=this.tunnelLength || floorNum == maxNum)break;
            }
            return this.maze;
        }

        //根据当前分布返回通道
        //[[start,end],[start,end],[start,end]...]
        private getTunnels(gate:any):any{
            var ret=[];
            var pre:number=1;
            var tunnelStart:number;
            for(var index:number=0;index<gate.length;++index){
                if(pre == 1 && gate[index]==0){
                    tunnelStart = index;
                }
                else if(pre == 0 && gate[index]==1){
                    ret.push([tunnelStart,index-1]);
                }else if(gate[index]==0 && index == gate.length-1){
                     ret.push([tunnelStart,index]);
                }
                pre=gate[index];
            }
            return ret;
        }


        private randomForEach(container:any,floor:any,cb:Function){
            //var randomIndex=[]; //乱序
            container.sort(function(a,b){ return Math.random()>.5 ? -1 : 1;}).forEach((val)=>{
                cb(val,floor);
            });
        }

        //修改floor
        private extendMaze(tunnel,floor){
            //对于floor,有四种方式
            // 0保持,1上行,2下行,和3分裂..暂时不考虑其他的比如扩张和收缩.....我是不是得考虑....
            var choices=[0,1,2];
            if(tunnel[1]-tunnel[0]>4){ //考虑分裂
                choices.push(3);
            }

            var start:number;
            var middle:number=-1;
            var end:number;

            switch(Math.floor(Math.random()*choices.length)){
                case 0:
                    start=tunnel[0];
                    end=tunnel[1];
                    break;
                case 1:
                    start=tunnel[0]-1;
                    end=tunnel[1]-1;
                    break;
                case 2:
                    start=tunnel[0]+1;
                    end=tunnel[1]+1;
                    break;
                case 3:
                    start=tunnel[0];
                    end=tunnel[1];
                    middle= Math.floor((start+end)/2);
                    break;
            }
            if(start<0)start=0;
            for(var index:number=start;index<=end;++index){
                floor[index]=0;
            }
            if(middle > -1){
                floor[middle]=1;
            }

        }

    }
}