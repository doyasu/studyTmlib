
var SCREEN_WIDTH    = 400;              // スクリーン幅
var SCREEN_HEIGHT   = 400;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分

// var PIECE_NUM_X     = 5;                // ピースの列数
// var PIECE_NUM_Y     = 5;                // ピースの行数
// var PIECE_NUM       = PIECE_NUM_X*PIECE_NUM_Y;  // ピース数
// var PIECE_OFFSET_X  = 90;               // ピースオフセットX　
// var PIECE_OFFSET_Y  = 240;              // ピースオフセットY
// var PIECE_WIDTH     = 120;              // ピースの幅
// var PIECE_HEIGHT    = 120;              // ピースの高さ

// var FONT_FAMILY_FLAT= "'Helvetica-Light' 'Meiryo' sans-serif";  // フラットデザイン用フォント

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
    app.background = "rgba(250, 250, 250, 1.0)";// 背景色

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



        var self = this;

        // // カレント数
        // self.currentNumber = 1;
        //
        // // ピースグループ
        // this.pieceGroup = tm.app.CanvasElement();
        // this.addChild(this.pieceGroup);
        //
        // // 数字配列
        // var nums = [].range(1, PIECE_NUM+1);  // 1~25
        // nums.shuffle(); // シャッフル
        //
        // // ピースを作成
        // for (var i=0; i<PIECE_NUM_Y; ++i) {
        //     for (var j=0; j<PIECE_NUM_X; ++j) {
        //         // 数値
        //         var number = nums[ i*PIECE_NUM_X+j ];
        //         // ピースを生成してピースグループに追加
        //         var piece = Piece(number).addChildTo(this.pieceGroup);
        //         // 座標を設定
        //         piece.x = j * 125 + PIECE_OFFSET_X;
        //         piece.y = i * 125 + PIECE_OFFSET_Y;
        //         // タッチ時のイベントリスナーを登録
        //         piece.onpointingstart = function() {
        //             // 正解かどうかの判定
        //             if (this.number === self.currentNumber) {
        //                 // クリアかどうかの判定
        //                 if (self.currentNumber === PIECE_NUM) {
        //                     // 結果表示
        //                     var time = (self.app.frame/self.app.fps)|0;
        //                     alert("GameClear: {0}".format(time));
        //                 }
        //                 self.currentNumber += 1;// インクリメント
        //                 this.disable();         // ボタン無効
        //             }
        //         };
        //     }
        // }
    },

    update : function(app){
        if(app.keyboard.getKey("left")){
            this.player.x -= 8;
            this.player.scaleX = -1;
        }
        else if(app.keyboard.getKey("right")){
            this.player.x += 8;
            this.player.scaleX = 1;
        }
        else if(app.keyboard.getKey("up")){
            this.player.y -= 8;
        }
        else if(app.keyboard.getKey("down")){
            this.player.y += 8;
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

/*
 * ピースクラス
 */
// tm.define("Piece", {
//     superClass: "tm.app.Shape",
//
//     init: function(number) {
//         this.superInit(PIECE_WIDTH, PIECE_HEIGHT);
//         // 数値をセット
//         this.number = number;
//
//         this.setInteractive(true);
//         this.setBoundingType("rect");
//
//         var angle = tm.util.Random.randint(0, 360);
//         this.canvas.clearColor("hsl({0}, 80%, 70%)".format(angle));
//
//         this.label = tm.app.Label(number).addChildTo(this);
//         this.label
//             .setFontSize(70)
//             .setFontFamily(FONT_FAMILY_FLAT)
//             .setAlign("center")
//             .setBaseline("middle");
//     },
//
//     disable: function() {
//         this.setInteractive(false);
//
//         var self = this;
//         this.tweener
//             .clear()
//             .to({scaleX:0}, 100)
//             .call(function() {
//                 self.canvas.clearColor("rgb(100, 100, 100)");
//             }.bind(this))
//             .to({scaleX:1, alpha:0.5}, 100);
//     }
// });
