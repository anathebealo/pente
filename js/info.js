
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

var animateInfoSignOut = function(force){


	var top = info[0][0].offsetTop;
	var bottom = top + info[0][0].offsetHeight;
	var mousey = d3.mouse(d3.select('body').node())[1]
	
	if (top <= mousey && mousey <= bottom || !infoSignIn || animatingInfoSignOut) {
		if (!force) // silly hardcoded check. I don't give a rats bum.
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
	.style('cursor', 'pointer')
	.on('click', function(){
		if (infoSignIn){
			animateInfoSignOut(true);
		} else {
			animateInfoSignIn();
		}
	})
	// .on('mouseenter', function(){
	// 	infoSign.transition()
	// 		.style('font-size', '72px')
	// })
	// .on('mouseleave', function(){
	// 	infoSign.transition()
	// 		.style('font-size', '64px')
	// })



// info
//  	.on('mouseout', animateInfoSignOut)
d3.select('body').on('mousemove', animateInfoSignOut);
