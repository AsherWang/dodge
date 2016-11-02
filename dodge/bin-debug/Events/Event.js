var GameEvent = (function (_super) {
    __extends(GameEvent, _super);
    function GameEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
    }
    var d = __define,c=GameEvent,p=c.prototype;
    GameEvent.Event = {
        OnGameStart: "OnGameStart",
        OnGameOver: "OnGameOver",
        OnGamePause: "OnGamePause",
        OnGameResume: "OnGameResume",
        OnKeyDown: "OnKeyDown",
        OnKeyUp: "OnKeyUp"
    };
    return GameEvent;
}(egret.Event));
egret.registerClass(GameEvent,'GameEvent');
//# sourceMappingURL=Event.js.map