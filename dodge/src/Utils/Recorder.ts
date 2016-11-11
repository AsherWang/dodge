//用于记录游戏的运行数据
module dodge {
    export class Recorder {
        public time: number=0;//单局游戏时间
        public distance: number=0; //里程数
        public hurtTimes: number=0; //受伤次数
        
        public totalTime: number=0;//总游戏时间
        public totalHurtTimes: number=0; //总受伤次数
        public totalDistance: number=0; //总里程数

        private static saveName="dodgeSaveData";

        public init():void{
            this.time=0;
            this.distance=0;
            this.hurtTimes=0;
        }
        public constructor() {
            this.load();
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