//language = Javescript.

/* 
given: board/state -- state is a board? double int array. 
given: color to maximize score
given: target depth
need to give: location of next move -- x,y coordinate

board has three possible numbers: 0, 1 and 2 -- 0 = unoccupied and 1,2 = player #
AI is always player 2 ***

*/

var AI_PLAYER = 2;
var HUMAN_PLAYER = 1; 

main();

function main() {
	//board = [[0,0,0,2], [0,0,1,1], [0,0,0,1], [2,1,1,0]];
	//make_ai_move(find_next_move(board, 2)));
}

function return_game_obj(in_board, in_captures_p1_has, in_captures_p2_has, in_just_captured) {
	return {
				board: in_board, 
				captures_p1_has: in_captures_p1_has, 
				captures_p2_has: in_captures_p2_has, 
				just_captured: in_just_captured
			};
}

function find_next_move(board, depth) {
	var new_board = max_value(board, depth).board_state;
	console.log("new board");
	print_board(new_board);
	return new_board; 
}

//max looks to maximize player 2's moves
function max_value(board, depth) {
	if( depth == 0 ) {
		var ret_val = {
			heuristic_val: heuristic(board, AI_PLAYER),
			board_state: board
		};
		return ret_val;
	} else {
		var alpha = Number.NEGATIVE_INFINITY; 
		var best_board = undefined;
		var all_boards = find_all_moves_on_board(board, AI_PLAYER);
		
		all_boards.forEach(function(next_board){
			var min_val = min_value(next_board, depth -1);
			if (min_val.heuristic_val > alpha){
				alpha = min_val.heuristic_val;
				best_board = copy_array(next_board);
			}
		});

		return {
			heuristic_val: alpha,
			board_state: best_board
		};
	}
}

//min looks to maximize player 1's moves
function min_value(board, depth) {
	if( depth == 0 ) {
		var ret_val = {
			heuristic_val: heuristic(board, HUMAN_PLAYER),
			board_state: board
		};
		return ret_val;
	} else {
		var beta = Infinity;
		var best_board = undefined;
		var all_boards = find_all_moves_on_board(board, HUMAN_PLAYER);
		
		all_boards.forEach(function(next_board){
			var max_val = max_value(next_board, depth - 1);
			if (max_val.heuristic_val < beta){
				beta = max_val.heuristic_val;
				best_board = copy_array(next_board);
			}
		});

		return {
			heuristic_val: beta,
			board_state: best_board
		};
	}
}
function print_board(board){
	var string_to_print = ""; 
	for( var i = 0; i<board.length; i++ ) {
		for( var j = 0; j<board[i].length; j++ ) {
			string_to_print += board[j][i] + ", "; 
		} 
		console.log(i + ": " + string_to_print)
		string_to_print = ""; 
	}
}
function find_all_moves_on_board(board, player_num) {
	var board_states = [];
	var count = 0;
	for( var i = 0; i<board.length; i++ ) {
		for( var j = 0; j<board[i].length; j++ ) {
			if( board[i][j] == 0 ) {
				var next_state = copy_array(board);
				make_move(next_state, player_num, i, j);
				board_states.push(copy_array(next_state));
			}
		} 
	}
	return board_states;
}

function make_move(board, player_num, row, col) {
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
	return board;
}

function count_other_player_in_row(board, row, col, i, j, player_num) {
	var player_in_row_count = 1;
	var other_player = 0; 

	if(player_num == HUMAN_PLAYER) {
		other_player = AI_PLAYER;
	} else {
		other_player = HUMAN_PLAYER;
	}

	while( true ){
		if(row + i*player_in_row_count > -1 && row + i*player_in_row_count < board.length &&
			col + j*player_in_row_count > -1 && col + j*player_in_row_count < board[row].length) {

			if( board[row + i*player_in_row_count][col + j*player_in_row_count] == other_player){
				player_in_row_count++;
			} else {
				return player_in_row_count - 1;
			}

		} else {
			return player_in_row_count - 1;
		}
	}
	return player_in_row_count - 1;
}

function copy_array(board) {
	var new_array = [];
	for( var i = 0; i<board.length; i++ ) {
		new_array.push(board[i].slice());
	}

	return new_array;
}

function heuristic(board, player_num) {
	// TODO: THIS IS DUMB -- MAKE IT BETTER PLEASEEEE
	var ret_val = 0;
	if(board[0][0] == 2) {
		return 100; 
	} else if(board[0][2] == 2) {
		return 99;
	} else {
		ret_val = -100;
	}

	return ret_val; 


}



