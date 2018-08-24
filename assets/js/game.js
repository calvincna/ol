//https://calvincna.github.io/sm/new2/index.html?fs=1&en1=0&trace=0&area=0

// variables used to detect and manage swipes
 var startswX;
 var startswY;
 var endswX;
 var endswY;

var updateDelay = 0;

var mainTop = 0;

var canvasWidth = 400;
var canvasHeight = 640;

var mainOffsetX = 20;
var mainOffsetY = 20;

var gStep = 0;
var gDir = "left";

var mainWidth = canvasWidth - (mainOffsetX);
var mainHeight = canvasHeight - (mainOffsetY);

var gPoly;
var graphics;
var graphicsLine;
var graphics2;
var line1;
var line2;

var en1prevx;
var en1prevy;
var en1SpdX = 26;
var en1SpdY = 26;
var en1Size = 50;

var pSpd = 3;
var pSpd2 = 2;

var traceArr = [];

var gArr = [
  [mainOffsetX, mainOffsetY],
  [mainWidth, mainOffsetY],
  [mainWidth, mainHeight],
  [mainOffsetX, mainHeight]
];

var background;
var foreground;
var player;
var mode = 0;
var turn = "down";
var en1;
var walls;
var traces;
var enemies;
var areaTxt;
var collSize = 3;
var turnMin = 5;

var traceOpt = false;
var en1Opt = false;
var fsOpt = false;
var areaOpt = false;

if	(getParameterByName('trace')) {
	if (getParameterByName('trace')!="0") {
		traceOpt = getParameterByName('trace');
	}
}
if	(getParameterByName('en1')) {
	if (getParameterByName('en1')!="0") {
		en1Opt = getParameterByName('en1');
	}
}
if	(getParameterByName('fs')) {
	if (getParameterByName('fs')!="0") {
		fsOpt = getParameterByName('fs');
	}
}
if	(getParameterByName('area')) {
	if (getParameterByName('area')!="0") {
		areaOpt = getParameterByName('area');
	}
}
	
MonsterBunny = function (game, rotateSpeed) {

    //  We call the Phaser.Sprite passing in the game reference
    //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
    Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, 'en1');

    this.anchor.setTo(0.5, 0.5);

	var rotateSpeed = 4;
    this.rotateSpeed = rotateSpeed;
    game.physics.arcade.enable(this);
    
    
    var randomVel = game.rnd.between(-100, 100);
    this.body.velocity.setTo(randomVel, randomVel);
    this.body.bounce.set(1);
    

    //var randomScale = 0.1 + Math.random();

   this.scale.setTo(0.6, 0.6);

    game.add.existing(this);

};

MonsterBunny.prototype = Object.create(Phaser.Sprite.prototype);
MonsterBunny.prototype.constructor = MonsterBunny;

MonsterBunny.prototype.update = function() {

    //  Automatically called by World.update
    this.angle += this.rotateSpeed;

};

