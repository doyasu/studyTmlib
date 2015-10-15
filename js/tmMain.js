
var SCREEN_WIDTH    = 400;              // スクリーン幅
var SCREEN_HEIGHT   = 400;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分

var ASSETS = {
    "player" : "./images/car.png",
    "enemy" : "./images/car2.png",
};
/*
 * main
 */
tm.main(function() {
    // アプリケーションセットアップ
    var app = tm.app.CanvasApp("#world");       // 生成
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);    // サイズ(解像度)設定
    app.fitWindow();                            // 自動フィッティング有効
    app.background = "rgba(200, 200, 200, 1.0)";// 背景色

    var loadingScene = tm.ui.LoadingScene({
        assets: ASSETS,
    });
    loadingScene.onload = function(){
        app.replaceScene(GameScene());
    };

    app.replaceScene( loadingScene );    // シーン切り替え

    // 実行
    app.run();
});

var PLAYER_WIDTH = 120;
var PLAYER_HEIGHT = 70;
tm.define("Player", {
    superClass: "tm.display.Sprite",

    init : function(){
        // 120*70
        this.superInit("player");
        console.log("Player (x, y) : (" + this.width + "," + this.height + ")");
    },
});

var ENEMY_WIDTH = 120;
var ENEMY_HEIGHT = 70;
tm.define("Enemy", {
    superClass: "tm.display.Sprite",

    init : function(){
        // 120*90
        this.superInit("enemy");
        console.log("Enemy (x, y) : (" + this.width + "," + this.height + ")");
    }
});

/*
 * ゲームシーン
 */
tm.define("GameScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        this.player = Player().addChildTo(this);
        this.player.setPosition(300, 300);

        this.enemy = Enemy().addChildTo(this);
        this.enemy.setPosition(100, 100);

    },

    update : function(app){
        if(app.keyboard.getKey("left")){
            if(this.player.x > PLAYER_WIDTH / 2 ){
                this.player.x -= 8;
                this.player.scaleX = -1;
            }
        }
        else if(app.keyboard.getKey("right")){
            if(this.player.x < SCREEN_WIDTH - PLAYER_WIDTH / 2 ){
                this.player.x += 8;
                this.player.scaleX = 1;
            }
        }
        else if(app.keyboard.getKey("up")){
            if(this.player.y > PLAYER_HEIGHT / 2 ){
                this.player.y -= 8;
            }
        }
        else if(app.keyboard.getKey("down")){
            if(this.player.y < SCREEN_HEIGHT - PLAYER_HEIGHT / 2 ){
                this.player.y += 8;
            }
        }

        if( this.player.x > this.enemy.x-ENEMY_WIDTH &&
            this.player.x < this.enemy.x+ENEMY_WIDTH &&
            this.player.y > this.enemy.y-ENEMY_HEIGHT &&
            this.player.y < this.enemy.y+ENEMY_HEIGHT ){
            console.log('hit');
            app.replaceScene(CrashScene(this.player.x, this.player.y, this.player.scaleX, this.enemy.x, this.enemy.y));
        }

    }
});

var CRASH_LABEL = {
    main: {
        children: [{
            type: "Label",
            name: "crashLabel",
            x: 140,
            y: 350,
            width: SCREEN_WIDTH,
            fillStyle: "red",
            text: "crash!!",
            fontSize: 40,
            align: "left"
        }]
    }
};

tm.define("CrashScene", {
    superClass: "tm.app.Scene",

    init: function(px, py, pScaleX, ex, ey) {
        this.superInit();

        this.player = Player().addChildTo(this);
        this.player.setPosition(px, py);
        this.player.scaleX = pScaleX;

        this.enemy = Enemy().addChildTo(this);
        this.enemy.setPosition(ex, ey);

        this.fromJSON(CRASH_LABEL.main);
    },

    update : function(app){
        if(app.keyboard.getKey("enter")){
            app.replaceScene(GameScene());
        }
    }

});
