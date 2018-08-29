var Preloader = {

	preload: function() {
		//var canvasWidth = 420;
		//var canvasHeight = 720;
		//var canvasWidth = 640;
		//var canvasHeight = 960;
		
		this.preloadBg = this.add.sprite((canvasWidth-297)*0.5, (canvasHeight-145)*0.5, 'preloaderBg');
		this.preloadBar = this.add.sprite((canvasWidth-158)*0.5, (canvasHeight-50)*0.5, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);
		
		this.game.load.image('background', './assets/images/back.png');
		this.game.load.image('player', './assets/images/cr.png');
		this.game.load.image('en1', './assets/images/en1.png');
		this.game.load.bitmapFont('carrier_command', './assets/images/carrier_command.png', 'assets/images/carrier_command.xml');
		this.game.load.image('wall', './assets/images/bullet11.png');
		this.game.load.image('trace', './assets/images/bulletn1.png');
		this.game.load.image('pic1', 'assets/images/g1a.png');
		this.game.load.image('pic2', 'assets/images/g1b.png');
		
		
		
/*
		this.game.load.image('ball', 'img/ball.png');
		this.game.load.image('hole', 'img/hole.png');
		this.game.load.image('element-w', 'img/element-w.png');
		this.game.load.image('element-h', 'img/element-h.png');
		this.game.load.image('panel', 'img/panel.png');
		this.game.load.image('title', 'img/title.png');
		this.game.load.image('button-pause', 'img/button-pause.png');
		this.game.load.image('screen-bg', 'img/screen-bg.png');
		this.game.load.image('screen-mainmenu', 'img/screen-mainmenu.png');
		this.game.load.image('screen-howtoplay', 'img/screen-howtoplay.png');
		this.game.load.image('border-horizontal', 'img/border-horizontal.png');
		this.game.load.image('border-vertical', 'img/border-vertical.png');

		this.load.spritesheet('button-audio', 'img/button-audio.png', 35, 35);
		this.load.spritesheet('button-start', 'img/button-start.png', 146, 51);
		*/

		this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);
	},
	create: function() {
		this.game.state.start('Menu');
	}
};