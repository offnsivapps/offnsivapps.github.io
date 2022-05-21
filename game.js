var game;

var ballDistance = 155;
var rotationSpeed = 4;
var angleRange = [25, 145];
var visibleTargets = 10;
var bgColors = [0x000000, 0xd21034] //, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2];


window.onload = function() {
     game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "");
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame");

     //alert('KIRRA IS A BITCH')
}

var playGame = function(game){};

playGame.prototype = {
     preload: function(){
          game.load.image("ball", "ball.png");
          game.load.image("target", "target.png");
          game.load.image("arm", "arm.png");
          game.scale.pageAlignHorizontally = true;
          game.scale.pageAlignVertically = true;
          //game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
           game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
           //game.scale.refresh();

          // game.scale.scaleMode = Phaser.Scale.NONE;
           game.scale.refresh();

     },
     create: function(){
          this.savedData = localStorage.getItem("circlepath2")==null?{score:0}:JSON.parse(localStorage.getItem("circlepath2"));

          this.savedCoins = localStorage.getItem("totalcoins")==null?{score:0}:JSON.parse(localStorage.getItem("totalcoins"));


          var style = {
               font: " 28px Arial",
               fill: "#d21034"
          };
 var styleA = {
               font: " 28px Arial",
               fill: "#d21034"
          };
          var style2 = {
             font: "bold 50px Arial",
             fill: "#ffffff"
          };
         // this.text = game.add.text(0, game.height - 64, "hi-score: "+this.savedData.score.toString(), style);

          this.text2 = game.add.text(game.width / 2, game.height -100, 0,  style2);
          this.text2.anchor.set(0.5);

          this.text2A = game.add.text(game.width / 2, game.height - 50, 'COINS',  style);
          this.text2A.anchor.set(0.5);

            this.text2b = game.add.text(game.width / 2, 50, '(C) 2022 ROBERT GLOGINJA',  styleA);
             this.text2b.anchor.set(0.5);
          //text.alpha = 0 3;
          this.destroy = false;
          this.saveRotationSpeed = rotationSpeed;
          this.tintColor = bgColors[0];
          do{
               this.tintColor2 = bgColors[1];
          } while(this.tintColor == this.tintColor2)
          game.stage.backgroundColor = this.tintColor;
          this.targetArray = [];
          this.steps = 0;
          this.rotatingDirection = game.rnd.between(0, 1);
          this.gameGroup = game.add.group();
          this.targetGroup = game.add.group();
          this.ballGroup = game.add.group();
          this.gameGroup.add(this.targetGroup);
          this.gameGroup.add(this.ballGroup);
          this.arm = game.add.sprite(game.width / 2.5, game.height / 4.5 * 2.7, "arm");
          this.arm.anchor.set(0, 0.5);
          this.arm.tint = this.tintColor2;
          this.ballGroup.add(this.arm);
          this.balls = [
               game.add.sprite(game.width / 2.5, game.height / 4.5 * 2.7, "ball"),
               game.add.sprite(game.width / 2.5, game.height / 2.5, "ball")
          ]
                  ///.balls.setScale(1, 3);

          this.balls[0].anchor.set(0.5);
          this.balls[0].tint = this.tintColor2;
          this.balls[1].anchor.set(0.5);
          this.balls[1].tint = this.tintColor2;
          this.ballGroup.add(this.balls[0]);
          this.ballGroup.add(this.balls[1]);
          this.rotationAngle = 0;
          this.rotatingBall = 1;
          var target = game.add.sprite(0, 0, "target");
          target.anchor.set(0.5);
          target.x = this.balls[0].x;
          target.y = this.balls[0].y;
          this.targetGroup.add(target);
          this.targetArray.push(target);
          game.input.onDown.add(this.changeBall, this);
          for(var i = 0; i < visibleTargets; i++){
               this.addTarget();
          }

     },
     update: function(){
          var distanceFromTarget = this.balls[this.rotatingBall].position.distance(this.targetArray[1].position);
          if(distanceFromTarget > 20 && this.destroy && this.steps > visibleTargets){
               this.gameOver();
          }
          if(distanceFromTarget < 20 && !this.destroy){

                 this.destroy = true;

          }
          this.rotationAngle = (this.rotationAngle + this.saveRotationSpeed * (this.rotatingDirection * 2.2 - 1)) % 360;
          this.arm.angle = this.rotationAngle + 90;
          this.balls[this.rotatingBall].x = this.balls[1 - this.rotatingBall].x - ballDistance * Math.sin(Phaser.Math.degToRad(this.rotationAngle));
          this.balls[this.rotatingBall].y = this.balls[1 - this.rotatingBall].y + ballDistance * Math.cos(Phaser.Math.degToRad(this.rotationAngle));
          var distanceX = this.balls[1 - this.rotatingBall].worldPosition.x - game.width / 2;
          var distanceY = this.balls[1 - this.rotatingBall].worldPosition.y - game.height / 4 * 2.7;
          this.gameGroup.x = Phaser.Math.linearInterpolation([this.gameGroup.x, this.gameGroup.x - distanceX], 0.5);
          this.gameGroup.y = Phaser.Math.linearInterpolation([this.gameGroup.y, this.gameGroup.y - distanceY], 0.05);
     },
     changeBall:function(){

           //rotationSpeed = rotationSpeed + 1;
          //console.log('Speed: ' + rotationSpeed)
          this.destroy = false;
          //this.text2b.destroy();

          var distanceFromTarget = this.balls[this.rotatingBall].position.distance(this.targetArray[1].position);
          if(distanceFromTarget < 20){
               this.rotatingDirection = game.rnd.between(0, 1);
               var detroyTween = game.add.tween(this.targetArray[0]).to({
                    alpha: 0
               }, 200, Phaser.Easing.Cubic.Out, true);
               detroyTween.onComplete.add(function(e){
                    e.destroy();
               })
               this.targetArray.shift();
               this.arm.position = this.balls[this.rotatingBall].position;
               this.rotatingBall = 1 - this.rotatingBall;
               this.rotationAngle = this.balls[1 - this.rotatingBall].position.angle(this.balls[this.rotatingBall].position, true) - 90;
               this.arm.angle = this.rotationAngle + 90;
               for(var i = 0; i < this.targetArray.length; i++){
                    this.targetArray[i].alpha += 1 / 5;
               }
               this.addTarget();
               console.log(this.steps - visibleTargets)

               this.text2.setText(this.steps - visibleTargets)
          }
          else{
               this.gameOver();
          }
     },


     addTarget: function(){

          this.steps++;
          startX = this.targetArray[this.targetArray.length - 1].x;
          startY = this.targetArray[this.targetArray.length - 1].y;
          var target = game.add.sprite(0, 0, "target");
          var randomAngle = game.rnd.between(angleRange[0] + 90, angleRange[1] + 90);
          target.anchor.set(0.5);
          target.x = startX + ballDistance * Math.sin(Phaser.Math.degToRad(randomAngle));
          target.y = startY + ballDistance * Math.cos(Phaser.Math.degToRad(randomAngle));
          target.alpha = 1 - this.targetArray.length * (1 / 7);
          var style = {
               font: "bold 16px Arial",
               fill: "#" + this.tintColor.toString(16),
               align: "center"
          };
          var wormHole = game.rnd.between(1, 50);
          console.log('wormHole: ' + wormHole);

          if(wormHole == 25){
                       var text = game.add.text(0, 0, 'WORM', style);

          } else {
                       var text = game.add.text(0, 0, this.steps.toString(), style);

          }
          //var text = game.add.text(0, 0, 'C', style);
           //var text = game.add.text(0, 0, this.steps.toString(), style);

          //text.alpha = 0.5;
          text.anchor.set(0.5);
          target.addChild(text);
          this.targetGroup.add(target);
          this.targetArray.push(target);

         // rotationSpeed = rotationSpeed + 1;

     },


     gameOver: function(){
          rotationSpeed = 3;
          localStorage.setItem("circlepath2",JSON.stringify({
               score: Math.max(this.savedData.score, this.steps - visibleTargets)

	     }));

	   //  alert(this.steps - visibleTargets)
          game.input.onDown.remove(this.changeBall, this);
          this.saveRotationSpeed = 0;
          this.arm.destroy();

               this.text2.setText('GAME OVER')
                this.text2A.setText('')
               this.text2.x = game.width/2;
               this.text2.y = game.height/2 - 70;
                this.text2.anchor.set(0.5);



         var style3 = {
                        font: "bold 28px Arial",
                        fill: "#d21034"
                   };
          var text3 = game.add.text(game.width / 2, game.height / 2 + 20, 'RESTART?',  style3);

          text3.anchor.set(0.5);

          var gameOverTween = game.add.tween([this.targetGroup, this.gameGroup ]).to({
               alpha: 0
          }, 50, Phaser.Easing.Cubic.Out, true);
          gameOverTween.onComplete.add(function(){


               //var gameOverTween2 =  game.add.tween(this.balls[1 - this.rotatingBall]).to({
               var gameOverTween2 =  game.add.tween(this.gameGroup ).to({

                   alpha: 0
               }, 500, Phaser.Easing.Cubic.Out, true);
                gameOverTween2.onComplete.add(function(){
                   //


                   //text3.name = 'text';
                   text3.inputEnabled = true;
                   text3.input.useHandCursor = true;

                   text3.events.onInputDown.add(sayName, this);

             })

          },this)
     }


}

function sayName(e) {
	game.state.start("PlayGame");
}
