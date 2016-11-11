//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */

    public static Size = {
        height: 0,
        weidth: 0
    };
    private loadingView: dodge.LoadingUI;  //载入界面
    private welcomeSceneView: dodge.WelcomeScene; //欢迎,开始界面
    private mainSceneView: dodge.MainScene; //主游戏界面
    private scoreBoard: dodge.ScoreBoard; //计分板

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface

        this.loadingView = new dodge.LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            RES.loadGroup("ui");
        }else if (event.groupName == "ui") {
            RES.loadGroup("enemy");
        }else if (event.groupName == "enemy") {
            RES.loadGroup("map");
        }else if(event.groupName == "map"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        this.welcomeSceneView = new dodge.WelcomeScene();
        this.welcomeSceneView.height = stageH / 2;
        this.makeChildCenter(this.welcomeSceneView, stageW, stageH);
        this.stage.addChild(this.welcomeSceneView);

        this.welcomeSceneView.addEventListener(dodge.GameEvent.Event.OnGameStart, this.OnGameStart, this);

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        //RES.getResAsync("description_json", this.startAnimation, this)
    }


    //游戏开始
    private OnGameStart(evt: dodge.GameEvent) {
       this.welcomeSceneView.removeEventListener(dodge.GameEvent.Event.OnGameStart, this.OnGameStart, this);
        this.stage.removeChild(this.welcomeSceneView);
        this.gameStart();
    }

    private OnGameRestart(evt: dodge.GameEvent) {
        //this.scoreBoard.removeEventListener(GameEvent.Event.OnGameRestart, this.OnGameRestart, this);
        this.stage.removeChild(this.scoreBoard);
        this.gameStart();
    }
    private gameStart() {
 
        if (!this.mainSceneView) {
            this.mainSceneView = new dodge.MainScene();
        }

        this.stage.addChild(this.mainSceneView);
        this.mainSceneView.run();

        //添加事件监听,包括游戏结束,游戏暂停,游戏恢复
        this.mainSceneView.addEventListener(dodge.GameEvent.Event.OnGameOver, this.OnGameOver, this);
        this.mainSceneView.addEventListener(dodge.GameEvent.Event.OnGamePause, this.OnGamePause, this);
        this.mainSceneView.addEventListener(dodge.GameEvent.Event.OnGameResume, this.OnGameResume, this);
    }


    //游戏结束
    private OnGameOver(evt: dodge.GameEvent) {
        this.mainSceneView.removeEventListener(dodge.GameEvent.Event.OnGameOver, this.OnGameOver, this);
        this.mainSceneView.removeEventListener(dodge.GameEvent.Event.OnGamePause, this.OnGamePause, this);
        this.mainSceneView.removeEventListener(dodge.GameEvent.Event.OnGameResume, this.OnGameResume, this);

        this.stage.removeChild(this.mainSceneView);

        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        if (!this.scoreBoard) {
            this.scoreBoard = new dodge.ScoreBoard();
        }
        this.scoreBoard.setData(evt.msg);

        this.stage.addChild(this.scoreBoard);
        this.scoreBoard.addEventListener(dodge.GameEvent.Event.OnGameRestart, this.OnGameRestart, this);


    }

    //游戏暂停
    private OnGamePause(evt: dodge.GameEvent) {

        //应该不需要删除这个事件绑定,看情况
        this.mainSceneView.removeEventListener(dodge.GameEvent.Event.OnGamePause, this.OnGamePause, this);



    }

    //游戏恢复
    private OnGameResume(evt: dodge.GameEvent) {

        //应该不需要删除这个事件绑定,看情况
        this.mainSceneView.removeEventListener(dodge.GameEvent.Event.OnGameResume, this.OnGameResume, this);
    }


    //使其居中
    private makeChildCenter(child:any,stageW:number,stageH:number):void{
        child.anchorOffsetX = child.width / 2;
        child.anchorOffsetY = child.height / 2;
        child.x = stageW / 2;
        child.y = stageH / 2;
    }

    
}


