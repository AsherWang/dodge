//伤害类
module dodge{
    //伤害类型,因为这个枚举不能放到类里边去,没有写export,所以不会对外暴露
    enum harmType{
        Wind,
        Fire,
        Water,
        Earth,
        Dark,
        Light,
        None
    }

    export class Harm
    {
        public static Type=harmType; //伤害类型


        public poison:boolean=false; //是否有毒
        public type:harmType=harmType.None; //伤害默认无属性
        public basicHarm:number=0; //默认伤害为0
        public realHarm:number=0; //最终伤害,需要在伤害计算器里边最终结算完成,其实写setter和getter更好一些
        public constructor(num:number){
            this.basicHarm=num;
        }
    }
}
