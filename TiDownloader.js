// Constructor
//==============================================================================
function TiDownloader(win, bgColor, progressColor) {
	this.win              = win;
	this.bgColor          = bgColor || '#3E4650';
	this.progressColor    = progressColor || '#FFFFFF';
	this.feedbackView     = null;
	this.feedbackPadding  = null;
	this.feedbackProgress = null;
	this.xhr              = null;
};

// Download a file from a given url to a given path
//==============================================================================
TiDownloader.prototype.download = function(args, callback) {

	// Needed in some contexts
	var that = this;

	// Create a feedback view
	this.feedbackView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 50,
		bottom: -50,
		backgroundColor: that.bgColor,
		zIndex: 101
	});

	// Create a padding view
	this.feedbackPadding = Ti.UI.createView({
		left: 20,
		right: 20
	});

	// Add the padding view to the feedback view
	this.feedbackView.add(this.feedbackPadding);

	// Create a progress view
	this.feedbackProgress = Ti.UI.createView({
		width: "0%",
		height: 2,
		backgroundColor: that.progressColor,
		left: 0
	});

	// Add the progress view to the feedback padding view
	this.feedbackPadding.add(this.feedbackProgress);

	// Add the feedback view to the window
	this.win.add(this.feedbackView);

	// Feedbackview animation
	this.feedbackView.animate({
		bottom: 0,
		duration: 300,
		delay: 150
	});

	Ti.API.info('Feedback view added to the window.');

	// Download the file
	//==========================================================================
	this.xhr = Ti.Network.createHTTPClient({
		onload: function() {
			var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, args.filename);
			f.write(this.responseData);

			Ti.API.info('Download finished successfully.');

			callback(null, Ti.Filesystem.applicationDataDirectory + args.filename);
		},
		ondatastream: function(e) {
			// Update progress view
			var progress = Math.round(e.progress * 100);

			that.feedbackProgress.width = (progress < 100 ? progress : 100) + '%';
		},
		onerror: function(err) {
			Ti.API.info('Download finished with errors:');
			callback(err);
		},
		timeout : 10000
	});

	this.xhr.open('GET', args.url);
	this.xhr.send();

	Ti.API.info('Starting download of ' + args.filename + '.');

};

// Cleanup function
//==============================================================================
TiDownloader.prototype.cleanup = function() {

	// Needed in setTimeout scope
	var that = this;

	// Animate the feedback view out of the window
	this.feedbackView.animate({
		bottom: -60,
		duration: 150
	});

	setTimeout(function() {
		// Remove children of that.feedbackView
		that.feedbackView.removeAllChildren();

		// Remove views from window
		that.win.remove(that.feedbackView);

		// Null all variables
		that.win              = null;
		that.bgColor          = null;
		that.progressColor    = null;
		that.xhr              = null;
		that.feedbackView     = null;
		that.feedbackPadding  = null;
		that.feedbackProgress = null;
		that                  = null;

		Ti.API.info('Downloader cleaned up.');
	}, 150);

};

// Export the module
//==============================================================================
module.exports = TiDownloader;
