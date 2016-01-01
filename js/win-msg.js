var winMsg = function (){
	var self = {};

	self.getBox = function(){
		return d3.select('#win');
	}

	self.showGreenMsg = function(text){
		self.showMsg(text, '#008D11', '#00A414')
	}

	self.showRedMsg = function(text){
		self.showMsg(text, '#8D0000', '#A40000')
	}

	self.hideMsg = function(){

		self.getBox().selectAll('*')
			.transition()
			.duration(500)
			.style('opacity', '0')

	}

	self.showMsg = function(text, backColor, frontColor, textColor){

		self.hideMsg();
		setTimeout(function(){


		self.getBox().html('')

		backColor = backColor || '#6B6B6B';
		frontColor = frontColor || '#797979';
		textColor = textColor || 'white';

		var leftTop = self.getBox().append('div')
		var leftLow = self.getBox().append('div')

		var leftSpacer = self.getBox().append('div')
		var msgDiv = self.getBox().append('div')
		var rightSpacer = self.getBox().append('div')

		var rightTop = self.getBox().append('div')
		var rightLow = self.getBox().append('div')

		leftSpacer
			.attr('class', 'msg-back msg-spacer')
			.style('background-color', backColor)

		rightSpacer
			.attr('class', 'msg-back msg-spacer')
			.style('background-color', backColor)

		leftLow
			.attr('class', 'msg-back msg-tip msg-tip-left-low')
			.style('vertical-align', 'bottom')
			.style('border-bottom-color', backColor)

		leftTop
			.attr('class', 'msg-back msg-tip msg-tip-left-top')
			.style('vertical-align', 'top')
			.style('border-top-color', backColor)

		rightTop
			.attr('class', 'msg-back msg-tip msg-tip-right-top')
			.style('vertical-align', 'top')
			.style('border-top-color', backColor)

		rightLow
			.attr('class', 'msg-back msg-tip msg-tip-right-low')
			.style('vertical-align', 'bottom')
			.style('border-bottom-color', backColor)

		msgDiv
			.attr('class', 'msg')
						.style('display', 'inline-block')

			.style('margin', 'auto')
			.style('width', '0px')
			.style('height', '100%')
			.style('background-color', frontColor)
		
		msgDiv.transition()
			.duration(1100)
			.ease('elastic')
			.style('width', '50%')

		d3.select('.msg')
			.append('span')
			.attr('class', 'msg-text')
			.style('color', textColor)
			.style('opacity', '0')
			.text(text)
			.transition()
			.style('opacity', '1')

		}, 600)
	}

	return self;
}();

setTimeout(function(){
	winMsg.showMsg('Welcome to Pente')
	
}, 1000)

// winMsg.showRedMsg('The Computer Won :(')
// // winMsg.showRedMsg('The Computer Won :(')

// setTimeout(function(){
// 	winMsg.showGreenMsg('The Human Wins!!')
// 	// winMsg.hideMsg()
// },2000)
// setTimeout(function(){
// // winMsg.showRedMsg('The Computer Wins!')
	
// }, 5000)


