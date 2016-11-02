class GameEvent extends egret.Event
{
    public static Event = {
        OnGameStart: "OnGameStart",
        OnGameOver: "OnGameOver",
        OnGamePause: "OnGamePause",
        OnGameResume: "OnGameResume",
        OnKeyDown: "OnKeyDown",
        OnKeyUp:"OnKeyUp"
    }
    public msg: any;

    public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false)
    {
        super(type, bubbles, cancelable);
    }
}