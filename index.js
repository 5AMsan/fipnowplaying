'use strict';
var io=require('socket.io-client');

// Define the GoogleMusic class
module.exports = fipNowPlaying;
function fipNowPlaying(context) {
	var self = this
	self.socket= io.connect('http://localhost:3000');
	
	
}
fipNowPlaying.prototype.onVolumioStart = function() {
	
}
fipNowPlaying.prototype.onStart = function() {
	socket.on('play',function(data)
	{
		console.log(data);
		process.exit()
		
	})
}
