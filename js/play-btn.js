
var playBtn = d3.select('#playBtn');
console.log('playBtn', playBtn)
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