var Game = {

	init: function () {

		game.renderer.renderSession.roundPixels = true;
		game.physics.startSystem(Phaser.Physics.ARCADE);

	},

    preload : function() {
    
    	if (!fsOpt) {
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVertically = true;
		}
        // Here we load all the needed resources for the level.
        game.load.image('background', './assets/images/back.png');
		//this.load.image('foreground', 'assets/images/fore.png');
		game.load.image('player', './assets/images/cr.png');
		game.load.image('en1', './assets/images/en1.png');
		//this.load.bitmapFont('shmupfont', 'assets/images/shmupfont.png', 'assets/images/shmupfont.xml');
		game.load.bitmapFont('carrier_command', './assets/images/carrier_command.png', 'assets/images/carrier_command.xml');
		game.load.image('wall', './assets/images/bullet11.png');
		game.load.image('trace', './assets/images/bulletn1.png');
		game.load.image('pic1', 'assets/images/g1a.png');
		game.load.image('pic2', 'assets/images/g1b.png');
    },

    create : function() {

        // By setting up global variables in the create function, we initialise them on game start.
        // We need them to be globally available so that the update function can alter them.
        
		background = null;
		foreground = null;
		player = null;
		mode = 0;
		turn = "down";
		
		graphicsLine = game.add.graphics(0,0);
		graphics = game.add.graphics(0, 0);
		graphics2 = game.add.graphics(0,0);

        game.stage.backgroundColor = '#061f27';
        
        player = game.add.sprite(mainOffsetX, mainOffsetY, 'player');
		en1 =  game.add.sprite(mainWidth/2, mainHeight/2, 'en1');
		pic1 = game.add.sprite(mainOffsetX, mainOffsetY, 'pic1');
		pic2 = game.add.sprite(mainOffsetX, mainOffsetY, 'pic2');
		
		pic1.width = mainWidth - mainOffsetX;
		pic1.height = mainHeight - mainOffsetY;
		
		pic2.width = pic1.width;
		pic2.height = pic1.height;
		
		//this.en1 =  this.add.sprite(22, 618, 'en1');

		walls = game.add.group();
		traces = game.add.group();
		enemies = game.add.group();

		game.physics.arcade.enable(player);
		game.physics.arcade.enable(en1);
		
		en1.width = en1Size * 1.5;
		en1.height = en1.width;

		// this.player.body.collideWorldBounds = true;
		en1.body.collideWorldBounds = true;
		//this.en1.body.velocity.setTo(250, 250);
		en1.body.velocity.setTo(100, 100);
		en1.body.bounce.set(1);
		
		for (var i = 0.1; i < 2; i += 0.1)
		{
			var enn = new MonsterBunny(game, i);
			enemies.add(enn);
		}
		
		var polyPoints = []
		
		for (var i = 0; i < gArr.length; i++)
		{
			polyPoints.push(gArr[i][0]);
			polyPoints.push(gArr[i][1]);
		}

		gPoly = new Phaser.Polygon(polyPoints);
		
		areaTxt = game.add.bitmapText(55, 40, 'carrier_command', "100%", 15);
		game.input.onDown.add(this.beginSwipe, this);
    },

    update: function() {
        //The update function is called constantly at a high rate (somewhere around 60fps)
        
        graphicsLine.clear();
		graphics.clear();
				
    	updateDelay++;
    	
    	player.anchor.setTo(0.5, 0.5);
		en1.anchor.setTo(0.5, 0.5);
		en1.angle +=4;
		
		//if player is out, process movement
		if (updateDelay % (1) == 0) {
				
			if (mode != 0)
			{
	 
				//if gMode is 1 and position not on wall advance in direction
				//if gMode is 1 and position touched wall, change mode to 0
		
				var preX = player.x;
				var preY = player.y;
				var nextX = player.x;
				var nextY = player.y;

				if (mode === "down") {
					nextY = player.y + pSpd2;
				} else if (mode === "up") {
					nextY = player.y - pSpd2;
				} else if (mode === "left") {
					nextX = player.x - pSpd2;
				} else if (mode === "right") {
					nextX = player.x + pSpd2;
				}
			
				var intFlag = -1;
				
				//check if player crosses any trace
				if (traceArr.length>1) {
				
					var checkFlag = -1;
				
					if ((mode === "down")||(mode === "up")) {
						if (Math.abs(traceArr[traceArr.length-1][1]-nextY)>10) {
							checkFlag = 1;
						}
					} else if ((mode === "left")||(mode === "right")) {
						if (Math.abs(traceArr[traceArr.length-1][0]-nextX)>10) {
							checkFlag = 1;
						}
					}
				
					if (checkFlag == 1) {
				
						line1 = new Phaser.Line(preX, preY, nextX, nextY);
						for (var i = 1; i < traceArr.length; i++)
						{
							line2 = new Phaser.Line(traceArr[i-1][0], traceArr[i-1][1], traceArr[i][0], traceArr[i][1]);
							p = line1.intersects(line2, true);

							if (p) {
								intFlag = i;
							}
			
						}
					}
			
				}
				
				//move player to new position
				player.x = nextX;
				player.y = nextY;
				//drawtraceArr();
				
				
				traces.removeAll(true);
				
				//build trace walls
				if (traceArr.length>1) {
		
		
					for (var i = 1; i < traceArr.length; i++)
					{
				
						//which position to use as start point?
						var startX = traceArr[i][0];
						var startY = traceArr[i][1];
						//if horizontal path
						if (traceArr[i][0] - traceArr[i-1][0]==0) {
							if (traceArr[i][1]<traceArr[i-1][1]) {
								//up
								//startY = traceArr[i][1];
							} else {
								//down
								startY = traceArr[i-1][1];
							}
						} else {
						//vertical
							if (traceArr[i][0]>traceArr[i-1][0]) {
								//right
								startX = traceArr[i-1][0];
							} else {
								//left
								//startX = traceArr[i][0];
							}
						}
			
						var wall1 =  game.add.sprite(startX, startY, 'trace');
						wall1.width = Math.max(Math.abs(traceArr[i][0] - traceArr[i-1][0]),collSize);
						wall1.height = Math.max(Math.abs(traceArr[i][1] - traceArr[i-1][1]),collSize);
						game.physics.arcade.enable(wall1);
						wall1.body.immovable = true;
						traces.add(wall1);
					}
		
				}
		
				//build final trace wall
				if (traceArr.length>0) {
					//which position to use as start point?
					var dir1 = "up";
					var startX = player.x;
					var startY = player.y;
					//if horizontal path
					if (player.x - traceArr[traceArr.length-1][0]==0) {
						if (player.y<traceArr[traceArr.length-1][1]) {
							//up
							//startY = traceArr[i][1];
					
						} else {
							//down
							dir1 = "down";
							startY = traceArr[traceArr.length-1][1];
						}
					} else {
					//vertical
						if (player.x>traceArr[traceArr.length-1][0]) {
							//right
							dir1 = "right";
							startX = traceArr[traceArr.length-1][0];
						} else {
							//left
							dir1 = "left";
							//startX = traceArr[i][0];
						}
					}
		
					var wall1 =  game.add.sprite(startX, startY, 'trace');
		
					wall1.width = Math.max(Math.abs(player.x - traceArr[traceArr.length-1][0]),collSize);
					wall1.height = Math.max(Math.abs(player.y - traceArr[traceArr.length-1][1]),collSize);
			
					game.physics.arcade.enable(wall1);
					wall1.body.immovable = true;
					traces.add(wall1);
				}
				
				//call function when en1 touches trace
				if (en1Opt) {
					game.physics.arcade.overlap(traces, en1, this.traceOverlap, null, this);  
				}
				//this.drawtraceArr();
			
				//if overlap, game over
				if (intFlag > -1) {
					if (traceOpt) {
						this.traceOverlap();
					}
				}
			
				/*var polyPoints = []
			
				for (var i = 0; i < gArr.length; i++)
				{
					polyPoints.push(gArr[i][0]);
					polyPoints.push(gArr[i][1]);
				}
			
				gPoly = new Phaser.Polygon(polyPoints);*/
				
				//check all paths, if touch wall, park on border line and change mode
				if (!gPoly.contains(player.x, player.y)) {
					
					var intFlag = -1;
					var intX = -1;
					var intY = -1;
					
					line1 = new Phaser.Line(preX, preY, player.x, player.y);
					for (var i = 0; i < gArr.length; i++) {
			
						var pasti = i-1;
						if (i-1<0) {
							pasti=gArr.length-1;
						}
				
						line2 = new Phaser.Line(gArr[pasti][0], gArr[pasti][1], gArr[i][0], gArr[i][1]);
				
						p = line1.intersects(line2, true);

						if (p) {
							intFlag = i;
							intX = p.x;
							intY = p.y;
						} else {
					
						}
					}
					
					//intersect found, process polygon
					if (intFlag>-1) {
						
						mode = 0;
						player.x = intX;
						player.y = intY;
				
						//enter final insertion position 
						var posArr = [player.x, player.y];
						traceArr.push(posArr);
				
						//divide into 2 polygons and check size
				
						//get origin insertion point 1 path
						var tpath1 = getStep(traceArr[0][0],traceArr[0][1]);

						//get final insertion point 2 path
						var tpath2 = getStep(traceArr[traceArr.length-1][0],traceArr[traceArr.length-1][1]);

						var path1;
						var path2;
				
						//Set closer to path 0 point as first path
						if (tpath2[0]>tpath1[0]) {
							path1 = tpath1;
							path2 = tpath2;
	
						} else if (tpath2[0]<tpath1[0]) {
							path1 = tpath2;
							path2 = tpath1;
							traceArr = traceArr.reverse();
	
	
						} else if (tpath2[0]==tpath1[0]) {
							//check which came first
	
							path1 = tpath1;
							path2 = tpath2;
							//alert(path1[1]);
	
							//check path which is nearer to path point
							if (path1[1]=="up") {
								if (traceArr[0][1] < traceArr[traceArr.length-1][1]) {
									traceArr = traceArr.reverse();
								}
							} else if (path1[1]=="down") {
								if (traceArr[0][1] > traceArr[traceArr.length-1][1]) {
									traceArr = traceArr.reverse();
								}
							} else if (path1[1]=="left") {
								if (traceArr[0][0] < traceArr[traceArr.length-1][0]) {
									traceArr = traceArr.reverse();
								}
							} else if (path1[1]=="right") {
								//alert(traceArr[0][1] + ":::" + traceArr[traceArr.length-1][1]);
								if (traceArr[0][0] > traceArr[traceArr.length-1][0]) {
									traceArr = traceArr.reverse();
								}
							}
						}
				
						//create now pathArrs
						var newPathArr1 = [];
						var newPathArr2 = [];

						//create path array 1
						//Insert new paths starting from path 0
						//what if path 1 = 0?
						for (var i = 0; i < path1[0]; i++) {
							newPathArr1.push (gArr[i]);
						}
						//insert traceArr path
						for (var i = 0; i < traceArr.length; i++) {
							newPathArr1.push (traceArr[i]);
						}
						//insert paths after insertion point 2
						for (var i = path2[0]; i < gArr.length; i++) {
							newPathArr1.push (gArr[i]);
						}

						//create path array 2
						traceArr = traceArr.reverse();

						for (var i = (path1[0]); i < (path2[0]); i++) {
							newPathArr2.push (gArr[i]);
						}
						//insert traceArr path
						for (var i = 0; i < traceArr.length; i++) {
							newPathArr2.push (traceArr[i]);
						}
				
				
						var polyPoints = []

						for (var i = 0; i < newPathArr1.length; i++)
						{
							polyPoints.push(newPathArr1[i][0]);
							polyPoints.push(newPathArr1[i][1]);
						}

						var gPoly2 = new Phaser.Polygon(polyPoints);
				
						if (gPoly2.contains(en1.x, en1.y)) {
							/*gArr = [];
							for (var i = 0; i <  newPathArr1.length; i++) {
								gArr.push([newPathArr1[i][0],newPathArr1[i][1]]);
							}*/
							gArr = newPathArr1;
						} else {
							/*gArr = [];
							for (var i = 0; i <  newPathArr2.length; i++) {
								gArr.push([newPathArr2[i][0],newPathArr2[i][1]]);
							}*/
							gArr = newPathArr2;
						}
						
						//recreate gPoly
						var polyPoints = []
	
						for (var i = 0; i < gArr.length; i++)
						{
							polyPoints.push(gArr[i][0]);
							polyPoints.push(gArr[i][1]);
						}

						gPoly = new Phaser.Polygon(polyPoints);
						
						//area check
						en1.width = (en1Size * (gPoly.area/(mainWidth*mainHeight))) + (en1Size * 0.5);
						en1.height = en1.width;

						var areaP = (Math.round(gPoly.area/((mainWidth - mainOffsetX)*(mainHeight - mainOffsetY))*100));

						areaTxt.text = areaP+"%";

						//gameover if WIN
						if (areaOpt) {
							if (areaP<16) {
								//alert("WIN!");
								//this.state.start('Menu');
								//game.state.start(game.state.current);
								//location.reload();
								//en1.destroy();
								alert("WIN!");
								this.traceOverlap();
		
							}
						}

						if (!gPoly.contains(en1.x, en1.y)) {
	
							en1.body.reset(en1.body.prev.x, en1.body.prev.y);
	
							if (traceOpt) {
								this.traceOverlap();
							}
	
						}
				
						traceArr = [];
						traces.removeAll(true);
						//this.drawtraceArr();
				
					}
			
				}
				
			}
		}
		
		
		//draw polygon for image
		graphics.beginFill(0xCCCCCC, 0.3);
		graphics.drawPolygon(gPoly.points);
		graphics.endFill();
		
		pic2.mask = graphics;
		
        
       	walls.removeAll(true);
				
		//draw external paths
		for (var i = 0; i < gArr.length; i++)
		{
			var pasti = i-1;
			if (i-1<0) {
				pasti=gArr.length-1;
			}
			//which position to use as start point?
			var startX = gArr[i][0];
			var startY = gArr[i][1];
			//if horizontal path
			if (gArr[i][0] - gArr[pasti][0]==0) {
				if (gArr[i][1]<gArr[pasti][1]) {
					//up
					//startY = gArr[i][1];
					startX -= collSize;
				} else {
					//down
					startY = gArr[pasti][1];
					//startX += collSize;
				}
			} else {
			//vertical
				if (gArr[i][0]>gArr[pasti][0]) {
					//right
					startX = gArr[pasti][0];
					startY -= collSize;
				} else {
					//left
					//startX = gArr[i][0];
					//startY += collSize;
				}
			}
			var wall1 =  game.add.sprite(startX, startY, 'wall');
			wall1.width = Math.max(Math.abs(gArr[i][0] - gArr[pasti][0]),collSize);
			wall1.height = Math.max(Math.abs(gArr[i][1] - gArr[pasti][1]),collSize);
			game.physics.arcade.enable(wall1);
			wall1.body.immovable = true;
			walls.add(wall1);
		}
		
		game.physics.arcade.collide(en1, walls);
		game.physics.arcade.collide(enemies, walls);
		
		//set auto rotate indicator 
		if (updateDelay % (55) == 0) {
			if (mode=="down") {
				if (turn == "left") {
					turn = "right";
					player.angle = 0;
				} else {
					turn = "left";
					player.angle = 180;
				}
			} else if (mode=="up") {
				if (turn == "left") {
					turn = "right";
					player.angle = 0;
				} else {
					turn = "left";
					player.angle = 180;
				}
			} else if (mode=="left") {
				if (turn == "up") {
					turn = "down";
					player.angle = 90;
				} else {
					turn = "up";
					player.angle = 270;
				}
			} else if (mode=="right") {
				if (turn == "up") {
					turn = "down";
					player.angle = 90;
					
				} else {
					turn = "up";
					player.angle = 270;
				}
		
			}
		}
		
		//mode 0 normal player movement
		if (updateDelay % (1) == 0) {
		
			if (mode === 0)
			{
				var getDirNow = getStep (player.x , player.y);
		
				if (getDirNow[1] == "up") {
					player.y -= pSpd;
					player.angle = 0;
					if (player.y < gArr[getDirNow[0]][1]) {
						player.y = gArr[getDirNow[0]][1];
					}
			
				} else if (getDirNow[1] == "down") {
					player.y += pSpd;
					player.angle = 180;
					if (player.y > gArr[getDirNow[0]][1]) {
						player.y = gArr[getDirNow[0]][1];
					}
			
				}  else if (getDirNow[1] == "left") {
					player.x -= pSpd;
					player.angle = 270;
					if (player.x < gArr[getDirNow[0]][0]) {
						player.x = gArr[getDirNow[0]][0];
					}
			
				}  else if (getDirNow[1] == "right") {
					player.x += pSpd;
					player.angle = 90;
					if (player.x > gArr[getDirNow[0]][0]) {
						player.x = gArr[getDirNow[0]][0];
					}
				}
			} 
		}
			
			
		game.world.bringToTop(walls);
		game.world.bringToTop(traces);
		game.world.bringToTop(en1);
		game.world.bringToTop(player);
	},
	
	beginSwipe: function(pointer) {
		startswX = game.input.worldX;
		startswY = game.input.worldY;
		game.input.onDown.remove(this.beginSwipe, this);
		game.input.onUp.add(this.endSwipe, this);
		
		//game.input.onDown.remove(this.this.beginSwipe);
		//game.input.onUp.add(this.this.endSwipe);
	},
	
	// function to be called when the player releases the mouse/finger
	endSwipe: function() {
	
		//if mode 0, just move based on path dir
		
			
		if (mode === 0)
		{
			var getDirNow = getStep (player.x , player.y);
			//console.log(this.player.x + "::" + this.player.y + "::" + getDirNow[0] + "::" + getDirNow[1]);
		
			if (getDirNow[1] == "up") {
				mode ="right";
				turn = "up";
				player.angle = 270;
				var posArr = [player.x, player.y];
				traceArr.push(posArr);
			
			} else if (getDirNow[1] == "down") {
				mode ="left";
				turn = "up";
				player.angle = 270;
				var posArr = [player.x,player.y];
				traceArr.push(posArr);
			
			}  else if (getDirNow[1] == "left") {
				mode ="up";
				turn = "left";
				player.angle = 180;
				var posArr = [player.x,player.y];
				traceArr.push(posArr);
			
			}  else if (getDirNow[1] == "right") {
				mode ="down";
				turn = "left";
				player.angle = 180;
				var posArr = [player.x,player.y];
				traceArr.push(posArr);
			}
		
			//this.player.rotation = this.math.angleBetween(this.player.x,this.player.y,mainWidth/2,mainHeight/2);
		
		} else {
		
		
		
			// saving mouse/finger coordinates
			endswX = game.input.worldX;
			endswY = game.input.worldY;
			// determining x and y distance travelled by mouse/finger from the start
			// of the swipe until the end
			var distX = startswX-endswX;
			var distY = startswY-endswY;
			// in order to have an horizontal swipe, we need that x distance is at least twice the y distance
			// and the amount of horizontal distance is at least 10 pixels
			if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX)>10){
			
				// moving left, calling move function with horizontal and vertical tiles to move as arguments
				if(distX>0){
					//move(-1,0);
					if ((mode == "down")||(mode == "up")) {
						if (Math.abs(traceArr[traceArr.length-1][1]-player.y)>turnMin) {
							mode = "left";
							turn = "up";
							player.angle = 270;
							var posArr = [player.x,player.y];
							traceArr.push(posArr);
						}
					} 
				}
				// moving right, calling move function with horizontal and vertical tiles to move as arguments
				else{
					//move(1,0);
					if ((mode == "down")||(mode == "up")) {
						if (Math.abs(traceArr[traceArr.length-1][1]-player.y)>turnMin) {
							mode = "right";
							turn = "up";
							player.angle = 270;
							var posArr = [player.x,player.y];
							traceArr.push(posArr);
						}
					} 
				}
				   
			}
			// in order to have a vertical swipe, we need that y distance is at least twice the x distance
			// and the amount of vertical distance is at least 10 pixels
			else if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY)>10){
			
				// moving up, calling move function with horizontal and vertical tiles to move as arguments
				if(distY>0){
					//move(0,-1);
					if ((mode == "left")||(mode == "right")) {
						if (Math.abs(traceArr[traceArr.length-1][0]-player.x)>turnMin) {
							mode = "up";
							turn = "left";
							player.angle = 180;
							var posArr = [player.x,player.y];
							traceArr.push(posArr);
						}
					}
				}
				// moving down, calling move function with horizontal and vertical tiles to move as arguments
				else{
					//move(0,1);
					if ((mode == "left")||(mode == "right")) {
						if (Math.abs(traceArr[traceArr.length-1][0]-player.x)>turnMin) {
							mode = "down";
							turn = "left";
							player.angle = 180;
							var posArr = [player.x,player.y];
							traceArr.push(posArr);
						}
					}
				}
				
			} else {
			
				//normal tap
			
				if (mode == "down") {
					if (Math.abs(traceArr[traceArr.length-1][1]-player.y)>turnMin) {
						mode = turn;
						turn = "up";
						player.angle = 270;
						var posArr = [player.x,player.y];
						traceArr.push(posArr);
					}
				} else if (mode == "up") {
					if (Math.abs(traceArr[traceArr.length-1][1]-player.y)>turnMin) {
						mode = turn;
						turn = "up";
						player.angle = 270;
						var posArr = [player.x,player.y];
						traceArr.push(posArr);
					}
				} else if (mode == "left") {
					if (Math.abs(traceArr[traceArr.length-1][0]-player.x)>turnMin) {
						mode = turn;
						turn = "left";
						player.angle = 180;
						var posArr = [player.x,player.y];
						traceArr.push(posArr);
					}
				} else if (mode == "right") {
					if (Math.abs(traceArr[traceArr.length-1][0]-player.x)>turnMin) {
						mode = turn;
						turn = "left";
						player.angle = 180;
						var posArr = [player.x,player.y];
						traceArr.push(posArr);
					}
				
				}
				
			}
		
		}
		
		// stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
		game.input.onDown.add(this.beginSwipe, this);
		game.input.onUp.remove(this.endSwipe, this);
	},
    
    drawtraceArr: function () {
		//draw out path from traceArr
		if (traceArr.length>0) {
			
			
			graphicsLine.lineStyle(2, 0xffd900, 1);
			graphicsLine.moveTo(traceArr[0][0],traceArr[0][1]);
			
			for (var i = 1; i < traceArr.length; i++) {
		
				 graphicsLine.lineTo(traceArr[i][0],traceArr[i][1]);
			}
			graphicsLine.lineTo(player.x, player.y);
			graphicsLine.endFill();
		} else {
			//alert("000");
		}
	},
    
    traceOverlap: function () {
		alert("Game over");
		//location.reload();
		//en1.destroy();
		//traces.destroy();
		
		game.state.restart();
        game.state.start('Menu');
				
	},
	
	shutdown:function(){
	
		gArr = [
		  [mainOffsetX, mainOffsetY],
		  [mainWidth, mainOffsetY],
		  [mainWidth, mainHeight],
		  [mainOffsetX, mainHeight]
		];
		
		traceArr =[];
	
		mode = 0;
		turn = "down";
	
        background = null;
		foreground = null;
		player = null;
		mode = 0;
		turn = "down";
		
		graphicsLine.clear();
		graphics.clear();
		graphics2.clear();
        
        player = game.add.sprite(mainOffsetX, mainOffsetY, 'player');
		en1 =  game.add.sprite(mainWidth/2, mainHeight/2, 'en1');
		
		walls.removeAll(true);
		traces.removeAll(true);
		
		game.physics.arcade.enable(player);
		game.physics.arcade.enable(en1);
		
		en1.width = en1Size * 1.5;
		en1.height = en1.width;

		// this.player.body.collideWorldBounds = true;
		en1.body.collideWorldBounds = true;
		//this.en1.body.velocity.setTo(250, 250);
		en1.body.velocity.setTo(100, 100);
		en1.body.bounce.set(1);
		
		areaTxt.text = "100%";
    }

};

