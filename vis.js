

 var svg2 = d3.select('#authors')
	.append('svg')
	.attr('class', 'chart')
	.attr('width', 300)
	.attr('height', 100)
	.style('position', 'absolute')
	.style('left', 95)
	.style('top', 70);
var defs = svg2.append('svg:defs');
defs.append('svg:pattern')
    .attr('id', 'anaImage')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', '150')
    .attr('height', '150')
    .append('svg:image')
    .attr('xlink:href', 'ana.png')
    .attr('x', -20)
    .attr('y', 0)
    .attr('width', 150)
    .attr('height', 150);

defs.append('svg:pattern')
    .attr('id', 'chrisImage')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', '150')
    .attr('height', '150')
    .append('svg:image')
    .attr('xlink:href', 'chris.png')
    .attr('x', -20)
    .attr('y', 0)
    .attr('width', 150)
    .attr('height', 150);

var anaFace = svg2.append("circle")
	.attr("class", "logo")
	.attr("cx", 60)
	.attr("cy", 50)
	.attr("r", 0)
	.style("fill", "url(#anaImage)")       
	.style("stroke", "black")     
	.style("stroke-width", 2)
var chrisFace = svg2.append("circle")
	.attr("class", "logo2")
	.attr("cx", 200)
	.attr("cy", 50)
	.attr("r",0)
	.style("fill", "url(#chrisImage)")       
	.style("stroke", "black")     
	.style("stroke-width", 2)


d3.select('#ana')
	.on('mouseover', function(){
		anaFace.transition()
			// .ease('elastic')
			.attr('r', 50)
	})
	.on('mouseout', function(){
		anaFace.transition()
			// .ease('elastic')
			.attr('r', 0)
	})

d3.select('#chris')
	.on('mouseover', function(){
		chrisFace.transition()
			// .ease('elastic')
			.attr('r', 50)
	})
	.on('mouseout', function(){
		chrisFace.transition()
			// .ease('elastic')
			.attr('r', 0)
	})


var info = d3.select("#info");
var infoSign = info.select("#sign");
infoSign
	.style('transform', 'rotate(0deg)')
	.style('position', 'relative')
	.style('left', 0)

var infoContent = d3.select('#infoContent')


var animatingInfoSignIn = false;
var infoSignIn = false;
var animatingInfoSignOut = false;
var animateInfoSignIn = function(d){
	
	console.log('in');
	if (animatingInfoSignIn) return;
	animatingInfoSignIn = true;

	if (animatingInfoSignOut) return;

	infoContent.transition()
		.duration(1500)
		.ease('cubic-in-out')
		.style('opacity', 1)
		.style('z-index', 3);
	

	infoSign.transition()
		.duration(1500)
		.ease('cubic-in-out')
		.style('color', 'black')
		.style('transform', 'rotate(720deg)')
		.style('left', -200)
		.each('end', function(){
			infoSignIn = true;
			 animatingInfoSignIn = false;
		})

}

var animateInfoSignOut = function(){


	var top = info[0][0].offsetTop;
	var bottom = top + info[0][0].offsetHeight;
	var mousey = d3.mouse(d3.select('body').node())[1]
	
	if (top <= mousey && mousey <= bottom || !infoSignIn || animatingInfoSignOut) {
		return
	}

	if (!animatingInfoSignOut)
		animatingInfoSignOut = true;

	infoContent.transition()
		.duration(1000)
		.ease('cubic-in-out')
		.style('opacity', 0)
		.style('z-index', -3);

	infoSign.transition()
		.duration(1500)
		.ease('cubic-in-out')
		.style('color', 'gray')
		.style('transform', 'rotate('+(-720)+'deg)')

		.style('left', 0)
		.each('end', function(){
			animatingInfoSignIn = false;
			infoSignIn = false;
			animatingInfoSignOut = false;
		})
}

info.transition()
	.style('opacity', 1)

infoSign
	.on('mouseover', animateInfoSignIn)
// info
//  	.on('mouseout', animateInfoSignOut)
d3.select('body').on('mousemove', animateInfoSignOut);

var playBtn = d3.select('#playBtn');
playBtn
	.style('cursor', 'pointer')
	.on('mouseover', function(){
		console.log('hi')
		d3.select(this).transition()
			.style('background-color', 'red')
			.style('width', 420)
			.ease('cubic-in')
	})
	.on('mouseout', function(){
		d3.select(this).transition()
			.style('background-color', '#FF4B4B')
			.style('width', 400)
			.ease('cubic-out')
	})
	.on('click', function(){

		if (firstPlay){
			svg.transition()
				.duration(700)
				.ease('cubic-out')
				.attr('height', boardSize + boardOffset*2)
				.style('border-style', 'solid')
				.each('end', function(){
					renderLines(renderBoard);


				})
			d3.select('#title').transition()
				.duration(400)
				.ease('cubic-out')
				.style('padding-top', '0')
			d3.select('#playBtn').transition()
				.text('Reset')
			firstPlay = false;
		} else {
			
			var easeFunc = function(t){
				return t;
			}

			var delay = 80;
			boardState = makeBoard();
			// cellEaseFunc = easeFunc;
			svg.selectAll('.cell').transition()
				.delay(function(d, i, j){ 
					var x = Math.floor(i/boardState.length);
					var y = (i%boardState.length);
					
					var xD = boardState.length/2 - x;
					var yD = boardState.length/2 - y;
					var dist = Math.sqrt((xD*xD) + (yD*yD));
					return dist * delay;
				})
				.attr('r', 0)
				.duration(delay*2)
				.ease('linear')
				.each('end', function(d, i){
					d3.select(this).remove();
					if (i == boardState.length * boardState.length -1){
						d3.selectAll('.row').remove();
						cellEntranceDelay = delay
						renderBoard();
					}
				})
		}


	})

var gameBoard = d3.select('#gameboard');
gameBoard
	.style('width', '100%')

var firstPlay = true;
var lineSpace = 32;
var boardSize = (boardState.length-1) * lineSpace;
var boardOffset = lineSpace;
var playerColor = 'green';
var cpuColor = 'red';
var cellEaseFunc = 'linear'
var cellEntranceDelay = 160;

var svg = gameBoard.append('svg')
	.attr('width', 0)
	.attr('height', 0)
	.attr('width', boardSize + boardOffset*2)
	.style('margin', 'auto')
	.style('background-color', '#C4BFBF')


//lines are in the form of horizontal, then vertical
var lines = [[]];
boardState.forEach(function(row, index){

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

				var xD = boardState.length/2 - x;
				var yD = boardState.length/2 - y;
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
		var state = boardState[i][j];
		return state;
	}

	var getColor = function(d, i, j){
		var state = getState(d, i, j);
		var color = '#828282';
		if (state == PLAYER_NUM){
			color = 'green';
		} 
		if (state == AI_NUM){
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
		.data(boardState)
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
			var y = Math.floor(i/boardState.length);
			var x = (i%boardState.length);
			return getColor(d, x, y);
		})
		.attr('r', function(d, i){
			var y = Math.floor(i/boardState.length);
			var x = (i%boardState.length);
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
			var xD = boardState.length/2 - i;
			var yD = boardState.length/2 - j;
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
				//boardState[i][j] = PLAYER_NUM;
				
				make_human_move(boardState, PLAYER_NUM, i, j);
				d3.select(this).transition()
					.ease("cubic-out")
					.duration(500)
					.style('fill', 'green')
					.style('stroke-width', 2.5)
					.attr('r', getSize(d, i, j))
			}
		})

}
