var Start = {

    preload : function() {
    	//if (!fsOpt) {
    	
    	
    		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.width=window.innerWidth;
			this.game.height=window.innerHeight;
			this.game.scale.pageAlignHorizontally = true;
			this.game.scale.pageAlignVertically = true;
			this.game.scale.refresh();
				
			/*this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.pageAlignHorizontally = true;
			this.game.scale.pageAlignVertically = true;*/
		//}
        // Load all the needed resources for the menu.
        //this.game.load.image('menu', './assets/images/menu.png');
        this.game.load.image('preloaderBg', 'img/loading-bg.png');
		this.game.load.image('preloaderBar', 'img/loading-bar.png');
    },

    create: function () {
    
    


        this.game.stage.backgroundColor = '#061f27';
        this.game.state.start('Preloader');

    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};