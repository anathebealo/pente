//TODO: use marker values from globals.js
var EMPTY_MARKER = 0;
var HUMAN_MARKER = 1; 
var AI_MARKER = 2;

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
				print_board(gameState.board);
				if( count_other_player_in_row(gameState.board, row, col, i, j, human_marker) == 2 ) {
					if( row + 3*i > -1 && row + 3*i < gameState.board.length &&
						col + 3*j > -1 && col + 3*j < gameState.board[row].length) {
						if( gameState.board[row + 3*i][col + 3*j] == human_marker ) {
							gameState.board[row + 2*i][col + 2*j] = EMPTY_MARKER;
							gameState.board[row + i][col + j] = EMPTY_MARKER;
							gameState.human_captures++;
						}
					}
				}
			}
		}
	}
	console.log("human made a move!"); 
	gameState.board[row][col] = human_marker;

	renderBoard();
	make_ai_move();
}

function make_ai_move() {
	var new_board = find_next_move(gameState, 2);

	var row;
	var col;
	for( var i = 0; i<gameState.board.length; i++) {
		for( var j = 0; j<gameState.board[i].length; j++) {
			if(new_board[i][j] != gameState.board[i][j] && new_board[i][j] == AI_MARKER) {
				row = i; 
				col = j;
				break;
			}
		}
	}
	console.log("row: " + row + ", col: " + col); 

	for( var i = -1; i<2; i++ ) {
		for( var j = -1; j<2; j++ ) {
			if( i != 0 || j != 0 ) {
				if( count_other_player_in_row(gameState.board, row, col, i, j, AI_MARKER) == 2 ) {
					if( row + 3*i > -1 && row + 3*i < gameState.board.length &&
						col + 3*j > -1 && col + 3*j < gameState.board[row].length) {
						if( gameState.board[row + 3*i][col + 3*j] == AI_MARKER ) {
							gameState.board[row + 2*i][col + 2*j] = EMPTY_MARKER;
							gameState.board[row + i][col + j] = EMPTY_MARKER;
							gameState.ai_captures++;
						}
					}
				}
			}
		}
	}

	gameState.board[row][col] = AI_MARKER;
	renderBoard();
}