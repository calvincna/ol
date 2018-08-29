var Menu = {

    preload : function() {
    	if (!fsOpt) {
    	
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
				this.game.width=window.innerWidth
				this.game.height=window.innerHeight
				this.scale.pageAlignHorizontally = true
				this.scale.pageAlignVertically = true
				this.scale.refresh()
				
			/*this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.game.scale.pageAlignHorizontally = true;
			this.game.scale.pageAlignVertically = true;*/
		}
        // Load all the needed resources for the menu.
        this.game.load.image('menu', './assets/images/menu.png');
    },

    create: function () {

        // Add menu screen.
        // It will act as a button to start the game.
        this.add.button(0, 0, 'menu', this.startGame, this);
        this.game.stage.backgroundColor = '#061f27';

    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};