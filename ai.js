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
	var next_move = max_value(gameState, depth).game_state;
	return next_move; 
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
		console.log('from max, depth', depth, 'there are ', all_games.length, 'games')

		all_games.forEach(function(next_game){
			var min_val = min_value(next_game, depth -1);
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
				// if (i == 3 && j == 2 && player_num == AI_MARKER){
				// 	console.log('holy cows')
				// }
				make_move(next_game, player_num, i, j);
				game_states.push(copy_game(next_game));
			}
		} 
	}
	return game_states;
}

function check_for_and_update_capture(gameState, player_num, row, col, x_direction, y_direction) {
	//if there are two pieces of the other player's in a row and then your own piece, then update to reflect the capture.
	if( count_other_player_in_row(gameState.board, row, col, x_direction, y_direction, player_num) == 2 ) {
		if( row + 3*x_direction > -1 && row + 3*x_direction < gameState.board.length &&
			col + 3*y_direction > -1 && col + 3*y_direction < gameState.board[row].length) {
			if( gameState.board[row + 3*x_direction][col + 3*y_direction] == player_num ) {
				gameState.board[row + 2*x_direction][col + 2*y_direction] = EMPTY_MARKER;
				gameState.board[row + x_direction][col + y_direction] = EMPTY_MARKER;
				if(player_num == 1) {
					gameState.human_captures++;
				} else {
					gameState.ai_captures++;
				}
			}
		}
	}
}

/*
	This makes a move on a given board state -- if the move made is a capture, it updates for that as well.
	Returns the board state
*/
function make_move(gameState, player_num, row, col) {
	for( var i = -1; i<2; i++ ) {
		for( var j = -1; j<2; j++ ) {
			if( i != 0 || j != 0 ) {
				check_for_and_update_capture(gameState, player_num, row, col, i, j);
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

	inputs: 
		board:  		gameboard
		row: 			i value we are starting from
		col: 			j value we are starting from
		x_direction: 	direction along rows
		y_direction: 	direction along columns
		player_num: 	color pieces we are counting

	output: 
		number in row
*/
function count_other_player_in_row(board, row, col, x_direction, y_direction, player_num) {
	var player_in_row_count = 1;
	var other_player = 0; 

	if(player_num == HUMAN_MARKER) {
		other_player = AI_MARKER;
	} else {
		other_player = HUMAN_MARKER;
	}

	while( true ){
		if(row + x_direction*player_in_row_count > -1 && row + x_direction*player_in_row_count < board.length &&
			col + y_direction*player_in_row_count > -1 && col + y_direction*player_in_row_count < board[row].length) {

			if( board[row + x_direction*player_in_row_count][col + y_direction*player_in_row_count] == other_player){
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
	returns number of one player's pieces in a row. 

	inputs: 
		board:  		gameboard
		row: 			i value we are starting from
		col: 			j value we are starting from
		x_direction: 	direction along rows
		y_direction: 	direction along columns
		player_num: 	color pieces we are counting

	output: 
		number in row
*/
function count_player_in_row(board, row, col, x_direction, y_direction, player_num) {
	var player_in_row_count = 1;

	while( true ){
		//check if new spot in bounds
		if(row + x_direction*player_in_row_count > -1 && row + x_direction*player_in_row_count < board.length &&
			col + y_direction*player_in_row_count > -1 && col + y_direction*player_in_row_count < board[row].length) {

			if( board[row + x_direction*player_in_row_count][col + y_direction*player_in_row_count] == player_num){
				player_in_row_count++;
			} else {
				return player_in_row_count;
			}

		} else {
			return player_in_row_count;
		}
	}
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


function get_other_player(player_num){
	return player_num == AI_MARKER ? HUMAN_MARKER : AI_MARKER;
}

/*
	This function outputs a value for the current state of the board. 
	Higher return values means better board state for the whichever player for whom it is scored.
*/
function heuristic(gameState, player_num) {


	function rankCell(x, y){
		if (gameState.board[x][y] == 0) return 0;

		var rank = 0;

		// rank += gameState.board[x][y] == player_num ? 2 : 1; // more of our pieces is good.

		for( var x_direction = -1; x_direction<2; x_direction++ ) {
			for( var y_direction = -1; y_direction<2; y_direction++ ) {
				if( x_direction != 0 || y_direction != 0 ) {
					rank += count_player_in_row(gameState.board, x, y, x_direction, y_direction, get_other_player(player_num))
					// console.log('rank is ', rank, 'at', x, y)
					// rank += 2*count_player_in_row(gameState.board, x, y, x_direction, y_direction, player_num)
					// var next_x = x + x_direction;
					// var nextY = y + y_direction;
				}
			}
		}

		return rank;
	}

	var ret_val = 0;
	for (var x = 0; x < gameState.board.length ; x ++){
		if (gameState.board[x][1] == player_num)
			ret_val += 200;
	}



	return ret_val;
}


/*
	returns object with win conditions 
		isWin {true or false}
		winner {1 or 2}
		reason {"captures" or "five"}
*/
function check_for_win(gameState) {

	WIN = { 
		isWin: false,
		winner: EMPTY_MARKER,
		reason: "none"
	};

	var fiveInRow = is_five_in_row(gameState.board);
	if( fiveInRow.isFive ) {
		if( gameState.human_captures == 5 ) {
			WIN = {
				isWin: true,
				winner: HUMAN_MARKER,
				reason: "five in row and captures"
			};
		} else if( gameState.ai_captures == 5 ) {
			WIN = {
				isWin: true,
				winner: AI_MARKER,
				reason: "five in row and captures"
			};
		}

		WIN = {
			isWin: true,
			winner: fiveInRow.winner,
			reason: "five"
		};

	}

	if( gameState.human_captures == 5 ) {
		WIN = {
			isWin: true,
			winner: HUMAN_MARKER,
			reason: "captures"
		};

	} else if( gameState.ai_captures == 5 ) {
		WIN = {
			isWin: true,
			winner: AI_MARKER,
			reason: "captures"
		};
	}
}

/*
	returns object with five in row conditions 
		isFive {true or false}
		winner {1 or 2}
*/
function is_five_in_row(board) {
	var num_in_row = 0;

	for(var row = 0; row<board.length; row++) {
		for(var col = 0; col<board[row].length; col++) {
			for( var x_direction = -1; x_direction<2; x_direction++ ) {
				for( var y_direction = -1; y_direction<2; y_direction++ ) {
					if( x_direction != 0 || y_direction != 0 ) {
						if( board[row][col] == 1 || board[row][col] == 2) {
							num_in_row = count_player_in_row(board, row, col, x_direction, y_direction, board[row][col]);
							if( num_in_row >= 5 ) {
								return {
									isFive: true,
									winner: board[row][col]
								};
							}
						}
					} 
				}
			}
		} //end col loop
	} //end row loop

	return {
		isFive: false,
		winner: EMPTY_MARKER
	};
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


