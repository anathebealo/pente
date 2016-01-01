
var fancyLineFunc = d3.svg.line()
	.x(function(d){ return  d.x; })
	.y(function(d){ return  d.y; })
	.interpolate('basis')
	.tension(0);

var fancyLineData = [
	{x: 0, y: 25},
 	{x: 7, y: 16},
  	{x: 13, y: 9},
  	{x: 30, y: 1},
  	{x: 45, y: 15},
  	{x: 40, y: 33},
  	{x: 28, y: 50},
  	{x: 46, y: 81},
  	{x: 76, y: 77},
  	{x: 93, y: 63},
  	{x: 101, y: 42},
  	{x: 91, y: 43},
  	{x: 85, y: 52},
  	{x: 86, y: 69},
  	{x: 97, y: 76},
  	{x: 115, y: 78},
  	{x: 132, y: 64},
  ]

var fancyRight = d3.select('#penteSpan').append('svg')
	.attr('width', 143)
	.attr('height', 83)

var fancyLeft = d3.select('#penteSpan').insert('svg', ':first-child')
	.attr('width', 143)
	.attr('height', 83)
	
var rightFancyPath = fancyRight.append('path')
	.attr('d', fancyLineFunc(fancyLineData))
	.attr('stroke', 'black')
	.attr('stroke-width', 4)
	.attr('fill', 'none')
	.attr('stroke-linecap', 'round')

var leftFancyPath = fancyLeft.append('path')
	.attr('d', fancyLineFunc(fancyLineData.map(function(d){return {x: 143-d.x, y: d.y} })))
	.attr('stroke', 'black')
	.attr('stroke-width', 4)
	.attr('fill', 'none')
	.attr('stroke-linecap', 'round')

var animateLine = function(path){
	var totalLength = path.node().getTotalLength();
	path
		.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.delay(500)
		.duration(1400)
		.ease("cubic-out")
		.attr("stroke-dashoffset", 0);
}
animateLine(leftFancyPath);
animateLine(rightFancyPath);
