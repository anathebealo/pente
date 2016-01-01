var makeBoard = function(size){
	if (!size) size = 6;
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

//TODO: use marker values from globals.js
var HUMAN_MARKER = 1; 
var AI_MARKER = 2;

var boardState = makeBoard();
var currPlayer = HUMAN_MARKER;

var getOtherPlayer = function(playerNum){
	if (playerNum == HUMAN_MARKER){
		return AI_MARKER;
	} else return HUMAN_MARKER;
}

var makeMove = function(i, j){
	boardState[i][j] = currPlayer;
	currPlayer = getOtherPlayer(currPlayer);
}

function make_human_move(board, human_marker, row, col) {
	for( var i = -1; i<2; i++ ) {
		for( var j = -1; j<2; j++ ) {
			if( i != 0 || j != 0 ) {
				if( count_other_player_in_row(board, row, col, i, j, human_marker) == 2 ) {
					if( row + 3*i > -1 && row + 3*i < board.length &&
						col + 3*j > -1 && col + 3*j < board[row].length) {
						if( board[row + 3*i][col + 3*j] == human_marker ) {
							board[row + 2*i][col + 2*j] = 0;
							board[row + i][col + j] = 0;
						}
					}
				}
			}
		}
	}
	console.log("human made a move!"); 
	board[row][col] = human_marker;
	print_board(boardState);

	renderBoard();
	make_ai_move(board, AI_MARKER);
}

function make_ai_move(board, ai_marker) {
	var new_board = find_next_move(board, 1);

	var row;
	var col;
	for( var i = 0; i<board.length; i++) {
		for( var j = 0; j<board[i].length; j++) {
			if(new_board[i][j] != board[i][j] && new_board[i][j] == ai_marker) {
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
				if( count_other_player_in_row(board, row, col, i, j, ai_marker) == 2 ) {
					if( row + 3*i > -1 && row + 3*i < board.length &&
						col + 3*j > -1 && col + 3*j < board[row].length) {
						if( board[row + 3*i][col + 3*j] == ai_marker ) {
							board[row + 2*i][col + 2*j] = 0;
							board[row + i][col + j] = 0;
						}
					}
				}
			}
		}
	}

	board[row][col] = ai_marker;
	//boardState = board;
	print_board(board);
	renderBoard();
}