


var svg = gameBoard.append('svg')
	.attr('width', 0)
	.attr('height', 0)
	.attr('width', boardSize + boardOffset*2)
	.style('margin', 'auto')
	.style('background-color', '#C4BFBF')


//lines are in the form of horizontal, then vertical
var lines = [[]];
gameState.board.forEach(function(row, index){

	var line = [];
	line.push({
		x: 0,
		y: index * lineSpace
	})
	line.push({
		x: boardSize,
		y: index * lineSpace
	})
	lines.push(line);

	line = [];
	line.push({
		y: 0,
		x: index * lineSpace
	})
	line.push({
		y: boardSize,
		x: index * lineSpace
	})
	lines.push(line);

})


var renderLines = function(callBack){

	var lineFunc = d3.svg.line()
		.x(function(d){ return boardOffset + d.x; })
		.y(function(d){ return boardOffset + d.y; })
		.interpolate('linear');

	var lineElements = svg.selectAll('.line')
		.data(lines)
		.enter()
		.append('path')
		.attr('class', 'line')
		.attr('d', function(d){return lineFunc(d)})
		.attr('stroke', '#C4BFBF')
		.attr('stroke-width', 2)

	svg.selectAll('.line')
		.transition()
		.delay(function(d, i){
			d = lines[i];
			
			var delay = 0;
			if (d.length > 0){
				var x = ((d[0].x+d[1].x)/2) / lineSpace;
				var y = ((d[0].y+d[1].y)/2) / lineSpace;

				var xD = gameState.board.length/2 - x;
				var yD = gameState.board.length/2 - y;
				var dist = Math.sqrt((xD*xD) + (yD*yD));
				return dist * 50;
				
			}

			return delay;
		})
		.attr('stroke', 'black')
		.duration(500)
		.each('end', function(d, i){
			if (i == lines.length - 1){
				callBack();
			}
		})
}


var renderBoard = function(){

	var getState = function(d, i, j){
		var state = gameState.board[i][j];
		return state;
	}

	var getColor = function(d, i, j){
		var state = getState(d, i, j);
		var color = '#828282';
		if (state == HUMAN_MARKER){
			color = 'green';
		} 
		if (state == AI_MARKER){
			color = 'red';
		}
		return color;
	}

	var getSize = function(d, i, j){
		var state = getState(d, i, j);
		var size = cellSize;
		if (state != 0){
			size = cellSize * 1.2
		}
		return size;
	}

	var rows = svg.selectAll('.row')
		.data(gameState.board)
		.enter()
		.append('g')
		.attr('class', 'row')
		.attr('width', '100%')
		.attr('height', '100%')

	var cellSize = lineSpace / 3;

	var cellData = rows.selectAll('.cell')
		.data(function(d, i){
			return d
		})

	svg.selectAll('.cell')
		.transition()
		.ease('elastic')
		.duration(500)
		.style('fill', function(d, i){
			var y = Math.floor(i/gameState.board.length);
			var x = (i%gameState.board.length);
			return getColor(d, x, y);
		})
		.attr('r', function(d, i){
			var y = Math.floor(i/gameState.board.length);
			var x = (i%gameState.board.length);
			return getSize(d, x, y);
		})
	var cells = cellData.enter()
		.append('circle')
		.attr('class', 'cell')
		.attr('cx', function(d, i, j){
			return boardOffset + i * lineSpace;
		})
		.attr('cy', function(d, i, j){
			return boardOffset + j * lineSpace;
		})
		.attr('r', 0)
		.style('fill', getColor)
		.style('stroke', 'black')
		.style('stroke-width', 2.5)
		.style('cursor', 'pointer')
	

	cells.transition()
		.delay(function(d, i, j){ 
			var xD = gameState.board.length/2 - i;
			var yD = gameState.board.length/2 - j;
			var dist = Math.sqrt((xD*xD) + (yD*yD));
			return dist * cellEntranceDelay;
		})
		.attr('r', getSize)
		.ease(cellEaseFunc)
		.duration(cellEntranceDelay*2)

	cells
		.on('mouseover', function(d, i, j){
			if (getState(d, i, j) == 0){
				d3.select(this).transition()
					.ease("elastic")
					.duration(500)
					.style('fill', 'lime')
					.style('stroke-width', 4)
					.attr('r', cellSize*1.3)
			} else {
				d3.select(this).transition()
					.ease("elastic")
					.duration(500)
					.attr('r', cellSize*1.3)
			}
		})
		.on('mouseout', function(d, i, j){
			d3.select(this).transition()
				.ease("cubic-out")
				.duration(500)
				.style('fill', getColor(d, i, j))
				.style('stroke-width', 2.5)
				.attr('r', getSize(d, i, j))
		})
		.on('click', function(d, i, j){
			if (getState(d, i, j) == 0){
				//gameState.board[i][j] = HUMAN_MARKER;
				
				make_human_move(i, j);
				d3.select(this).transition()
					.ease("cubic-out")
					.duration(500)
					.style('fill', 'green')
					.style('stroke-width', 2.5)
					.attr('r', getSize(d, i, j))
			}
		})

}
