module dodge{
    export class GameEvent extends egret.Event
    {
        //游戏的事件集合
        public static Event = {
            OnGameStart: "OnGameStart",
            OnGameOver: "OnGameOver",
            OnGamePause: "OnGamePause",
            OnGameResume: "OnGameResume",
            OnGameRestart: "OnGameRestart",
            OnKeyDown: "OnKeyDown",
            OnKeyUp:"OnKeyUp"
        }
        public msg: any;

        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false)
        {
            super(type, bubbles, cancelable);
        }
    }
}
