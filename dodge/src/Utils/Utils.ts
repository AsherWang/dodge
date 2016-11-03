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
            return sum * Math.floor(Math.random()*(num - 1))/num;
        }

    }
}