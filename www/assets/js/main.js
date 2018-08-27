//var canvasWidth = 400;
//var canvasHeight = 640;
var game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, 'game');

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);

// Adding the Game state.
game.state.add('Game', Game);

game.state.start('Menu');