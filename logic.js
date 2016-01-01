//TODO: use marker values from globals.js
var EMPTY_MARKER = 0;
var HUMAN_MARKER = 1; 
var AI_MARKER = 2;
var WIN = {};

var gameState = {
	board: makeBoard(),
	human_captures: 0,
	ai_captures: 0
};

function makeBoard(size) {
	if (!size) size = 16;
	var board = [];
	for (var i = 0 ; i < size ; i ++){
		var row = [];
		for (var j = 0; j < size ; j ++){
			row.push(0);
		}
		board.push(row);
	}
	return board;
}

function make_human_move(row, col) {
	for( var i = -1; i<2; i++ ) {
		for( var j = -1; j<2; j++ ) {
			if( i != 0 || j != 0 ) {
				check_for_and_update_capture(gameState, HUMAN_MARKER, row, col, i, j);
			}
		}
	}
	console.log("human made a move!"); 
	gameState.board[row][col] = HUMAN_MARKER;
	renderBoard();
	
	didWin();
	make_ai_move();
}

function make_ai_move() {
	var new_game = find_next_move(gameState, 2);

	var row;
	var col;
	for( var i = 0; i < new_game.board.length; i++) {
		for( var j = 0; j<new_game.board[i].length; j++) {
			if(new_game.board[i][j] != gameState.board[i][j] && new_game.board[i][j] == AI_MARKER) {
				row = i; 
				col = j;
				break;
			}
		}
	}
	console.log("AI moved here:");
	console.log("	row: " + row + ", col: " + col); 

	for( var i = -1; i<2; i++ ) {
		for( var j = -1; j<2; j++ ) {
			if( i != 0 || j != 0 ) {
				check_for_and_update_capture(gameState, AI_MARKER, row, col, i, j);
			}
		}
	}

	gameState.board[row][col] = AI_MARKER;
	renderBoard();
	didWin();
}

function didWin() {
	if(WIN.isWin) {
		return;
	}
	print_game(gameState);
	check_for_win(gameState);
	if( WIN.isWin ) {
		console.log("Winner: " + WIN.winner + ", reason: " + WIN.reason);
		if (WIN.winner == AI_MARKER){
			winMsg.showRedMsg('The Computer Won. ' + WIN.reason)
		} else if (WIN.winner == HUMAN_MARKER){
			winMsg.showGreenMsg('You Won! ' + WIN.reason)
		}
	}

}