function getStep(xIn, yIn) {
	//https://stackoverflow.com/questions/36523507/detection-and-response-ball-to-wall-collision-inside-any-polygon

	var dirNow= -1;
	//find out which step the point touches
	var stepNow = -1;
	
	for (var i = 0; i < gArr.length; i++) {
		//console.log("check path: " + i);
	
		var pasti = i-1;
		if (i-1<0) {
			pasti=gArr.length-1;
		}
		
		var na1;
		var na2;
	
		//check x same or y same as prev point
		if (gArr[pasti][0]==gArr[i][0]) {
			//console.log("step with same X:" + gArr[pasti][0] );
			
			if (xIn==gArr[pasti][0]) {
				//console.log("gpiece with same X:" + xIn );
				
				na1 = gArr[i][1]; //higher - smaller
				na2 = gArr[pasti][1]; //lower - bigger
		
				if (gArr[pasti][1]>gArr[i][1]) {
					//na1 = gArr[i][1]; //higher - smaller
					//na2 = gArr[pasti][1]; //lower - bigger
					
					//dirNow = "up";
					//includes last point on the line
					if (yIn>na1 && yIn<=na2) {
						stepNow = i;
						dirNow = "up";
					} 
				
				} else {
					
					//na1 = gArr[i][1]; //lower - bigger
					//na2 = gArr[pasti][1]; //higher - smaller
					
					if (yIn>=na2 && yIn<na1) {
						stepNow = i;
						dirNow = "down";
					}
				}
				
			} else {
				//console.log("gpiece not with same X:" + xIn );
			}
		
		} else {
		
			if (yIn==gArr[pasti][1]) {
				//console.log("gpiece with same Y:" + yIn );
				
				na1 = gArr[i][0];
				na2 = gArr[pasti][0];
		
				if (gArr[pasti][0]>gArr[i][0]) {
					
					if (xIn>na1 && xIn<=na2) {
						stepNow = i;
						dirNow = "left";
					}
			
				} else {
					
					if (xIn<na1 && xIn>=na2) {
						stepNow = i;
						dirNow = "right";
					}
				}
				
			} else {
				//console.log("gpiece not with same Y:" + yIn );
			}
			
		}
	}
	var stepNowArr = [stepNow, dirNow];
	return stepNowArr;

}

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}