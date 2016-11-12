
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"bin-debug/Entities/GameObject.js",
	"bin-debug/Entities/Block.js",
	"bin-debug/Entities/Bubble.js",
	"bin-debug/Entities/Medicine.js",
	"bin-debug/Entities/EntityFactory.js",
	"bin-debug/Entities/Hero.js",
	"bin-debug/Entities/Item.js",
	"bin-debug/Entities/Player.js",
	"bin-debug/Events/Event.js",
	"bin-debug/Harm/Harm.js",
	"bin-debug/Harm/CommonHarm.js",
	"bin-debug/Harm/HarmCalculator.js",
	"bin-debug/Main.js",
	"bin-debug/Utils/KeyboardController.js",
	"bin-debug/Utils/MapReader.js",
	"bin-debug/Utils/Recorder.js",
	"bin-debug/Utils/Utils.js",
	"bin-debug/Views/LoadingUI.js",
	"bin-debug/Views/MainBackground.js",
	"bin-debug/Views/MainScene.js",
	"bin-debug/Views/MainUI.js",
	"bin-debug/Views/ScoreBoard.js",
	"bin-debug/Views/WelcomeScene.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "fixedNarrow",
		contentWidth: 1136,
		contentHeight: 640,
		showPaintRect: true,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};