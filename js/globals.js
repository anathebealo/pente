
var gameBoard = d3.select('#gameboard');
// gameBoard
	// .style('width', '100%')

var firstPlay = true;
var lineSpace = 32;
var boardSize = (gameState.board.length-1) * lineSpace;
var boardOffset = lineSpace;
var playerColor = 'green';
var cpuColor = 'red';
var cellEaseFunc = 'linear'
var cellEntranceDelay = 160;
var HUMAN_MARKER = 1; 
var AI_MARKER = 2;