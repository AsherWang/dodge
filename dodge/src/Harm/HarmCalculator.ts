//伤害计算器
module dodge{
    export class HarmCalculator{
        public constructor(){

        }

        //结算伤害,如果需要记录,那么在这里记录
        public static calculate(sender:dodge.GameObject,reciver:dodge.GameObject,harm:dodge.Harm,recorder:dodge.Recorder){
            var realHarm:number=0;
            switch(harm.type){
                case dodge.Harm.Type.Wind:
                    //风系伤害
                    break;
                case dodge.Harm.Type.Water:
                    //水系伤害
                    break;
                case dodge.Harm.Type.Fire:
                    //火系伤害
                    break;
                case dodge.Harm.Type.Earth:
                    //地系伤害
                    break;
                case dodge.Harm.Type.Light:
                    //光系伤害
                    break;                
                case dodge.Harm.Type.Dark:
                    //暗系伤害
                    break;
                case dodge.Harm.Type.None:
                    //无属性伤害
                    harm.realHarm=reciver.getHurt(harm.basicHarm,sender);
                    recorder.hurtTimes++;
                    break;
                default:
                    //没见过的伤害,出bug了吧
                    break;
            }
            sender.afterHarm(harm);
            reciver.afterHuet(harm);
        }
    }
}