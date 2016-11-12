module dodge {
    export class Utils {

        public static pad(num:number, n:number):string {
            var len = num.toString().length;
            var ret = num.toString();
            while (len < n) {
                ret = "0" + ret;
                len++;
            }
            return ret;
        }


        public static timeFormat(second: number): string{
            var min = Math.floor(second / 60);
            var sec = second - min * 60;
            return Utils.pad(min,2) + ":" + Utils.pad(sec,2);
        }


        public static getRandomValue(sum: number, num: number): number {
            return sum * Math.floor(Math.random()*(num-1)+1)/num;
        }


        //返回区间中一个随机值
        public static getRandom(min: number, max: number): number{
            return Math.floor(Math.random()*(max - min))+min;
        }


        //返回数组中一个随机元素
        public static getRandomElement(container: any): any{
            return container[Math.floor(Math.random() * container.length)];
        }


        public static pxToMeter(px:number,fixed:number=2):string{
            return (px/10).toFixed(fixed);
        }
        
        //实际x到屏幕x
        public static distance2Screen(currentDistance:number,distance:number){
            return currentDistance-distance;
        }

        //屏幕x到实际x
        public static screen2Distance(currentDistance:number,screenX:number){
            return currentDistance+screenX;
        }


    }
}