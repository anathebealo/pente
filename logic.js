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
	if (!size) size = 15;
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
	if (!WIN.isWin){
		make_ai_move();
	}
}

function make_ai_move() {
	// var new_game = find_next_move(gameState, 1);
	// print_game(new_game)
	// var row;
	// var col;
	// for( var i = 0; i < new_game.board.length; i++) {
	// 	for( var j = 0; j<new_game.board[i].length; j++) {
	// 		if(new_game.board[i][j] != gameState.board[i][j] && new_game.board[i][j] == AI_MARKER) {
	// 			row = i; 
	// 			col = j;
	// 			break;
	// 		}
	// 	}
	// }
	var row = 1;
	var col = 1;

	function getDirections(){
		return [-1, 1, 0].map(function(x){
			return [-1, 1, 0].map(function(y){
				return {x:x, y:y};
			})
		}).reduce(function(accum, list){
			return accum.concat(list);
		}).splice(0, 8);
	}
	function getValidLine(start, direction, length){
		return d3.range(length).map(function(distance){
			return {
				x: start.x + distance*direction.x,
				y: start.y + distance*direction.y,
				distance: distance
			}
		}).filter(function(spot){
			return spot.x > -1 
				&& spot.y > -1 
				&& spot.x < gameState.board.length 
				&& spot.y < gameState.board.length;
		})
	}

	var allDirections = getDirections();
	var highest = {
		row: 0,
		col: 0,
		score: -1
	}
	gameState.board.forEach(function(x, rowIndex){
		x.forEach(function(y, colIndex){
			var cellRank = 0;
			var here = {x: rowIndex, y: colIndex}
			var score = 0;

			allDirections.forEach(function(direction){
				var line = getValidLine(here, direction, 5);
				// console.log(line)
				var lineOwner = 0;
				var lineCount = 0;
				line.forEach(function(spot, spotIndex){

					var marker = gameState.board[spot.x][spot.y];
					if (marker == AI_MARKER){
						score += (5 - spot.distance) * 2;
					}
					if (marker == HUMAN_MARKER){
						score += (5 - spot.distance);
					}
				})
				var humanCount = 0;
				var humanBreak = undefined;
				line.forEach(function(spot, spotIndex){
					if (!humanBreak){
						var marker = gameState.board[spot.x][spot.y];
						if (marker == HUMAN_MARKER)	{
							humanCount += 1;
						} else if (spotIndex > 0){
							humanBreak = true;
						}				
					}
				})
				var meCount = 0;
				var meBreak = undefined;
				line.forEach(function(spot, spotIndex){
					if (!meBreak){
						var marker = gameState.board[spot.x][spot.y];
						if (marker == AI_MARKER)	{
							meCount += 1;
						} else if (spotIndex > 0){
							meBreak = true;
						}				
					}
				})
				if (humanCount > 2){
					score += humanCount * humanCount * humanCount;
					// console.log()
				}
				if (meCount > 2){
					score += meCount * meCount * meCount;
					score -= 1;
				}
			})

			if (score > highest.score && gameState.board[here.x][here.y] == 0){
				highest.score = score;
				highest.row = rowIndex;
				highest.col = colIndex;
			}
			// console.log(score)
			// var s = allDirections.map(function(direction){
			// 	return getValidLine(here, direction, 5).map(function(spot){
			// 		var marker = gameState.board[spot.x][spot.y];
			// 		if (marker == AI_MARKER){
			// 			return (5 - distance) * 2;
			// 		} else if (marker == HUMAN_MARKER){
			// 			return (5 - distance);
			// 		} else {
			// 			return 0;
			// 		}
			// 	}).reduce(function(accum, score){
			// 		return accum + score;
			// 	});
			// })
			// console.log(s);
		})
	})
	row = highest.row;
	col = highest.col;

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
	// print_game(gameState);
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