
var playBtn = d3.select('#playBtn');
console.log('playBtn', playBtn)
playBtn
	.style('cursor', 'pointer')
	.on('mouseover', function(){
		d3.select(this).transition()
			.style('background-color', '#3261FC')
			.style('width', 420)
			.ease('cubic-in')
	})
	.on('mouseout', function(){
		d3.select(this).transition()
			.style('background-color', '#4B75FF')
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

			function addCapContent(plr, num){
				d3.select(plr)
					.append('h2')
					.text('Player ' + num + ' Captures')		
					.attr('class', 'capture-text')
					.style('opacity', '0')
					.transition()
					.duration(700)
					.ease('cubic-out')
					.style('opacity', '1')	
					.transition()
				d3.select(plr)
					.append('h3')
					.attr('class', 'capture-text-num')
					.text('0')
					.attr('id', 'capture-num-' + num)
			}

			var plrCaps = d3.selectAll('.cap-area').transition()
				.duration(700)
				.ease('cubic-out')
				.style('height', (boardSize + boardOffset*2) / 4) 
				.transition()
				.style('width', '250px')
				.style('border-style', 'solid')
				.style('border-width', '2px')
				.style('border-color', 'gray')
				.style('margin', '0px 20px')
				.style('border-top-left-radius', function(d, i){ return i == 0 ? '24px' : 0})
				.style('border-bottom-left-radius', function(d, i){return i == 0 ? '24px' : 0})
				.style('border-top-right-radius', function(d, i){return i == 1 ? '24px' : 0})
				.style('border-bottom-right-radius', function(d, i){return i == 1 ? '24px' : 0})
				.each('end', function(){
					d3.select('.cap-area.first').transition()
						.duration(800)
						.ease('cubic-out')
						.style('background-color', '#7AFF6C')
						.each('end', function(){
							addCapContent(this, '1')
						})

					d3.select('.cap-area.second').transition()
						
						.duration(800)
						.ease('cubic-out')
						.style('background-color', '#FF6C6C')
						.each('end', function(){
							addCapContent(this, '2')
						})

				})

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