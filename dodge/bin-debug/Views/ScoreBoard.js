var ScoreBoard = (function (_super) {
    __extends(ScoreBoard, _super);
    function ScoreBoard(width, height) {
        _super.call(this);
        this.width = width;
        this.width = height;
        this.createView();
    }
    var d = __define,c=ScoreBoard,p=c.prototype;
    p.createView = function () {
        this.btnContinue = new egret.TextField();
        this.addChild(this.btnContinue);
        this.btnContinue.y = 450;
        this.btnContinue.textAlign = "center";
        this.btnContinue.verticalAlign = "center";
        this.btnContinue.text = "TAP TO CONTINUE";
        this.btnContinue.width = this.width;
        this.btnContinue.anchorOffsetX = this.width / 2;
        this.btnContinue.x = this.width / 2;
        this.btnContinue.textColor = 0xffffff;
        this.blink(this.btnContinue, 200);
        this.board = new egret.TextField();
        this.board.textFlow = this.getResult();
        this.board.textAlign = "center";
        this.board.width = this.width;
        this.addChild(this.board);
    };
    p.getTextField = function (text) {
        var ret = new egret.TextField();
        ret.text = text;
        return ret;
    };
    //使某个控件闪烁
    p.blink = function (obj, time) {
        var self = this;
        var tw = egret.Tween.get(obj, { loop: true });
        tw.to({ "alpha": 1 }, time);
        tw.wait(1000);
        tw.to({ "alpha": 0.01 }, time / 2);
        tw.wait(500);
    };
    p.getResult = function () {
        //return [
        //    { text: "妈妈再也不用担心我在", style: { "size": 12 } }
        //    , { text: "Egret", style: { "textColor": 0x336699, "size": 60, "strokeColor": 0x6699cc, "stroke": 2 } }
        //    , { text: "里说一句话不能包含各种", style: { "fontFamily": "楷体" } }
        //    , { text: "五", style: { "textColor": 0xff0000 } }
        //    , { text: "彩", style: { "textColor": 0x00ff00 } }
        //    , { text: "缤", style: { "textColor": 0xf000f0 } }
        //    , { text: "纷", style: { "textColor": 0x00ffff } }
        //    , { text: "、\n" }
        //    , { text: "大", style: { "size": 36 } }
        //    , { text: "小", style: { "size": 6 } }
        //    , { text: "不", style: { "size": 16 } }
        //    , { text: "一", style: { "size": 24 } }
        //    , { text: "、" }
        //    , { text: "格", style: { "italic": true, "textColor": 0x00ff00 } }
        //    , { text: "式", style: { "size": 16, "textColor": 0xf000f0 } }
        //    , { text: "各", style: { "italic": true, "textColor": 0xf06f00 } }
        //    , { text: "样", style: { "fontFamily": "楷体" } }
        //    , { text: "" }
        //    , { text: "的文字了！" }
        //];
        return [
            { text: "计分板\n\n" },
            { text: "时间:23s\n" },
            { text: "得分:44\n" },
            { text: "回血:33\n" },
            { text: "受伤次数:233\n" },
            { text: "排名:1000" }
        ];
    };
    return ScoreBoard;
}(egret.Sprite));
egret.registerClass(ScoreBoard,'ScoreBoard');
//# sourceMappingURL=ScoreBoard.js.map