//language = Javescript.

/*
 
BOARD OBJECT: 
	board -- double array
	p1 captures
	p2 captures
*/

/* 
given: board/state -- state is a board? double int array. 
given: color to maximize score
given: target depth
need to give: location of next move -- x,y coordinate

board has three possible numbers: 0, 1 and 2 -- 0 = unoccupied and 1,2 = player #
AI is always player 2 **
*/

/*
	Driver function to find next move
*/	
function find_next_move(gameState, depth) {
	var new_game = max_value(gameState, depth).game_state;
	return new_game; 
}

/*
	Function contributing to minmax algorithm 
	max looks to maximize player 2's moves
*/
function max_value(gameState, depth) {
	if( depth == 0 ) {
		var ret_val = {
			heuristic_val: heuristic(gameState, AI_MARKER),
			game_state: gameState
		};
		return ret_val;
	} else {
		var alpha = Number.NEGATIVE_INFINITY; 
		var best_board = undefined;
		var all_games = find_all_moves_on_board(gameState, AI_MARKER);
		
		all_games.forEach(function(next_game){
			var min_val = min_value(gameState, depth -1);
			if (min_val.heuristic_val > alpha){
				alpha = min_val.heuristic_val;
				best_game = copy_game(next_game);
			}
		});

		return {
			heuristic_val: alpha,
			game_state: best_game
		};
	}
}

/*
	Function contributing to minmax algorithm 
	min looks to maximize player 1's moves
*/
function min_value(gameState, depth) {
	if( depth == 0 ) {
		var ret_val = {
			heuristic_val: heuristic(gameState, HUMAN_MARKER),
			game_state: gameState
		};
		return ret_val;
	} else {
		var beta = Infinity;
		var best_game = undefined;
		var all_games = find_all_moves_on_board(gameState, HUMAN_MARKER);
		
		all_games.forEach(function(next_game){
			var max_val = max_value(next_game, depth - 1);
			if (max_val.heuristic_val < beta){
				beta = max_val.heuristic_val;
				best_game = copy_game(next_game);
			}
		});

		return {
			heuristic_val: beta,
			game_state: best_game
		};
	}
}

/*
	Finds all moves that a player can make on a given board state. Returns a list of all of them.
*/
function find_all_moves_on_board(gameState, player_num) {
	var game_states = [];
	var count = 0;
	for( var i = 0; i<gameState.board.length; i++ ) {
		for( var j = 0; j<gameState.board[i].length; j++ ) {
			if( gameState.board[i][j] == EMPTY_MARKER ) {
				var next_game = copy_game(gameState);
				make_move(next_game, player_num, i, j);
				game_states.push(copy_game(next_game));
			}
		} 
	}
	return game_states;
}

/*
	This makes a move on a given board state -- if the move made is a capture, it updates for that as well.
	Returns the board state
*/
function make_move(gameState, player_num, row, col) {
	for( var i = -1; i<2; i++ ) {
		for( var j = -1; j<2; j++ ) {
			if( i != 0 || j != 0 ) {
				//if there are two pieces of the other player's in a row and then your own piece, then update to reflect the capture.
				if( count_other_player_in_row(gameState.board, row, col, i, j, player_num) == 2 ) {
					if( row + 3*i > -1 && row + 3*i < gameState.board.length &&
						col + 3*j > -1 && col + 3*j < gameState.board[row].length) {
						if( gameState.board[row + 3*i][col + 3*j] == player_num ) {
							gameState.board[row + 2*i][col + 2*j] = EMPTY_MARKER;
							gameState.board[row + i][col + j] = EMPTY_MARKER;
							if(player_num == 1) {
								gameState.human_captures++;
							} else {
								gameState.ai_captures++;
							}
						}
					}
				}
			}
		}
	}

	gameState.board[row][col] = player_num;
	return gameState;
}

/*
	Returns the number of pieces of the opposite color that are in a row in one direction from a starting piece

	example: 

	board = 
	x 0 0 - 
	0 x x -
	0 - - -

	want to count 0's in direction 0, 1 from spot (0,0) -- it will return 2.	
*/
function count_other_player_in_row(board, row, col, i, j, player_num) {
	var player_in_row_count = 1;
	var other_player = 0; 

	if(player_num == HUMAN_MARKER) {
		other_player = AI_MARKER;
	} else {
		other_player = HUMAN_MARKER;
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

/*
	This returns a deep copy of the game board to prevent updating the 'live' board version
	Returns the new board
*/
function copy_game(gameState) {
	var new_array = [];
	for( var i = 0; i<gameState.board.length; i++ ) {
		new_array.push(gameState.board[i].slice());
	}

	return { 
		board: new_array,
		ai_captures: gameState.ai_captures,
		human_captures: gameState.human_captures
	};
}


/*
	This function outputs a value for the current state of the board. 
	Higher return values means better board state for the whichever player for whom it is scored.
*/
function heuristic(gameState, player_num) {
	// TODO: THIS IS DUMB -- MAKE IT BETTER PLEASEEE

	var ret_val = 0;
	if(gameState.board[0][0] == 2) {
		return 100; 
	} else if(gameState.board[0][2] == 2) {
		return 99;
	} else {
		ret_val = -100;
	}

	return ret_val; 
}

/*
	Prints the gameboard to console 
*/
function print_game(gameState){
	var string_to_print = ""; 
	for( var i = 0; i<gameState.board.length; i++ ) {
		for( var j = 0; j<gameState.board[i].length; j++ ) {
			string_to_print += gameState.board[j][i] + ", "; 
		} 
		console.log(i + ": " + string_to_print)
		string_to_print = ""; 
	}
	console.log("Human Captures: " + gameState.human_captures);
	console.log("AI Captures: " + gameState.ai_captures);
}


