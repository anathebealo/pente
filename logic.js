var makeBoard = function(size){
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

var PLAYER_NUM = 1;
var AI_NUM = 2;

var boardState = makeBoard();


boardState[5][0] = AI_NUM
boardState[4][0] = AI_NUM
boardState[3][0] = PLAYER_NUM
boardState[2][0] = AI_NUM
boardState[1][0] = AI_NUM
boardState[0][0] = PLAYER_NUM
boardState[4][3] = AI_NUM
boardState[5][3] = AI_NUM


var currPlayer = PLAYER_NUM;

var getOtherPlayer = function(playerNum){
	if (playerNum == PLAYER_NUM){
		return AI_NUM;
	} else return PLAYER_NUM;
}

var makeMove = function(i, j){
	boardState[i][j] = currPlayer;
	currPlayer = getOtherPlayer(currPlayer);
}

function make_human_move(board, player_num, row, col) {
	for( var i = -1; i<2; i++ ) {
		for( var j = -1; j<2; j++ ) {
			if( i != 0 || j != 0 ) {
				if( count_other_player_in_row(board, row, col, i, j, player_num) == 2 ) {
					if( row + 3*i > -1 && row + 3*i < board.length &&
						col + 3*j > -1 && col + 3*j < board[row].length) {
						if( board[row + 3*i][col + 3*j] == player_num ) {
							board[row + 2*i][col + 2*j] = 0;
							board[row + i][col + j] = 0;
						}
					}
				}
			}
		}
	}
console.log("human made a move!"); 
	board[row][col] = player_num;
	print_board(boardState);

	renderBoard();
	make_ai_move(board, AI_NUM);
}

function make_ai_move(board, player_num) {
	var new_board = find_next_move(board, 1);

	var row;
	var col;
	for( var i = 0; i<board.length; i++) {
		for( var j = 0; j<board[i].length; j++) {
			if(new_board[i][j] != board[i][j] && new_board[i][j] == player_num) {
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
				if( count_other_player_in_row(board, row, col, i, j, player_num) == 2 ) {
					if( row + 3*i > -1 && row + 3*i < board.length &&
						col + 3*j > -1 && col + 3*j < board[row].length) {
						if( board[row + 3*i][col + 3*j] == player_num ) {
							board[row + 2*i][col + 2*j] = 0;
							board[row + i][col + j] = 0;
						}
					}
				}
			}
		}
	}

	board[row][col] = player_num;
	//boardState = board;
	print_board(board);
	renderBoard();
}