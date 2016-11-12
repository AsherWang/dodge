//用于记录游戏的运行数据
module dodge {
    export class Recorder {
        public time: number=0;//单局游戏时间
        public distance: number=0; //里程数
        public hurtTimes: number=0; //受伤次数
        public speed:number;
        public speedLevel:number;


        public totalTime: number=0;//总游戏时间
        public totalHurtTimes: number=0; //总受伤次数
        public totalDistance: number=0; //总里程数

        private static saveName="dodgeSaveData";


        public constructor() {
            this.load();
        }
        public init():void{
            this.time=0;
            this.distance=0;
            this.hurtTimes=0;
            this.speed=2.5;
            this.speedLevel=1;
        }
        public getSpeed():number{
            return this.speed;
        }

        public getSpeedRate():number{
            return [0,1,1.1,1.3,1.7,2.2,2.7,3][this.speedLevel];
        }

        public upgradeSpeed():void{
            if(this.speedLevel>6)return;
            if(this.distance>2000*this.speedLevel){
               this.speedLevel++;
                // console.log("speed up:"+this.speedLevel);
            }
        }

        private save() {
            window.localStorage.setItem(Recorder.saveName,JSON.stringify({
                totalDistance:this.totalDistance,
                totalHurtTimes:this.totalHurtTimes,
                totalTime:this.totalTime
            }));
        }

        private load() {
            var data=window.localStorage.getItem(Recorder.saveName);
            if(data){
                data=JSON.parse(data);
                if(typeof data == "object"){
                this.totalDistance=data.totalDistance;
                this.totalHurtTimes=data.totalHurtTimes;
                this.totalTime=data.totalTime;
                }
            }
        }

        public addToTotal(){
            this.totalDistance+=this.distance;
            this.totalHurtTimes+=this.hurtTimes;
            this.totalTime+=this.time;
            this.save();
        }

    }
}