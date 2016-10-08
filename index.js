'use strict';
var io=require('socket.io-client');
var request = require('request');
var libQ = require('kew');

// Define the GoogleMusic class
module.exports = fipNowPlaying;
function fipNowPlaying(context) {
	var self = this
	self.context = context;
	self.commandRouter = self.context.coreCommand;
	self.logger = self.context.logger;
	self.configManager = self.context.configManager;
	self.uri = 'http://www.fipradio.fr/livemeta/7'
	self.stream = new RegExp("fip-")	
}
fipNowPlaying.prototype.onVolumioStart = function() {
	var self = this
	var configFile=self.commandRouter.pluginManager.getConfigurationFile(self.context,'config.json')
	self.config = new (require('v-conf'))()
	self.config.loadFile(configFile);
}
fipNowPlaying.prototype.onStop = function() {	
}
fipNowPlaying.prototype.getConfigurationFiles = function(){
	return ['config.json'];
}
fipNowPlaying.prototype.onStart = function() {
	var self = this
	//var defer = libQ.defer()
	
	self.setupListeners()

	return libQ.resolve()
}
fipNowPlaying.prototype.setupListeners = function() {
	var self = this
	
	/** Init SocketIO listener */
	self.libSocketIO = io.connect('http://localhost:3000');	
	/** On Client Connection, listen for various types of clients requests */
	self.libSocketIO.on('connect'
	, function (connWebSocket) {
		
		self.libSocketIO.on('pushState', function (state) {
			
			if (state.service=="webradio" && self.stream.test(state.title)) {
				// should place ticker here
				var metadata = self.getMetadata
				self.commandRouter.pushConsoleMessage(JSON.stringify(metadata))
			}
			else {
				// should remove ticker here
			}
	});

	})

}
fipNowPlaying.prototype.getMetadata = function() {
	var self = this;
	request({uri: self.uri}, function(err, response, data){
		//Just a basic error check
		if(err && response.statusCode !== 200){console.log('Request error.');}

		self.currentTrack = {};
		var metas = JSON.parse(data)
		var level = metas.levels[0]
		var uid = level.items[level.position]
		var step = metas['steps'][uid]		
		self.currentTrack.artist = step.authors
		self.currentTrack.title = step.title
		self.currentTrack.label = step.label
		self.currentTrack.album = step.titreAlbum
		self.currentTrack.annee = step.anneeEditionMusique
		self.currentTrack.albumArt = step.visual
		
		return self.currentTrack
	});
}
